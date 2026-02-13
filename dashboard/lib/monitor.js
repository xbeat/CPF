/**
 * CPF Request Monitor - Tracks WHO calls WHAT and HOW MUCH
 *
 * All data in-memory with hard caps on every structure.
 * Memory usage is bounded: ~2-3MB max regardless of uptime.
 * Postgres native stats queried ONLY on-demand via /api/db-stats.
 */

const config = require('../config');

// =============================================================================
// Configuration - all structures are bounded
// =============================================================================
const MAX_RECENT_REQUESTS = 200;       // Ring buffer: last N requests
const MAX_IPS = 500;                   // Max distinct IPs tracked
const MAX_ENDPOINTS = 200;             // Max distinct endpoints tracked
const MAX_ENDPOINTS_PER_IP = 20;       // Max endpoints tracked per IP
const HOURLY_BUCKETS = 72;             // 72 hours of hourly buckets
const SUSPICIOUS_RPM = 120;            // Requests/min threshold for flagging
const RATE_WINDOW_MAX_IPS = 1000;      // Max IPs in rate-limit window
const RATE_WINDOW_CLEANUP_MS = 5 * 60 * 1000; // Cleanup stale rate entries every 5 min

// =============================================================================
// In-memory stores (all bounded)
// =============================================================================
const startTime = Date.now();

const recentRequests = [];           // Capped at MAX_RECENT_REQUESTS
const ipStats = new Map();           // Capped at MAX_IPS
const endpointStats = new Map();     // Capped at MAX_ENDPOINTS
const hourlyBuckets = [];            // Capped at HOURLY_BUCKETS

// Rate tracking: { ip -> [timestamps] } - bounded, with periodic cleanup
const ipRateWindow = new Map();

// =============================================================================
// Periodic cleanup - evict stale rate-limit entries
// =============================================================================
setInterval(() => {
  const now = Date.now();
  const cutoff = now - 60000;
  for (const [ip, timestamps] of ipRateWindow) {
    // Remove timestamps older than 60s
    while (timestamps.length > 0 && timestamps[0] < cutoff) {
      timestamps.shift();
    }
    // If no recent activity, delete the entry entirely
    if (timestamps.length === 0) {
      ipRateWindow.delete(ip);
    }
  }
}, RATE_WINDOW_CLEANUP_MS);

// =============================================================================
// Middleware - pure in-memory, zero DB overhead
// =============================================================================

function requestTracker(req, res, next) {
  if (req.path.startsWith('/socket.io') ||
      req.path.match(/\.(js|css|png|jpg|ico|svg|woff|woff2|ttf|map)$/)) {
    return next();
  }

  const startMs = Date.now();
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';

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
// Recording - all paths bounded
// =============================================================================

function normalizePath(routePath, method) {
  let normalized = routePath || '/unknown';
  normalized = normalized.replace(/org-[a-z0-9-]+/g, ':orgId');
  normalized = normalized.replace(/\/\d+\.\d+/g, '/:indicatorId');
  return `${method} ${normalized}`;
}

function recordRequest(entry) {
  // 1. Ring buffer (capped at MAX_RECENT_REQUESTS)
  recentRequests.push(entry);
  if (recentRequests.length > MAX_RECENT_REQUESTS) {
    recentRequests.shift();
  }

  // 2. Per-IP stats (capped at MAX_IPS)
  let ip = ipStats.get(entry.ip);
  if (!ip) {
    if (ipStats.size >= MAX_IPS) {
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

  // Cap endpoints per IP
  ip.endpoints[entry.normalized] = (ip.endpoints[entry.normalized] || 0) + 1;
  const epKeys = Object.keys(ip.endpoints);
  if (epKeys.length > MAX_ENDPOINTS_PER_IP) {
    // Remove least-called endpoint
    let minKey = epKeys[0], minVal = ip.endpoints[epKeys[0]];
    for (let i = 1; i < epKeys.length; i++) {
      if (ip.endpoints[epKeys[i]] < minVal) {
        minKey = epKeys[i];
        minVal = ip.endpoints[epKeys[i]];
      }
    }
    delete ip.endpoints[minKey];
  }

  // 3. Per-endpoint stats (capped at MAX_ENDPOINTS)
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

  // 4. Hourly bucket (capped at HOURLY_BUCKETS, counter instead of Set)
  const hourKey = entry.timestamp.slice(0, 13);
  let bucket = hourlyBuckets.find(b => b.hour === hourKey);
  if (!bucket) {
    bucket = { hour: hourKey, requests: 0, bytes: 0, unique_ips: new Set() };
    hourlyBuckets.push(bucket);
    while (hourlyBuckets.length > HOURLY_BUCKETS) {
      hourlyBuckets.shift();
    }
  }
  bucket.requests++;
  bucket.bytes += entry.bytes;
  // Cap Set size - stop tracking individual IPs after 1000 per hour
  if (bucket.unique_ips.size < 1000) {
    bucket.unique_ips.add(entry.ip);
  }

  // 5. Rate tracking (capped at RATE_WINDOW_MAX_IPS)
  const now = Date.now();
  let timestamps = ipRateWindow.get(entry.ip);
  if (!timestamps) {
    // Evict oldest entries if at capacity
    if (ipRateWindow.size >= RATE_WINDOW_MAX_IPS) {
      const cutoff = now - 60000;
      for (const [rateIp, ts] of ipRateWindow) {
        if (ts.length === 0 || ts[ts.length - 1] < cutoff) {
          ipRateWindow.delete(rateIp);
        }
        if (ipRateWindow.size < RATE_WINDOW_MAX_IPS) break;
      }
    }
    timestamps = [];
    ipRateWindow.set(entry.ip, timestamps);
  }
  timestamps.push(now);
  const cutoff = now - 60000;
  while (timestamps.length > 0 && timestamps[0] < cutoff) {
    timestamps.shift();
  }
  if (timestamps.length > SUSPICIOUS_RPM) {
    ip.flagged = true;
  }
}

// =============================================================================
// Postgres native stats - ONLY on-demand via /api/db-stats
// =============================================================================

async function getPostgresNativeStats(pool) {
  if (!pool) return null;

  try {
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

    return {
      database_size: dbSize.rows[0],
      tables: tables.rows,
      connections: connections.rows[0],
      cache: ioStats.rows[0]
    };
  } catch (error) {
    return { error: error.message };
  }
}

// =============================================================================
// Stats output
// =============================================================================

async function getStats(pgPool) {
  const uptimeMs = Date.now() - startTime;
  const uptimeHours = uptimeMs / (1000 * 60 * 60);

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

  const mostCalled = [...endpointStats.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([endpoint, stats]) => ({
      endpoint,
      count: stats.count,
      total_mb: Math.round(stats.total_bytes / (1024 * 1024) * 100) / 100
    }));

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

  const flaggedIPs = [...ipStats.entries()]
    .filter(([, stats]) => stats.flagged)
    .map(([ip, stats]) => ({
      ip,
      requests: stats.count,
      mb: Math.round(stats.bytes / (1024 * 1024) * 100) / 100,
      user_agent: stats.user_agent,
      last_seen: stats.last_seen
    }));

  const timeSeries = hourlyBuckets.map(b => ({
    hour: b.hour,
    requests: b.requests,
    bytes: b.bytes,
    mb: Math.round(b.bytes / (1024 * 1024) * 100) / 100,
    unique_ips: b.unique_ips.size
  }));

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
