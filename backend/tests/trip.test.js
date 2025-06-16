const request = require('supertest');
const app = require('../server');

describe('Trip API', () => {
    test('GET /api/trips should return all trips', async () => {
        const res = await request(app).get('/api/trips');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});