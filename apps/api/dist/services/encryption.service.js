"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptionService = exports.EncryptionService = void 0;
exports.generateEncryptionKey = generateEncryptionKey;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Encryption Service for securing sensitive data like access tokens
 * Uses AES-256-GCM encryption
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
class EncryptionService {
    constructor() {
        // Get encryption key from environment variable
        const key = process.env.ENCRYPTION_KEY;
        const salt = process.env.ENCRYPTION_SALT || 'creatoriq-platform-salt-v1';
        if (!key) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('ENCRYPTION_KEY environment variable is required in production');
            }
            // Development only: generate a random key per session (tokens won't persist across restarts)
            console.warn('⚠️ ENCRYPTION_KEY not set. Using random key (dev only, tokens will not persist)');
            this.encryptionKey = crypto_1.default.randomBytes(KEY_LENGTH);
        }
        else {
            // Derive key from environment variable with proper salt
            this.encryptionKey = crypto_1.default.scryptSync(key, salt, KEY_LENGTH);
        }
    }
    /**
     * Encrypt sensitive data (like access tokens)
     */
    encrypt(plaintext) {
        try {
            // Generate random IV (Initialization Vector)
            const iv = crypto_1.default.randomBytes(IV_LENGTH);
            // Create cipher
            const cipher = crypto_1.default.createCipheriv(ALGORITHM, this.encryptionKey, iv);
            // Encrypt the plaintext
            let encrypted = cipher.update(plaintext, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            // Get authentication tag
            const tag = cipher.getAuthTag();
            // Combine iv + tag + encrypted data
            // Format: iv(16 bytes) + tag(16 bytes) + encrypted data
            const result = Buffer.concat([iv, tag, Buffer.from(encrypted, 'hex')]);
            // Return as base64 string
            return result.toString('base64');
        }
        catch (error) {
            console.error('Encryption error:', error.message);
            throw new Error('Failed to encrypt data');
        }
    }
    /**
     * Decrypt encrypted data
     */
    decrypt(encryptedData) {
        try {
            // Convert from base64
            const buffer = Buffer.from(encryptedData, 'base64');
            // Extract iv, tag, and encrypted data
            const iv = buffer.subarray(0, IV_LENGTH);
            const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
            const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);
            // Create decipher
            const decipher = crypto_1.default.createDecipheriv(ALGORITHM, this.encryptionKey, iv);
            decipher.setAuthTag(tag);
            // Decrypt
            let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (error) {
            console.error('Decryption error:', error.message);
            throw new Error('Failed to decrypt data');
        }
    }
    /**
     * Safe decrypt with fallback for non-encrypted tokens
     * Returns the original string if decryption fails (backward compatibility)
     */
    safeDecrypt(data) {
        try {
            // Try to decrypt
            return this.decrypt(data);
        }
        catch (error) {
            // If decryption fails, assume it's already plaintext (legacy token)
            console.warn('⚠️ Token decryption failed, using as plaintext (legacy token)');
            return data;
        }
    }
    /**
     * Check if data is encrypted (basic heuristic)
     */
    isEncrypted(data) {
        try {
            // Encrypted data should be valid base64 and have minimum length
            const buffer = Buffer.from(data, 'base64');
            return buffer.length >= (IV_LENGTH + TAG_LENGTH + 16);
        }
        catch {
            return false;
        }
    }
    /**
     * Hash sensitive data (one-way, for verification only)
     */
    hash(data) {
        return crypto_1.default
            .createHash('sha256')
            .update(data)
            .digest('hex');
    }
    /**
     * Generate a secure random encryption key
     * Use this to generate ENCRYPTION_KEY for .env
     */
    static generateKey() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
}
exports.EncryptionService = EncryptionService;
// Singleton instance
exports.encryptionService = new EncryptionService();
// Helper function to generate encryption key for .env
function generateEncryptionKey() {
    return EncryptionService.generateKey();
}
