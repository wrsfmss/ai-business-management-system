const app = require('../src/http-server');

describe('HTTP Dashboard API', () => {
    let server;
    let baseUrl;

    beforeAll(async () => {
        server = app.listen(0);
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
    });

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    test('GET / returns status payload', async () => {
        const response = await fetch(`${baseUrl}/`);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.status).toBe('ok');
        expect(json.service).toBe('ai-business-management-system-http-api');
    });

    test('GET /healthz returns health payload', async () => {
        const response = await fetch(`${baseUrl}/healthz`);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.status).toBe('ok');
        expect(typeof json.uptimeSeconds).toBe('number');
        expect(typeof json.startedAt).toBe('string');
    });

    test('GET /providers respects LLM_FALLBACK_CHAIN', async () => {
        const original = process.env.LLM_FALLBACK_CHAIN;
        process.env.LLM_FALLBACK_CHAIN = 'alpha,beta,gamma';

        const response = await fetch(`${baseUrl}/providers`);
        const json = await response.json();

        if (original === undefined) {
            delete process.env.LLM_FALLBACK_CHAIN;
        } else {
            process.env.LLM_FALLBACK_CHAIN = original;
        }

        expect(response.status).toBe(200);
        expect(json.fallbackChain).toEqual(['alpha', 'beta', 'gamma']);
    });

    test('GET /jobs falls back to [] when JOBS_JSON is invalid JSON', async () => {
        const original = process.env.JOBS_JSON;
        process.env.JOBS_JSON = '{invalid';

        const response = await fetch(`${baseUrl}/jobs`);
        const json = await response.json();

        if (original === undefined) {
            delete process.env.JOBS_JSON;
        } else {
            process.env.JOBS_JSON = original;
        }

        expect(response.status).toBe(200);
        expect(json.jobs).toEqual([]);
    });
});
