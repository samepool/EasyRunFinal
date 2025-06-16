const request = require('supertest');
const app = require('../server');

describe('Schedule API', () => {
    test('GET /api/schedules should return all schedules', async () => {
        const res = await request(app).get('/api/schedules');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});