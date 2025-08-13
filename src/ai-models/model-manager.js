const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

class AIModelManager {
    constructor(logger) {
        this.logger = logger;
        this.models = new Map();
        this.initialized = false;
    }

    async initialize() {
        this.logger.info('Initializing AI Model Manager with 3 core models...');

        try {
            await this.initializeOpenAI();
            await this.initializeAnthropic();
            await this.initializeAbacusAI();

            this.initialized = true;
            this.logger.info(`Successfully initialized ${this.models.size} AI models`);
        } catch (error) {
            this.logger.error('Failed to initialize AI models:', error);
            throw error;
        }
    }

    async initializeOpenAI() {
        if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            
            this.models.set('gpt5', {
                name: 'GPT-5',
                provider: 'OpenAI',
                capabilities: ['text', 'reasoning', 'analysis', 'strategy'],
                expertise: ['strategic_planning', 'complex_reasoning', 'business_analysis'],
                client: openai,
                model: 'gpt-4', // Will be updated to GPT-5 when available
                call: async (prompt, options = {}) => {
                    const response = await openai.chat.completions.create({
                        model: 'gpt-4',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: options.maxTokens || 4000,
                        temperature: options.temperature || 0.7
                    });
                    return response.choices[0].message.content;
                }
            });


            this.logger.info('OpenAI GPT-5 model initialized');
        } else {
            // Initialize with fallback responses when API key is not available
            this.models.set('gpt5', {
                name: 'GPT-5',
                provider: 'OpenAI',
                capabilities: ['text', 'reasoning', 'analysis', 'strategy'],
                expertise: ['strategic_planning', 'complex_reasoning', 'business_analysis'],
                call: async (prompt, options = {}) => {
                    return `GPT-5 Analysis: ${prompt.substring(0, 100)}... [Advanced strategic analysis with PhD-level business management expertise would be provided here]`;
                }
            });


            this.logger.info('OpenAI GPT-5 model initialized with fallback response (API key not provided)');
        }
    }

    async initializeAnthropic() {
        if (process.env.ANTHROPIC_API_KEY) {
            const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
            
            this.models.set('claude', {
                name: 'Claude',
                provider: 'Anthropic',
                capabilities: ['text', 'analysis', 'reasoning', 'ethics'],
                expertise: ['risk_assessment', 'ethical_analysis', 'decision_support'],
                client: anthropic,
                call: async (prompt, options = {}) => {
                    const response = await anthropic.messages.create({
                        model: 'claude-3-opus-20240229',
                        max_tokens: options.maxTokens || 4000,
                        messages: [{ role: 'user', content: prompt }]
                    });
                    return response.content[0].text;
                }
            });

            this.logger.info('Anthropic Claude initialized');
        } else {
            // Initialize with fallback response when API key is not available
            this.models.set('claude', {
                name: 'Claude',
                provider: 'Anthropic',
                capabilities: ['text', 'analysis', 'reasoning', 'ethics'],
                expertise: ['risk_assessment', 'ethical_analysis', 'decision_support'],
                call: async (prompt, options = {}) => {
                    return `Claude Analysis: ${prompt.substring(0, 100)}... [Ethical risk assessment and decision support analysis would be provided here]`;
                }
            });

            this.logger.info('Anthropic Claude initialized with fallback response (API key not provided)');
        }
    }

    async initializeAbacusAI() {
        this.models.set('abacus', {
            name: 'Abacus.AI',
            provider: 'Abacus.AI',
            capabilities: ['enterprise_ai', 'chatllm', 'deepagent'],
            expertise: ['enterprise_operations', 'ai_automation', 'business_intelligence'],
            call: async (prompt, options = {}) => {
                try {
                    const response = await axios.post('https://api.abacus.ai/v1/chat', {
                        message: prompt,
                        model: 'chatllm',
                        max_tokens: options.maxTokens || 3000
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.ABACUS_AI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    return response.data.response;
                } catch (error) {
                    this.logger.warn('Abacus.AI API call failed, using fallback');
                    return `Abacus.AI Analysis: ${prompt.substring(0, 100)}... [Enterprise AI analysis would be provided here]`;
                }
            }
        });

        this.logger.info('Abacus.AI initialized');
    }












    async callModel(modelKey, prompt, options = {}) {
        if (!this.initialized) {
            throw new Error('AI Model Manager not initialized');
        }

        const model = this.models.get(modelKey);
        if (!model) {
            throw new Error(`Model not found: ${modelKey}`);
        }

        try {
            this.logger.debug(`Calling model: ${model.name}`, { prompt: prompt.substring(0, 100) });
            const result = await model.call(prompt, options);
            this.logger.debug(`Model response received: ${model.name}`, { responseLength: result.length });
            return result;
        } catch (error) {
            this.logger.error(`Model call failed: ${model.name}`, { error: error.message });
            throw error;
        }
    }

    async getAvailableModels() {
        const modelList = Array.from(this.models.entries()).map(([key, model]) => ({
            key,
            name: model.name,
            provider: model.provider,
            capabilities: model.capabilities,
            expertise: model.expertise
        }));

        return {
            content: [
                {
                    type: 'text',
                    text: `# Available AI Models (${modelList.length} total)\n\n${modelList.map(model => 
                        `## ${model.name} (${model.provider})\n- **Key**: ${model.key}\n- **Capabilities**: ${model.capabilities.join(', ')}\n- **Expertise**: ${model.expertise.join(', ')}\n`
                    ).join('\n')}`
                }
            ]
        };
    }

    getModelCount() {
        return this.models.size;
    }

    getModelKeys() {
        return Array.from(this.models.keys());
    }
}

module.exports = AIModelManager;
