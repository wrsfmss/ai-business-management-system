const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const winston = require('winston');
require('dotenv').config();

const AIModelManager = require('./ai-models/model-manager');
const BusinessOperations = require('./business-operations/operations-manager');
const ExecutiveBoard = require('./executive-board/board-manager');
const CoordinationEngine = require('./coordination/coordination-engine');

class AIBusinessManagementServer {
    constructor() {
        this.server = new Server(
            {
                name: 'ai-business-management-system',
                version: '1.0.0',
                description: 'Super-intelligent business management operations support system with PhD-level expertise and IQ 300 capabilities'
            },
            {
                capabilities: {
                    tools: {},
                    resources: {},
                    prompts: {}
                }
            }
        );

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/ai-business-system.log' })
            ]
        });

        this.aiModelManager = new AIModelManager(this.logger);
        this.businessOperations = new BusinessOperations(this.logger);
        this.executiveBoard = new ExecutiveBoard(this.logger);
        this.coordinationEngine = new CoordinationEngine(this.logger);

        this.setupHandlers();
    }

    setupHandlers() {
        this.server.setRequestHandler('tools/list', async () => {
            return {
                tools: [
                    {
                        name: 'strategic_analysis',
                        description: 'Perform PhD-level strategic business analysis using 20+ AI models',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                topic: { type: 'string', description: 'Business topic to analyze' },
                                depth: { type: 'string', enum: ['basic', 'advanced', 'phd_level'], default: 'phd_level' },
                                models: { type: 'array', items: { type: 'string' }, description: 'Specific AI models to use' }
                            },
                            required: ['topic']
                        }
                    },
                    {
                        name: 'executive_decision_support',
                        description: 'Multi-AI executive board decision support with IQ 300 analytical capabilities',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                decision: { type: 'string', description: 'Decision to be made' },
                                context: { type: 'string', description: 'Business context and constraints' },
                                stakeholders: { type: 'array', items: { type: 'string' }, description: 'Key stakeholders' }
                            },
                            required: ['decision']
                        }
                    },
                    {
                        name: 'business_operations_optimization',
                        description: 'Comprehensive business operations analysis and optimization',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                area: { type: 'string', description: 'Business area to optimize' },
                                metrics: { type: 'array', items: { type: 'string' }, description: 'Key performance indicators' },
                                constraints: { type: 'object', description: 'Business constraints and limitations' }
                            },
                            required: ['area']
                        }
                    },
                    {
                        name: 'multi_ai_research',
                        description: 'Comprehensive research using STORM and multiple AI models',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: { type: 'string', description: 'Research query' },
                                sources: { type: 'array', items: { type: 'string' }, description: 'Preferred information sources' },
                                format: { type: 'string', enum: ['report', 'presentation', 'executive_summary'], default: 'report' }
                            },
                            required: ['query']
                        }
                    },
                    {
                        name: 'virtualization_management',
                        description: 'Manage Proxmox VE virtualization environment',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                action: { type: 'string', enum: ['create_vm', 'manage_vm', 'optimize_resources', 'status'] },
                                vm_config: { type: 'object', description: 'Virtual machine configuration' }
                            },
                            required: ['action']
                        }
                    }
                ]
            };
        });

        this.server.setRequestHandler('tools/call', async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case 'strategic_analysis':
                        return await this.handleStrategicAnalysis(args);
                    case 'executive_decision_support':
                        return await this.handleExecutiveDecisionSupport(args);
                    case 'business_operations_optimization':
                        return await this.handleBusinessOperationsOptimization(args);
                    case 'multi_ai_research':
                        return await this.handleMultiAIResearch(args);
                    case 'virtualization_management':
                        return await this.handleVirtualizationManagement(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                this.logger.error(`Tool execution error: ${error.message}`, { tool: name, args });
                throw error;
            }
        });

        this.server.setRequestHandler('resources/list', async () => {
            return {
                resources: [
                    {
                        uri: 'business://knowledge-base',
                        name: 'PhD-Level Business Knowledge Base',
                        description: 'Comprehensive business management knowledge with PhD-level expertise'
                    },
                    {
                        uri: 'ai-models://available',
                        name: 'Available AI Models',
                        description: 'List of 20+ integrated AI models and their capabilities'
                    },
                    {
                        uri: 'executive-board://members',
                        name: 'Executive Board Members',
                        description: 'Business executive directors board swarm council members'
                    },
                    {
                        uri: 'virtualization://status',
                        name: 'Virtualization Status',
                        description: 'Proxmox VE and VM status information'
                    }
                ]
            };
        });

        this.server.setRequestHandler('resources/read', async (request) => {
            const { uri } = request.params;

            switch (uri) {
                case 'business://knowledge-base':
                    return await this.businessOperations.getKnowledgeBase();
                case 'ai-models://available':
                    return await this.aiModelManager.getAvailableModels();
                case 'executive-board://members':
                    return await this.executiveBoard.getBoardMembers();
                case 'virtualization://status':
                    return await this.getVirtualizationStatus();
                default:
                    throw new Error(`Unknown resource: ${uri}`);
            }
        });

        this.server.setRequestHandler('prompts/list', async () => {
            return {
                prompts: [
                    {
                        name: 'phd_business_analysis',
                        description: 'PhD-level business analysis prompt template',
                        arguments: [
                            { name: 'topic', description: 'Business topic to analyze', required: true },
                            { name: 'industry', description: 'Industry context', required: false },
                            { name: 'timeframe', description: 'Analysis timeframe', required: false }
                        ]
                    },
                    {
                        name: 'executive_briefing',
                        description: 'Executive-level briefing template for William Smiley',
                        arguments: [
                            { name: 'subject', description: 'Briefing subject', required: true },
                            { name: 'urgency', description: 'Urgency level', required: false },
                            { name: 'stakeholders', description: 'Key stakeholders', required: false }
                        ]
                    },
                    {
                        name: 'iq300_problem_solving',
                        description: 'IQ 300 level problem-solving approach',
                        arguments: [
                            { name: 'problem', description: 'Problem to solve', required: true },
                            { name: 'constraints', description: 'Problem constraints', required: false },
                            { name: 'objectives', description: 'Desired outcomes', required: false }
                        ]
                    }
                ]
            };
        });

        this.server.setRequestHandler('prompts/get', async (request) => {
            const { name, arguments: args } = request.params;
            return await this.generatePrompt(name, args);
        });
    }

    async handleStrategicAnalysis(args) {
        this.logger.info('Executing strategic analysis', { args });
        
        const analysis = await this.coordinationEngine.coordinateMultiAIAnalysis({
            type: 'strategic_analysis',
            topic: args.topic,
            depth: args.depth || 'phd_level',
            models: args.models || ['gpt5', 'claude', 'abacus', 'genspark', 'storm']
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `# PhD-Level Strategic Analysis: ${args.topic}\n\n${analysis.summary}\n\n## Multi-AI Insights\n\n${analysis.insights}\n\n## Executive Recommendations\n\n${analysis.recommendations}`
                }
            ]
        };
    }

    async handleExecutiveDecisionSupport(args) {
        this.logger.info('Executing executive decision support', { args });
        
        const decision = await this.executiveBoard.processDecision({
            decision: args.decision,
            context: args.context,
            stakeholders: args.stakeholders || []
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `# Executive Decision Support\n\n## Decision: ${args.decision}\n\n## Board Analysis\n\n${decision.analysis}\n\n## Consensus Recommendation\n\n${decision.recommendation}\n\n## Risk Assessment\n\n${decision.risks}\n\n## Implementation Plan\n\n${decision.implementation}`
                }
            ]
        };
    }

    async handleBusinessOperationsOptimization(args) {
        this.logger.info('Executing business operations optimization', { args });
        
        const optimization = await this.businessOperations.optimizeArea({
            area: args.area,
            metrics: args.metrics || [],
            constraints: args.constraints || {}
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `# Business Operations Optimization: ${args.area}\n\n## Current State Analysis\n\n${optimization.currentState}\n\n## Optimization Opportunities\n\n${optimization.opportunities}\n\n## Implementation Roadmap\n\n${optimization.roadmap}\n\n## Expected ROI\n\n${optimization.roi}`
                }
            ]
        };
    }

    async handleMultiAIResearch(args) {
        this.logger.info('Executing multi-AI research', { args });
        
        const research = await this.coordinationEngine.coordinateResearch({
            query: args.query,
            sources: args.sources || [],
            format: args.format || 'report',
            models: ['storm', 'perplexity', 'gpt5', 'claude', 'genspark']
        });

        return {
            content: [
                {
                    type: 'text',
                    text: `# Multi-AI Research Report\n\n## Query: ${args.query}\n\n## Executive Summary\n\n${research.summary}\n\n## Detailed Analysis\n\n${research.analysis}\n\n## Sources and References\n\n${research.sources}\n\n## AI Model Contributions\n\n${research.contributions}`
                }
            ]
        };
    }

    async handleVirtualizationManagement(args) {
        this.logger.info('Executing virtualization management', { args });
        
        const VirtualizationManager = require('./virtualization/vm-manager');
        const vmManager = new VirtualizationManager(this.logger);
        
        const result = await vmManager.executeAction(args.action, args.vm_config);

        return {
            content: [
                {
                    type: 'text',
                    text: `# Virtualization Management\n\n## Action: ${args.action}\n\n## Result\n\n${result.message}\n\n## Status\n\n${result.status}\n\n## Details\n\n${JSON.stringify(result.details, null, 2)}`
                }
            ]
        };
    }

    async generatePrompt(name, args) {
        const prompts = {
            phd_business_analysis: `You are a PhD-level business management expert with an IQ of 300. Analyze the following business topic with the depth and rigor expected at the doctoral level:

Topic: ${args.topic}
Industry: ${args.industry || 'General'}
Timeframe: ${args.timeframe || 'Current'}

Provide a comprehensive analysis including:
1. Strategic framework analysis
2. Market dynamics and competitive landscape
3. Financial implications and projections
4. Risk assessment and mitigation strategies
5. Implementation recommendations
6. Success metrics and KPIs

Use advanced business theories, models, and frameworks in your analysis.`,

            executive_briefing: `Prepare an executive briefing for William Smiley, CEO-level business executive:

Subject: ${args.subject}
Urgency: ${args.urgency || 'Standard'}
Stakeholders: ${args.stakeholders || 'Executive Team'}

Format the briefing with:
1. Executive Summary (2-3 key points)
2. Strategic Implications
3. Financial Impact
4. Recommended Actions
5. Timeline and Next Steps

Keep it concise, actionable, and focused on business outcomes.`,

            iq300_problem_solving: `Apply IQ 300 level analytical thinking to solve this complex problem:

Problem: ${args.problem}
Constraints: ${args.constraints || 'Standard business constraints'}
Objectives: ${args.objectives || 'Optimal business outcome'}

Use advanced problem-solving methodologies:
1. Multi-dimensional problem decomposition
2. Systems thinking and interconnection analysis
3. Scenario modeling and probability assessment
4. Creative solution generation
5. Risk-adjusted decision optimization
6. Implementation feasibility analysis

Provide multiple solution pathways with detailed analysis.`
        };

        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: prompts[name] || `Unknown prompt: ${name}`
                    }
                }
            ]
        };
    }

    async getVirtualizationStatus() {
        const VirtualizationManager = require('./virtualization/vm-manager');
        const vmManager = new VirtualizationManager(this.logger);
        return await vmManager.getStatus();
    }

    async start() {
        this.logger.info('Starting AI Business Management System...');
        
        await this.aiModelManager.initialize();
        await this.businessOperations.initialize();
        await this.executiveBoard.initialize();
        await this.coordinationEngine.initialize();

        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        
        this.logger.info('AI Business Management System started successfully');
        this.logger.info('System ready for William Smiley and Executive Board operations');
    }
}

if (require.main === module) {
    const server = new AIBusinessManagementServer();
    server.start().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

module.exports = AIBusinessManagementServer;
