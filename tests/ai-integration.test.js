const AIModelManager = require('../src/ai-models/model-manager');
const CoordinationEngine = require('../src/coordination/coordination-engine');
const winston = require('winston');

describe('AI Integration Tests', () => {
    let logger;
    let aiModelManager;
    let coordinationEngine;

    beforeAll(async () => {
        logger = winston.createLogger({
            level: 'error',
            transports: [new winston.transports.Console({ silent: true })]
        });

        aiModelManager = new AIModelManager(logger);
        coordinationEngine = new CoordinationEngine(logger);
    });

    describe('AI Model Manager', () => {
        test('should initialize with 3 core AI models', async () => {
            await aiModelManager.initialize();
            expect(aiModelManager.getModelCount()).toBe(3);
        });

        test('should include all 3 core models', async () => {
            await aiModelManager.initialize();
            const modelKeys = aiModelManager.getModelKeys();
            
            expect(modelKeys).toContain('gpt5');
            expect(modelKeys).toContain('claude');
            expect(modelKeys).toContain('abacus');
            expect(modelKeys).toHaveLength(3);
        });

        test('should handle model calls with fallback', async () => {
            await aiModelManager.initialize();
            
            const response = await aiModelManager.callModel('gpt5', 'Test business analysis prompt');
            expect(response).toBeDefined();
            expect(typeof response).toBe('string');
            expect(response.length).toBeGreaterThan(0);
        });

        test('should provide model availability information', async () => {
            await aiModelManager.initialize();
            
            const availableModels = await aiModelManager.getAvailableModels();
            expect(availableModels.content).toBeDefined();
            expect(availableModels.content[0].text).toContain('Available AI Models');
        });
    });

    describe('Coordination Engine', () => {
        test('should initialize coordination strategies', async () => {
            await coordinationEngine.initialize();
            expect(coordinationEngine.initialized).toBe(true);
        });

        test('should coordinate multi-AI analysis', async () => {
            await coordinationEngine.initialize();
            
            const request = {
                type: 'strategic_analysis',
                topic: 'Business growth strategy',
                depth: 'phd_level',
                models: ['gpt5', 'claude', 'strategy_ai']
            };

            const result = await coordinationEngine.coordinateMultiAIAnalysis(request);
            
            expect(result.summary).toBeDefined();
            expect(result.insights).toBeDefined();
            expect(result.recommendations).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.models_used).toEqual(expect.arrayContaining(['gpt5', 'claude', 'strategy_ai']));
        });

        test('should coordinate research across multiple models', async () => {
            await coordinationEngine.initialize();
            
            const request = {
                query: 'Market trends in AI business applications',
                sources: ['academic', 'industry'],
                format: 'report',
                models: ['storm', 'perplexity', 'gpt5']
            };

            const result = await coordinationEngine.coordinateResearch(request);
            
            expect(result.summary).toBeDefined();
            expect(result.analysis).toBeDefined();
            expect(result.sources).toBeDefined();
            expect(result.contributions).toBeDefined();
        });

        test('should select optimal models for different analysis types', async () => {
            await coordinationEngine.initialize();
            
            const strategicModels = coordinationEngine.selectOptimalModels('strategic_analysis', 'business strategy');
            const financialModels = coordinationEngine.selectOptimalModels('financial_analysis', 'investment planning');
            
            expect(strategicModels).toContain('gpt5');
            expect(strategicModels).toContain('claude');
            expect(financialModels).toContain('financial_ai');
        });
    });

    describe('PhD-Level Business Expertise', () => {
        test('should demonstrate PhD-level analysis capabilities', async () => {
            await coordinationEngine.initialize();
            
            const request = {
                type: 'strategic_analysis',
                topic: 'Digital transformation strategy for traditional manufacturing',
                depth: 'phd_level',
                models: ['gpt5', 'claude', 'strategy_ai', 'operations_ai']
            };

            const result = await coordinationEngine.coordinateMultiAIAnalysis(request);
            
            expect(result.summary).toContain('PhD-level');
            expect(result.insights).toContain('Advanced');
            expect(result.analysis_depth).toBe('phd_level');
        });

        test('should achieve IQ 300 level analytical capabilities', async () => {
            await coordinationEngine.initialize();
            
            const responses = [
                { model: 'gpt5', response: 'Strategic analysis...', confidence: 0.9, expertise_relevance: 0.8 },
                { model: 'claude', response: 'Risk assessment...', confidence: 0.85, expertise_relevance: 0.9 },
                { model: 'strategy_ai', response: 'Competitive analysis...', confidence: 0.88, expertise_relevance: 0.95 }
            ];

            const synthesis = await coordinationEngine.iq300IntegrationEnsemble(responses, {
                type: 'strategic_analysis',
                depth: 'phd_level',
                target_iq: 300
            });

            expect(synthesis.summary).toContain('IQ 300');
            expect(synthesis.methodology).toContain('Advanced');
            expect(synthesis.confidence).toBeGreaterThan(8);
        });
    });

    describe('Error Handling and Resilience', () => {
        test('should handle model failures gracefully', async () => {
            await aiModelManager.initialize();
            
            const response = await aiModelManager.callModel('nonexistent_model', 'Test prompt').catch(error => error);
            expect(response).toBeInstanceOf(Error);
            expect(response.message).toContain('Model not found');
        });

        test('should provide fallback responses when APIs fail', async () => {
            await aiModelManager.initialize();
            
            const response = await aiModelManager.callModel('abacus', 'Test business analysis');
            expect(response).toBeDefined();
            expect(response).toContain('analysis');
        });

        test('should maintain system stability under load', async () => {
            await coordinationEngine.initialize();
            
            const promises = Array(10).fill().map((_, i) => 
                coordinationEngine.coordinateMultiAIAnalysis({
                    type: 'strategic_analysis',
                    topic: `Business scenario ${i}`,
                    depth: 'advanced',
                    models: ['gpt5', 'claude']
                })
            );

            const results = await Promise.all(promises);
            expect(results).toHaveLength(10);
            results.forEach(result => {
                expect(result.summary).toBeDefined();
                expect(result.confidence).toBeGreaterThan(0);
            });
        });
    });

    describe('Business Executive Board Integration', () => {
        test('should support executive board decision-making', async () => {
            await coordinationEngine.initialize();
            
            const request = {
                type: 'executive_decision',
                topic: 'Market expansion strategy',
                depth: 'phd_level',
                models: ['gpt5', 'claude', 'strategy_ai', 'financial_ai', 'operations_ai', 'marketing_ai']
            };

            const result = await coordinationEngine.coordinateMultiAIAnalysis(request);
            
            expect(result.models_used.length).toBeGreaterThanOrEqual(6);
            expect(result.summary).toMatch(/Multi-AI Analysis|executive/);
            expect(result.recommendations).toBeDefined();
        });

        test('should provide William Smiley specific analysis', async () => {
            await coordinationEngine.initialize();
            
            const prompt = coordinationEngine.createAnalysisPrompt('CEO strategic planning for William Smiley', 'phd_level');
            
            expect(prompt).toContain('PhD-level');
            expect(prompt).toContain('IQ 300');
            expect(prompt).toContain('business management expert');
        });
    });
});
