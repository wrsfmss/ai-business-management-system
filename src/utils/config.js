require('dotenv').config();

class Config {
    constructor() {
        this.validateEnvironment();
    }

    validateEnvironment() {
        const requiredVars = [
            'MCP_SERVER_PORT',
            'USER_NAME',
            'ORGANIZATION',
            'EXPERTISE_LEVEL',
            'TARGET_IQ'
        ];

        const missing = requiredVars.filter(varName => !process.env[varName]);
        
        if (missing.length > 0) {
            console.warn(`Missing environment variables: ${missing.join(', ')}`);
            console.warn('Some features may not work correctly. Please check your .env file.');
        }
    }

    get server() {
        return {
            port: parseInt(process.env.MCP_SERVER_PORT) || 3000,
            host: process.env.MCP_SERVER_HOST || 'localhost',
            logLevel: process.env.LOG_LEVEL || 'info'
        };
    }

    get business() {
        return {
            userName: process.env.USER_NAME || 'William Smiley',
            organization: process.env.ORGANIZATION || 'Business Executive Directors Board',
            expertiseLevel: process.env.EXPERTISE_LEVEL || 'PhD_Business_Management',
            targetIQ: parseInt(process.env.TARGET_IQ) || 300
        };
    }

    get aiModels() {
        return {
            openai: {
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-4',
                maxTokens: 4000,
                temperature: 0.7
            },
            anthropic: {
                apiKey: process.env.ANTHROPIC_API_KEY,
                model: 'claude-3-opus-20240229',
                maxTokens: 4000,
                temperature: 0.7
            },
            abacus: {
                apiKey: process.env.ABACUS_AI_API_KEY,
                endpoint: 'https://api.abacus.ai/v1/chat',
                model: 'chatllm'
            },
            genspark: {
                apiKey: process.env.GENSPARK_API_KEY,
                endpoint: 'https://api.genspark.ai/v1/generate'
            },
            manus: {
                apiKey: process.env.MANUS_API_KEY,
                endpoint: 'https://api.manus.ai/v1/analyze'
            },
            google: {
                apiKey: process.env.GOOGLE_API_KEY,
                endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
            },
            cohere: {
                apiKey: process.env.COHERE_API_KEY,
                model: 'command'
            },
            huggingface: {
                apiKey: process.env.HUGGINGFACE_API_KEY,
                endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large'
            },
            replicate: {
                apiToken: process.env.REPLICATE_API_TOKEN,
                endpoint: 'https://api.replicate.com/v1/predictions'
            },
            together: {
                apiKey: process.env.TOGETHER_API_KEY,
                endpoint: 'https://api.together.xyz/inference',
                model: 'togethercomputer/llama-2-70b-chat'
            },
            perplexity: {
                apiKey: process.env.PERPLEXITY_API_KEY,
                endpoint: 'https://api.perplexity.ai/chat/completions',
                model: 'pplx-70b-online'
            },
            mistral: {
                apiKey: process.env.MISTRAL_API_KEY,
                endpoint: 'https://api.mistral.ai/v1/chat/completions',
                model: 'mistral-large-latest'
            }
        };
    }

    get virtualization() {
        return {
            proxmox: {
                host: process.env.PROXMOX_HOST || 'localhost',
                user: process.env.PROXMOX_USER || 'root',
                password: process.env.PROXMOX_PASSWORD || '',
                port: parseInt(process.env.PROXMOX_PORT) || 8006
            },
            vm: {
                storage: process.env.VM_STORAGE || 'local-lvm',
                network: process.env.VM_NETWORK || 'vmbr0'
            }
        };
    }

    get security() {
        return {
            jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
            encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'
        };
    }

    get performance() {
        return {
            maxConcurrentAICalls: 20,
            requestTimeout: 30000,
            cacheTimeout: 3600000,
            maxRequestQueue: 1000
        };
    }

    hasApiKey(service) {
        const keys = this.aiModels[service];
        return keys && (keys.apiKey || keys.apiToken);
    }

    getAvailableServices() {
        const services = Object.keys(this.aiModels);
        return services.filter(service => this.hasApiKey(service));
    }

    isProxmoxConfigured() {
        const proxmox = this.virtualization.proxmox;
        return proxmox.host !== 'localhost' && proxmox.password !== '';
    }
}

module.exports = new Config();
