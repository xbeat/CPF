/**
 * CPF Auth Module - Database Configuration
 * Connects to the same PostgreSQL database as the main dashboard
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'cpf_dashboard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Pool error handling
pool.on('error', (err) => {
    console.error('[AUTH DB] Unexpected error on idle client:', err);
});

pool.on('connect', () => {
    console.log('[AUTH DB] New client connected to database');
});

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function query(text, params = []) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
            console.log('[AUTH DB] Query executed:', { text: text.substring(0, 100), duration: `${duration}ms`, rows: result.rowCount });
        }
        return result;
    } catch (error) {
        console.error('[AUTH DB] Query error:', error.message);
        throw error;
    }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
async function getClient() {
    const client = await pool.connect();
    const originalQuery = client.query.bind(client);
    const originalRelease = client.release.bind(client);

    // Set a timeout of 5 seconds to release the client
    const timeout = setTimeout(() => {
        console.error('[AUTH DB] Client has been checked out for too long!');
    }, 5000);

    client.query = (...args) => originalQuery(...args);

    client.release = () => {
        clearTimeout(timeout);
        return originalRelease();
    };

    return client;
}

/**
 * Execute a transaction
 * @param {Function} callback - Async function receiving client
 * @returns {Promise<any>} Transaction result
 */
async function transaction(callback) {
    const client = await getClient();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Check database connection
 * @returns {Promise<boolean>}
 */
async function checkConnection() {
    try {
        const result = await query('SELECT NOW() as now');
        console.log('[AUTH DB] Connection verified at:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('[AUTH DB] Connection failed:', error.message);
        return false;
    }
}

/**
 * Initialize auth schema
 * @returns {Promise<void>}
 */
async function initializeSchema() {
    const schemaPath = path.join(__dirname, '../schemas/auth_schema.sql');

    if (!fs.existsSync(schemaPath)) {
        throw new Error('Auth schema file not found: ' + schemaPath);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons but be careful with functions
    const statements = [];
    let current = '';
    let inFunction = false;

    for (const line of schema.split('\n')) {
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith('--') || trimmed === '') {
            continue;
        }

        // Track function blocks
        if (trimmed.includes('$$')) {
            inFunction = !inFunction;
        }

        current += line + '\n';

        // Execute statement if we hit a semicolon outside of a function
        if (trimmed.endsWith(';') && !inFunction) {
            if (current.trim()) {
                statements.push(current.trim());
            }
            current = '';
        }
    }

    // Execute remaining
    if (current.trim()) {
        statements.push(current.trim());
    }

    console.log(`[AUTH DB] Executing ${statements.length} schema statements...`);

    for (let i = 0; i < statements.length; i++) {
        try {
            await query(statements[i]);
        } catch (error) {
            // Ignore "already exists" errors
            if (!error.message.includes('already exists') &&
                !error.message.includes('duplicate key')) {
                console.error(`[AUTH DB] Schema statement ${i + 1} failed:`, error.message);
                // Continue with other statements
            }
        }
    }

    console.log('[AUTH DB] Schema initialization complete');
}

/**
 * Close the pool
 * @returns {Promise<void>}
 */
async function close() {
    await pool.end();
    console.log('[AUTH DB] Connection pool closed');
}

module.exports = {
    pool,
    query,
    getClient,
    transaction,
    checkConnection,
    initializeSchema,
    close
};
