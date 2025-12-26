/**
 * CPF Auth Module - Cryptographic Utilities
 * Secure password hashing with Argon2id and token generation
 */

const argon2 = require('argon2');
const crypto = require('crypto');
const security = require('../config/security');

// =============================================================================
// Password Hashing (Argon2id)
// =============================================================================

/**
 * Hash a password using Argon2id
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: security.argon2.memoryCost,
            timeCost: security.argon2.timeCost,
            parallelism: security.argon2.parallelism,
            hashLength: security.argon2.hashLength
        });
        return hash;
    } catch (error) {
        console.error('[CRYPTO] Error hashing password:', error.message);
        throw new Error('Failed to hash password');
    }
}

/**
 * Verify a password against a hash
 * @param {string} hash - Stored hash
 * @param {string} password - Plain text password to verify
 * @returns {Promise<boolean>} Whether password matches
 */
async function verifyPassword(hash, password) {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        console.error('[CRYPTO] Error verifying password:', error.message);
        return false;
    }
}

/**
 * Check if a hash needs to be updated (parameters changed)
 * @param {string} hash - Existing hash
 * @returns {Promise<boolean>} Whether rehashing is needed
 */
async function needsRehash(hash) {
    try {
        return argon2.needsRehash(hash, {
            type: argon2.argon2id,
            memoryCost: security.argon2.memoryCost,
            timeCost: security.argon2.timeCost,
            parallelism: security.argon2.parallelism
        });
    } catch (error) {
        return false;
    }
}

// =============================================================================
// Token Generation
// =============================================================================

/**
 * Generate a cryptographically secure random token
 * @param {number} length - Length in bytes (default 32)
 * @returns {string} Hex-encoded token
 */
function generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a URL-safe token
 * @param {number} length - Length in bytes (default 32)
 * @returns {string} Base64 URL-safe token
 */
function generateUrlSafeToken(length = 32) {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate a UUID v4
 * @returns {string} UUID
 */
function generateUUID() {
    return crypto.randomUUID();
}

/**
 * Hash a token for storage (one-way)
 * @param {string} token - Token to hash
 * @returns {string} SHA-256 hash
 */
function hashToken(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}

/**
 * Compare a token with its stored hash
 * @param {string} token - Plain token
 * @param {string} storedHash - Stored hash
 * @returns {boolean} Whether they match
 */
function compareTokenHash(token, storedHash) {
    const tokenHash = hashToken(token);
    // Use timing-safe comparison to prevent timing attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(tokenHash, 'hex'),
            Buffer.from(storedHash, 'hex')
        );
    } catch (error) {
        return false;
    }
}

// =============================================================================
// Encryption/Decryption (for sensitive data at rest)
// =============================================================================

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Derive an encryption key from a password
 * @param {string} password - Password
 * @param {Buffer} salt - Salt
 * @returns {Promise<Buffer>} Derived key
 */
async function deriveKey(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, key) => {
            if (err) reject(err);
            else resolve(key);
        });
    });
}

/**
 * Encrypt sensitive data
 * @param {string} data - Data to encrypt
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<string>} Encrypted data (base64)
 */
async function encrypt(data, encryptionKey) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = await deriveKey(encryptionKey, salt);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
    });

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Combine: salt + iv + authTag + encrypted
    const combined = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(encrypted, 'hex')
    ]);

    return combined.toString('base64');
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data (base64)
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<string>} Decrypted data
 */
async function decrypt(encryptedData, encryptionKey) {
    const combined = Buffer.from(encryptedData, 'base64');

    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

    const key = await deriveKey(encryptionKey, salt);

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// =============================================================================
// Secure Random Generation
// =============================================================================

/**
 * Generate a secure 6-digit OTP code
 * @returns {string} 6-digit code
 */
function generateOTP() {
    const buffer = crypto.randomBytes(4);
    const num = buffer.readUInt32BE(0) % 1000000;
    return num.toString().padStart(6, '0');
}

/**
 * Generate a random password that meets policy
 * @param {number} length - Password length (min 12)
 * @returns {string} Random password
 */
function generateRandomPassword(length = 16) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = lowercase + uppercase + numbers + special;

    // Ensure at least one of each required type
    let password = '';
    password += lowercase[crypto.randomInt(lowercase.length)];
    password += uppercase[crypto.randomInt(uppercase.length)];
    password += numbers[crypto.randomInt(numbers.length)];
    password += special[crypto.randomInt(special.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += all[crypto.randomInt(all.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    // Password hashing
    hashPassword,
    verifyPassword,
    needsRehash,

    // Token generation
    generateToken,
    generateUrlSafeToken,
    generateUUID,
    hashToken,
    compareTokenHash,

    // Encryption
    encrypt,
    decrypt,

    // Random generation
    generateOTP,
    generateRandomPassword
};
