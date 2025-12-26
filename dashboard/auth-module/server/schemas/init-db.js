#!/usr/bin/env node
/**
 * CPF Auth Module - Database Initialization Script
 *
 * Usage: npm run db:init
 *
 * This script:
 * 1. Creates the auth schema tables
 * 2. Creates the initial super admin user
 * 3. Initializes default settings
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('../config/database');
const { hashPassword } = require('../utils/crypto');

async function initializeDatabase() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║        CPF Auth Module - Database Initialization          ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    try {
        // Step 1: Check connection
        console.log('[1/4] Checking database connection...');
        const connected = await db.checkConnection();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }
        console.log('      ✓ Database connected');

        // Step 2: Read and execute schema
        console.log('[2/4] Creating schema...');
        const schemaPath = path.join(__dirname, 'auth_schema.sql');

        if (!fs.existsSync(schemaPath)) {
            throw new Error('Schema file not found: ' + schemaPath);
        }

        await db.initializeSchema();
        console.log('      ✓ Schema created');

        // Step 3: Create initial super admin
        console.log('[3/4] Creating initial super admin...');

        const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@cpf-dashboard.local';
        const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminPassword123!';
        const adminFirstName = process.env.INITIAL_ADMIN_FIRST_NAME || 'Super';
        const adminLastName = process.env.INITIAL_ADMIN_LAST_NAME || 'Admin';

        // Check if admin already exists
        const existingAdmin = await db.query(
            'SELECT id FROM auth_users WHERE email_normalized = $1',
            [adminEmail.toLowerCase()]
        );

        if (existingAdmin.rows.length > 0) {
            console.log(`      ⓘ Super admin already exists: ${adminEmail}`);
        } else {
            const passwordHash = await hashPassword(adminPassword);

            await db.query(`
                INSERT INTO auth_users (
                    email, password_hash, first_name, last_name,
                    role, status, is_email_verified, email_verified_at
                ) VALUES ($1, $2, $3, $4, 'super_admin', 'active', true, NOW())
            `, [adminEmail, passwordHash, adminFirstName, adminLastName]);

            console.log(`      ✓ Super admin created: ${adminEmail}`);
            console.log('');
            console.log('      ┌────────────────────────────────────────────────┐');
            console.log('      │  IMPORTANT: Save these credentials securely!  │');
            console.log('      ├────────────────────────────────────────────────┤');
            console.log(`      │  Email:    ${adminEmail.padEnd(32)}│`);
            console.log(`      │  Password: ${adminPassword.padEnd(32)}│`);
            console.log('      └────────────────────────────────────────────────┘');
            console.log('');
            console.log('      ⚠️  Change this password immediately after first login!');
        }

        // Step 4: Initialize settings
        console.log('[4/4] Initializing settings...');

        const settingsExist = await db.query('SELECT id FROM auth_settings WHERE id = 1');

        if (settingsExist.rows.length === 0) {
            await db.query(`
                INSERT INTO auth_settings (
                    id,
                    registration_requires_approval,
                    registration_requires_email_verification,
                    account_expiry_days,
                    lockout_threshold,
                    lockout_duration_minutes,
                    max_sessions_per_user
                ) VALUES (1, $1, $2, $3, $4, $5, $6)
            `, [
                process.env.REGISTRATION_REQUIRES_APPROVAL === 'true',
                process.env.REGISTRATION_REQUIRES_EMAIL_VERIFICATION !== 'false',
                parseInt(process.env.ACCOUNT_EXPIRY_DEFAULT_DAYS) || 365,
                parseInt(process.env.LOCKOUT_THRESHOLD) || 5,
                parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 30,
                parseInt(process.env.MAX_SESSIONS_PER_USER) || 5
            ]);
            console.log('      ✓ Settings initialized');
        } else {
            console.log('      ⓘ Settings already exist');
        }

        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║              Initialization Complete! ✓                   ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('Next steps:');
        console.log('  1. Update .env with your production values');
        console.log('  2. Start the server: npm start');
        console.log('  3. Open http://localhost:3001/login');
        console.log('  4. Log in and change the admin password');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('╔═══════════════════════════════════════════════════════════╗');
        console.error('║              Initialization Failed! ✗                     ║');
        console.error('╚═══════════════════════════════════════════════════════════╝');
        console.error('');
        console.error('Error:', error.message);
        console.error('');
        console.error('Troubleshooting:');
        console.error('  1. Make sure PostgreSQL is running');
        console.error('  2. Check database credentials in .env');
        console.error('  3. Ensure the database exists');
        console.error('  4. Check that the organizations table exists (from main dashboard)');
        console.error('');
        process.exit(1);
    } finally {
        await db.close();
    }
}

// Run initialization
initializeDatabase();
