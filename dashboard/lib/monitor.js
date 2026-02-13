/**
 * CPF Request Monitor - Tracks WHO calls WHAT and HOW MUCH
 *
 * All data in-memory (ring buffers with limits). Zero DB writes, zero extra queries.
 * Postgres native stats queried ONLY on-demand when /api/db-stats is called,
 * reusing the existing connection pool.
 */

const config = require('../config');

// =============================================================================
// Configuration
// =============================================================================
const MAX_RECENT_REQUESTS = 200;       // Ring buffer: last N requests
const MAX_IPS = 500;                   // Max distinct IPs tracked
const MAX_ENDPOINTS = 200;             // Max distinct endpoints tracked
const HOURLY_BUCKETS = 72;             // 72 hours of hourly buckets
const SUSPICIOUS_RPM = 120;            // Requests/min threshold for flagging an IP

// =============================================================================
// In-memory stores
// =============================================================================
const startTime = Date.now();

// Ring buffer of recent requests
const recentRequests = [];

// Per-IP aggregation: { ip: { count, bytes, first_seen, last_seen, endpoints: {}, user_agent, flagged } }
const ipStats = new Map();

// Per-endpoint aggregation: { "METHOD /path": { count, total_bytes, total_duration_ms, errors, last_called } }
const endpointStats = new Map();

// Hourly time-series buckets: [{ hour, requests, bytes, unique_ips }]
const hourlyBuckets = [];

// Per-IP rate tracking for abuse detection (sliding window)
// { ip: [timestamp, timestamp, ...] } - last 60s of request timestamps
const ipRateWindow = new Map();

// =============================================================================
// Middleware - pure in-memory, zero DB overhead
// =============================================================================

/**
 * Express middleware - attach to app.use() BEFORE routes
 */
function requestTracker(req, res, next) {
  // Skip static files and socket.io to reduce noise
  if (req.path.startsWith('/socket.io') ||
      req.path.match(/\.(js|css|png|jpg|ico|svg|woff|woff2|ttf|map)$/)) {
    return next();
  }

  const startMs = Date.now();
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

  // Hook into response finish
  const originalEnd = res.end;
  let responseSize = 0;

  res.end = function(chunk, encoding) {
    if (chunk) {
      responseSize += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
    }
    res.end = originalEnd;
    res.end(chunk, encoding);

    const durationMs = Date.now() - startMs;
    const statusCode = res.statusCode;

    // Normalize endpoint path (replace dynamic params with :param)
    const normalizedPath = normalizePath(req.route?.path || req.path, req.method);

    recordRequest({
      timestamp: new Date().toISOString(),
      ip,
      method: req.method,
      path: req.path,
      normalized: normalizedPath,
      status: statusCode,
      bytes: responseSize,
      duration_ms: durationMs,
      user_agent: userAgent
    });
  };

  next();
}

// =============================================================================
// Recording - pure in-memory
// =============================================================================

function normalizePath(routePath, method) {
  // Use Express route pattern if available, otherwise normalize manually
  let normalized = routePath || '/unknown';
  // Collapse UUIDs and org IDs
  normalized = normalized.replace(/org-[a-z0-9-]+/g, ':orgId');
  // Collapse indicator IDs like 1.5, 10.3
  normalized = normalized.replace(/\/\d+\.\d+/g, '/:indicatorId');
  return `${method} ${normalized}`;
}

