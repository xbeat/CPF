#!/usr/bin/env node
/**
 * CPF Auth Module - Seed Admin User
 *
 * Usage: npm run seed:admin
 *
 * Creates or resets the super admin user.
 * Useful for password recovery or initial setup.
 */

const path = require('path');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('../config/database');
const { hashPassword, generateRandomPassword } = require('../utils/crypto');
const security = require('../config/security');

async function seedAdmin() {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║        CPF Auth Module - Super Admin Setup                ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => new Promise((resolve) => {
        rl.question(prompt, resolve);
    });

    try {
        // Check connection
        console.log('Checking database connection...');
        const connected = await db.checkConnection();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }
        console.log('✓ Database connected\n');

        // Get admin details
        const defaultEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@cpf-dashboard.local';

        console.log('Enter super admin details (press Enter for defaults):\n');

        const email = (await question(`Email [${defaultEmail}]: `)).trim() || defaultEmail;
        const firstName = (await question('First name [Super]: ')).trim() || 'Super';
        const lastName = (await question('Last name [Admin]: ')).trim() || 'Admin';

        // Password handling
        console.log('\nPassword options:');
        console.log('  1. Generate a secure random password (recommended)');
        console.log('  2. Enter a custom password\n');

        const passwordChoice = (await question('Choose [1]: ')).trim() || '1';

        let password;
        if (passwordChoice === '2') {
            password = await question('Enter password (min 12 chars): ');

            // Validate password
            const validation = security.passwordPolicy.validate(password);
            if (!validation.valid) {
                console.log('\n⚠️  Password does not meet requirements:');
                validation.errors.forEach(err => console.log(`   - ${err.en}`));
                rl.close();
                await db.close();
                process.exit(1);
            }
        } else {
            password = generateRandomPassword(20);
        }

        // Check if user exists
        const existing = await db.query(
            'SELECT id FROM auth_users WHERE email_normalized = $1',
            [email.toLowerCase()]
        );

        const passwordHash = await hashPassword(password);

        if (existing.rows.length > 0) {
            // Update existing user
            console.log(`\n⚠️  User ${email} already exists.`);
            const confirm = await question('Reset password and set as super_admin? [y/N]: ');

            if (confirm.toLowerCase() !== 'y') {
                console.log('Cancelled.');
                rl.close();
                await db.close();
                return;
            }

            await db.query(`
                UPDATE auth_users
                SET password_hash = $1,
                    first_name = $2,
                    last_name = $3,
                    role = 'super_admin',
                    status = 'active',
                    is_email_verified = true,
                    email_verified_at = NOW(),
                    failed_login_attempts = 0,
                    locked_until = NULL,
                    must_change_password = true,
                    updated_at = NOW()
                WHERE email_normalized = $4
            `, [passwordHash, firstName, lastName, email.toLowerCase()]);

            console.log('\n✓ User updated to super_admin with new password');
        } else {
            // Create new user
            await db.query(`
                INSERT INTO auth_users (
                    email, password_hash, first_name, last_name,
                    role, status, is_email_verified, email_verified_at,
                    must_change_password, expires_at
                ) VALUES ($1, $2, $3, $4, 'super_admin', 'active', true, NOW(), true, NOW() + INTERVAL '365 days')
            `, [email, passwordHash, firstName, lastName]);

            console.log('\n✓ Super admin created');
        }

        console.log('');
        console.log('╔════════════════════════════════════════════════════════════════════╗');
        console.log('║                    CREDENTIALS - SAVE THESE!                       ║');
        console.log('╠════════════════════════════════════════════════════════════════════╣');
        console.log(`║  Email:    ${email.padEnd(54)}║`);
        console.log(`║  Password: ${password.padEnd(54)}║`);
        console.log('╚════════════════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('⚠️  You will be required to change this password on first login.');
        console.log('');

    } catch (error) {
        console.error('\n✗ Error:', error.message);
        process.exit(1);
    } finally {
        rl.close();
        await db.close();
    }
}

// Run
seedAdmin();
