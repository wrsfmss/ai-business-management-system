const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const startedAt = new Date().toISOString();

function parseProviderChain(value) {
    if (!value) {
        return ['claude-sonnet-4', 'gpt-4o', 'gemini-flash', 'claude-haiku'];
    }

    return value
        .split(',')
        .map((provider) => provider.trim())
        .filter(Boolean);
}

function parseJobs(value) {
    if (!value) {
        return [
            { id: 'weekly-grant-scan', schedule: '0 9 * * 1', target: 'telegram', enabled: true },
            { id: 'daily-system-check', schedule: '0 8 * * *', target: 'dashboard', enabled: true }
        ];
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'ai-business-management-system-http-api'
    });
});

app.get('/healthz', (_req, res) => {
    res.json({
        status: 'ok',
        uptimeSeconds: Math.floor(process.uptime()),
        startedAt
    });
});

app.get('/providers', (_req, res) => {
    res.json({
        fallbackChain: parseProviderChain(process.env.LLM_FALLBACK_CHAIN)
    });
});

app.get('/jobs', (_req, res) => {
    res.json({
        jobs: parseJobs(process.env.JOBS_JSON)
    });
});

const port = Number(process.env.PORT || 8000);
if (require.main === module) {
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`HTTP API listening on http://127.0.0.1:${port}`);
    });
}

module.exports = app;