function recordRequest(entry) {
  // 1. Ring buffer
  recentRequests.push(entry);
  if (recentRequests.length > MAX_RECENT_REQUESTS) {
    recentRequests.shift();
  }

  // 2. Per-IP stats
  let ip = ipStats.get(entry.ip);
  if (!ip) {
    if (ipStats.size >= MAX_IPS) {
      // Evict oldest IP
      const oldest = [...ipStats.entries()].sort((a, b) =>
        new Date(a[1].last_seen) - new Date(b[1].last_seen)
      )[0];
      if (oldest) ipStats.delete(oldest[0]);
    }
    ip = { count: 0, bytes: 0, first_seen: entry.timestamp, last_seen: null, endpoints: {}, user_agent: entry.user_agent, flagged: false };
    ipStats.set(entry.ip, ip);
  }
  ip.count++;
  ip.bytes += entry.bytes;
  ip.last_seen = entry.timestamp;
  ip.user_agent = entry.user_agent;
  ip.endpoints[entry.normalized] = (ip.endpoints[entry.normalized] || 0) + 1;

  // 3. Per-endpoint stats
  let ep = endpointStats.get(entry.normalized);
  if (!ep) {
    if (endpointStats.size >= MAX_ENDPOINTS) {
      const smallest = [...endpointStats.entries()].sort((a, b) => a[1].count - b[1].count)[0];
      if (smallest) endpointStats.delete(smallest[0]);
    }
    ep = { count: 0, total_bytes: 0, total_duration_ms: 0, errors: 0, last_called: null };
    endpointStats.set(entry.normalized, ep);
  }
  ep.count++;
  ep.total_bytes += entry.bytes;
  ep.total_duration_ms += entry.duration_ms;
  if (entry.status >= 400) ep.errors++;
  ep.last_called = entry.timestamp;

  // 4. Hourly bucket
  const hourKey = entry.timestamp.slice(0, 13); // "2026-02-13T14"
  let bucket = hourlyBuckets.find(b => b.hour === hourKey);
  if (!bucket) {
    bucket = { hour: hourKey, requests: 0, bytes: 0, unique_ips: new Set() };
    hourlyBuckets.push(bucket);
    // Trim old buckets
    while (hourlyBuckets.length > HOURLY_BUCKETS) {
      hourlyBuckets.shift();
    }
  }
  bucket.requests++;
  bucket.bytes += entry.bytes;
  bucket.unique_ips.add(entry.ip);

  // 5. Rate tracking (abuse detection)
  const now = Date.now();
  let timestamps = ipRateWindow.get(entry.ip);
  if (!timestamps) {
    timestamps = [];
    ipRateWindow.set(entry.ip, timestamps);
  }
  timestamps.push(now);
  // Keep only last 60s
  const cutoff = now - 60000;
  while (timestamps.length > 0 && timestamps[0] < cutoff) {
    timestamps.shift();
  }
  // Flag if above threshold
  if (timestamps.length > SUSPICIOUS_RPM) {
    ip.flagged = true;
  }
}

// =============================================================================
// Postgres native stats - ONLY called on-demand via /api/db-stats
// Uses the app's existing pool (passed via getStats), no new connections.
// =============================================================================

async function getPostgresNativeStats(pool) {
  if (!pool) return null;

  try {
    // Single query combining all stats to minimize round-trips
    const results = {};

    const [dbSize, tables, connections, ioStats] = await Promise.all([
      pool.query(`
        SELECT pg_database_size(current_database()) as db_bytes,
               pg_size_pretty(pg_database_size(current_database())) as db_size
      `),
      pool.query(`
        SELECT
          schemaname || '.' || relname as table_name,
          n_live_tup as row_count,
          pg_total_relation_size(relid) as total_bytes,
          pg_size_pretty(pg_total_relation_size(relid)) as total_size,
          pg_relation_size(relid) as data_bytes,
          pg_size_pretty(pg_relation_size(relid)) as data_size,
          pg_indexes_size(relid) as index_bytes,
          pg_size_pretty(pg_indexes_size(relid)) as index_size
        FROM pg_stat_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
      `),
      pool.query(`
        SELECT count(*) as total,
               count(*) FILTER (WHERE state = 'active') as active,
               count(*) FILTER (WHERE state = 'idle') as idle
        FROM pg_stat_activity
        WHERE datname = current_database()
      `),
      pool.query(`
        SELECT
          sum(heap_blks_read) as blocks_read,
          sum(heap_blks_hit) as blocks_hit,
          CASE WHEN sum(heap_blks_hit) + sum(heap_blks_read) > 0
            THEN round(100.0 * sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)), 2)
            ELSE 0
          END as cache_hit_ratio
        FROM pg_statio_user_tables
      `)
    ]);

    results.database_size = dbSize.rows[0];
    results.tables = tables.rows;
    results.connections = connections.rows[0];
    results.cache = ioStats.rows[0];

    return results;
  } catch (error) {
    return { error: error.message };
  }
}

