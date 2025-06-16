const request = require('supertest');
const app = require('../server');

describe('Employee API', () => {
    test('GET /api/employees should return 403 if not authorized', async () => {
        const res = await request(app).get('/api/employees');
        expect(res.statusCode).toBe(401);
    });
});