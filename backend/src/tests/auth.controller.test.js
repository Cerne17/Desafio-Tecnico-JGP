const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');

const app = express();
app.use(express.json());
app.post('/auth/login', authController.login);

describe('AuthController', () => {
    it('deve retornar 200 e um token para credenciais válidas', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'admin', password: 'admin' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'jgp-secret-key-123');
        expect(decoded.user).toBe('admin');
    });

    it('deve retornar 401 para credenciais inválidas', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'errado', password: '123' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Credenciais inválidas');
    });
});