// =============================================================================
// Stats output - pure in-memory aggregation, Postgres stats only if pool passed
// =============================================================================

async function getStats(pgPool) {
  const uptimeMs = Date.now() - startTime;
  const uptimeHours = uptimeMs / (1000 * 60 * 60);

  // Top endpoints by traffic
  const topEndpoints = [...endpointStats.entries()]
    .sort((a, b) => b[1].total_bytes - a[1].total_bytes)
    .slice(0, 20)
    .map(([endpoint, stats]) => ({
      endpoint,
      count: stats.count,
      total_bytes: stats.total_bytes,
      total_mb: Math.round(stats.total_bytes / (1024 * 1024) * 100) / 100,
      avg_duration_ms: Math.round(stats.total_duration_ms / stats.count),
      errors: stats.errors,
      error_rate: stats.count > 0 ? Math.round(stats.errors / stats.count * 100) : 0,
      last_called: stats.last_called
    }));

  // Top endpoints by call count
  const mostCalled = [...endpointStats.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([endpoint, stats]) => ({
      endpoint,
      count: stats.count,
      total_mb: Math.round(stats.total_bytes / (1024 * 1024) * 100) / 100
    }));

  // Per-IP breakdown (sorted by traffic)
  const topIPs = [...ipStats.entries()]
    .sort((a, b) => b[1].bytes - a[1].bytes)
    .slice(0, 20)
    .map(([ip, stats]) => ({
      ip,
      requests: stats.count,
      bytes: stats.bytes,
      mb: Math.round(stats.bytes / (1024 * 1024) * 100) / 100,
      first_seen: stats.first_seen,
      last_seen: stats.last_seen,
      user_agent: stats.user_agent,
      flagged: stats.flagged,
      top_endpoints: Object.entries(stats.endpoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([ep, count]) => ({ endpoint: ep, count }))
    }));

  // Flagged IPs (potential abuse)
  const flaggedIPs = [...ipStats.entries()]
    .filter(([, stats]) => stats.flagged)
    .map(([ip, stats]) => ({
      ip,
      requests: stats.count,
      mb: Math.round(stats.bytes / (1024 * 1024) * 100) / 100,
      user_agent: stats.user_agent,
      last_seen: stats.last_seen
    }));

  // Hourly time-series
  const timeSeries = hourlyBuckets.map(b => ({
    hour: b.hour,
    requests: b.requests,
    bytes: b.bytes,
    mb: Math.round(b.bytes / (1024 * 1024) * 100) / 100,
    unique_ips: b.unique_ips.size
  }));

  // Totals
  let totalRequests = 0;
  let totalBytes = 0;
  for (const [, stats] of endpointStats) {
    totalRequests += stats.count;
    totalBytes += stats.total_bytes;
  }

  return {
    overview: {
      uptime_hours: Math.round(uptimeHours * 100) / 100,
      total_requests: totalRequests,
      total_mb: Math.round(totalBytes / (1024 * 1024) * 100) / 100,
      requests_per_hour: uptimeHours > 0 ? Math.round(totalRequests / uptimeHours) : 0,
      mb_per_hour: uptimeHours > 0 ? Math.round((totalBytes / (1024 * 1024)) / uptimeHours * 100) / 100 : 0,
      unique_ips: ipStats.size,
      flagged_ips: flaggedIPs.length
    },
    top_endpoints_by_traffic: topEndpoints,
    most_called_endpoints: mostCalled,
    top_ips: topIPs,
    flagged_ips: flaggedIPs,
    hourly_trend: timeSeries,
    recent_requests: recentRequests.slice(-50).reverse(),
    postgres: pgPool ? await getPostgresNativeStats(pgPool) : null
  };
}

module.exports = {
  requestTracker,
  getStats
};
