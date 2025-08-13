const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('./config');

class Security {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32;
        this.ivLength = 16;
        this.tagLength = 16;
    }

    encrypt(text, key = config.security.encryptionKey) {
        try {
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipher(this.algorithm, key);
            cipher.setAAD(Buffer.from('ai-business-management-system'));
            
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const tag = cipher.getAuthTag();
            
            return {
                encrypted: encrypted,
                iv: iv.toString('hex'),
                tag: tag.toString('hex')
            };
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    decrypt(encryptedData, key = config.security.encryptionKey) {
        try {
            const decipher = crypto.createDecipher(this.algorithm, key);
            decipher.setAAD(Buffer.from('ai-business-management-system'));
            decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
            
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    generateToken(payload, expiresIn = '24h') {
        try {
            return jwt.sign(payload, config.security.jwtSecret, { expiresIn });
        } catch (error) {
            throw new Error(`Token generation failed: ${error.message}`);
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.security.jwtSecret);
        } catch (error) {
            throw new Error(`Token verification failed: ${error.message}`);
        }
    }

    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return { salt, hash };
    }

    verifyPassword(password, salt, hash) {
        const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hash === verifyHash;
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        return input
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
    }

    validateApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            return false;
        }
        
        return apiKey.length >= 20 && /^[a-zA-Z0-9\-_]+$/.test(apiKey);
    }

    maskApiKey(apiKey) {
        if (!apiKey || apiKey.length < 8) {
            return '***';
        }
        
        const start = apiKey.substring(0, 4);
        const end = apiKey.substring(apiKey.length - 4);
        const middle = '*'.repeat(apiKey.length - 8);
        
        return `${start}${middle}${end}`;
    }

    generateSecureId() {
        return crypto.randomBytes(16).toString('hex');
    }

    createHmac(data, secret = config.security.encryptionKey) {
        return crypto.createHmac('sha256', secret).update(data).digest('hex');
    }

    verifyHmac(data, signature, secret = config.security.encryptionKey) {
        const expectedSignature = this.createHmac(data, secret);
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    }

    rateLimitCheck(identifier, maxRequests = 100, windowMs = 60000) {
        if (!this.rateLimitStore) {
            this.rateLimitStore = new Map();
        }
        
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!this.rateLimitStore.has(identifier)) {
            this.rateLimitStore.set(identifier, []);
        }
        
        const requests = this.rateLimitStore.get(identifier);
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (validRequests.length >= maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: windowStart + windowMs
            };
        }
        
        validRequests.push(now);
        this.rateLimitStore.set(identifier, validRequests);
        
        return {
            allowed: true,
            remaining: maxRequests - validRequests.length,
            resetTime: windowStart + windowMs
        };
    }

    auditLog(action, user, details = {}) {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            action: action,
            user: user,
            details: details,
            ip: details.ip || 'unknown',
            userAgent: details.userAgent || 'unknown',
            sessionId: details.sessionId || 'unknown'
        };
        
        console.log('AUDIT:', JSON.stringify(auditEntry));
        
        return auditEntry;
    }
}

module.exports = new Security();
