const winston = require('winston');
const path = require('path');

class Logger {
    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: {
                service: 'ai-business-management-system',
                user: 'William Smiley',
                system: 'PhD-level Business Operations with IQ 300 capabilities'
            },
            transports: [
                new winston.transports.File({
                    filename: path.join('logs', 'error.log'),
                    level: 'error',
                    maxsize: 5242880,
                    maxFiles: 5
                }),
                new winston.transports.File({
                    filename: path.join('logs', 'combined.log'),
                    maxsize: 5242880,
                    maxFiles: 10
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ]
        });

        this.createLogsDirectory();
    }

    createLogsDirectory() {
        const fs = require('fs');
        const logsDir = path.join(process.cwd(), 'logs');
        
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    info(message, meta = {}) {
        this.logger.info(message, meta);
    }

    error(message, meta = {}) {
        this.logger.error(message, meta);
    }

    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }

    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }

    logAIModelCall(modelName, prompt, response, duration) {
        this.logger.info('AI Model Call', {
            model: modelName,
            promptLength: prompt.length,
            responseLength: response.length,
            duration: duration,
            timestamp: new Date().toISOString()
        });
    }

    logExecutiveBoardDecision(decision, boardMembers, consensus, duration) {
        this.logger.info('Executive Board Decision', {
            decision: decision,
            boardMembers: boardMembers,
            consensus: consensus,
            duration: duration,
            timestamp: new Date().toISOString()
        });
    }

    logBusinessAnalysis(analysisType, topic, modelsUsed, confidence) {
        this.logger.info('Business Analysis', {
            type: analysisType,
            topic: topic,
            modelsUsed: modelsUsed,
            confidence: confidence,
            timestamp: new Date().toISOString()
        });
    }

    logVirtualizationOperation(operation, vmid, result) {
        this.logger.info('Virtualization Operation', {
            operation: operation,
            vmid: vmid,
            result: result,
            timestamp: new Date().toISOString()
        });
    }

    logSystemPerformance(metrics) {
        this.logger.info('System Performance', {
            ...metrics,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = new Logger();
