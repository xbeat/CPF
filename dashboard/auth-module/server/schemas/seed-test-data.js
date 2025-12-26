#!/usr/bin/env node
/**
 * CPF Auth Module - Seed Test Data
 *
 * Usage: npm run seed:test
 *
 * Creates test users with various roles and statuses for testing purposes.
 * WARNING: Only use in development/testing environments!
 */

const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('../config/database');
const { hashPassword } = require('../utils/crypto');

// Test users to create
const testUsers = [
    {
        email: 'super.admin@test.local',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        status: 'active',
        password: 'TestPassword123!'
    },
    {
        email: 'admin@test.local',
        firstName: 'Regular',
        lastName: 'Admin',
        role: 'admin',
        status: 'active',
        password: 'TestPassword123!'
    },
    {
        email: 'auditor1@test.local',
        firstName: 'John',
        lastName: 'Auditor',
        role: 'auditor',
        status: 'active',
        password: 'TestPassword123!'
    },
    {
        email: 'auditor2@test.local',
        firstName: 'Maria',
        lastName: 'Rossi',
        role: 'auditor',
        status: 'active',
        language: 'it-IT',
        password: 'TestPassword123!'
    },
    {
        email: 'viewer@test.local',
        firstName: 'View',
        lastName: 'Only',
        role: 'viewer',
        status: 'active',
        password: 'TestPassword123!'
    },
    {
        email: 'pending@test.local',
        firstName: 'Pending',
        lastName: 'Approval',
        role: 'auditor',
        status: 'pending_approval',
        password: 'TestPassword123!'
    },
    {
        email: 'locked@test.local',
        firstName: 'Locked',
        lastName: 'User',
        role: 'auditor',
        status: 'locked',
        password: 'TestPassword123!'
    },
    {
        email: 'suspended@test.local',
        firstName: 'Suspended',
        lastName: 'User',
        role: 'viewer',
        status: 'suspended',
        password: 'TestPassword123!'
    },
    {
        email: 'expired@test.local',
        firstName: 'Expired',
        lastName: 'Account',
        role: 'auditor',
        status: 'expired',
        password: 'TestPassword123!',
        expiresAt: new Date(Date.now() - 86400000) // Yesterday
    },
    {
        email: 'expiring.soon@test.local',
        firstName: 'Expiring',
        lastName: 'Soon',
        role: 'auditor',
        status: 'active',
        password: 'TestPassword123!',
        expiresAt: new Date(Date.now() + 5 * 86400000) // 5 days from now
    }
];

async function seedTestData() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║         CPF Auth Module - Seed Test Data                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    // Check if we're in development
    if (process.env.NODE_ENV === 'production') {
        console.error('ERROR: Cannot seed test data in production environment!');
        process.exit(1);
    }

    try {
        // Check connection
        console.log('Checking database connection...');
        const connected = await db.checkConnection();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }
        console.log('Database connected\n');

        console.log('Creating test users...\n');

        let created = 0;
        let skipped = 0;

        for (const user of testUsers) {
            try {
                // Check if user already exists
                const existing = await db.query(
                    'SELECT id FROM auth_users WHERE email_normalized = $1',
                    [user.email.toLowerCase()]
                );

                if (existing.rows.length > 0) {
                    console.log(`  [SKIP] ${user.email} - already exists`);
                    skipped++;
                    continue;
                }

                // Hash password
                const passwordHash = await hashPassword(user.password);

                // Calculate expires_at
                const expiresAt = user.expiresAt || new Date(Date.now() + 365 * 86400000);

                // Insert user
                await db.query(`
                    INSERT INTO auth_users (
                        email, email_normalized, password_hash, first_name, last_name,
                        role, status, is_email_verified, email_verified_at,
                        must_change_password, expires_at, language
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), false, $8, $9)
                `, [
                    user.email,
                    user.email.toLowerCase(),
                    passwordHash,
                    user.firstName,
                    user.lastName,
                    user.role,
                    user.status,
                    expiresAt,
                    user.language || 'en-US'
                ]);

                // If user is locked, set locked_until
                if (user.status === 'locked') {
                    await db.query(`
                        UPDATE auth_users
                        SET locked_until = NOW() + INTERVAL '30 minutes',
                            failed_login_attempts = 5
                        WHERE email_normalized = $1
                    `, [user.email.toLowerCase()]);
                }

                console.log(`  [OK] ${user.email} (${user.role}, ${user.status})`);
                created++;

            } catch (error) {
                console.error(`  [ERROR] ${user.email}: ${error.message}`);
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log(`Created: ${created} users`);
        console.log(`Skipped: ${skipped} users (already exist)`);
        console.log('═══════════════════════════════════════════════════════════════');

        console.log('\nTest Credentials:');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('Email                        | Role         | Status');
        console.log('─────────────────────────────────────────────────────────────────');
        for (const user of testUsers) {
            console.log(`${user.email.padEnd(28)} | ${user.role.padEnd(12)} | ${user.status}`);
        }
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('\nAll test users use password: TestPassword123!');
        console.log('');

    } catch (error) {
        console.error('\nError:', error.message);
        process.exit(1);
    } finally {
        await db.close();
    }
}

// Run
seedTestData();
