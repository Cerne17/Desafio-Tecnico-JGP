const request = require('supertest');
const express = require('express');

const dbMock = require('./mocks/db.mock');
jest.mock('../lib/db.js', () => dbMock);

// Mock o model
jest.mock('../models/emissao.model', () => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn()
}));
const EmissaoModel = require('../models/emissao.model');

const emissaoController = require('../controllers/emissao.controller');

const app = express();
app.use(express.json());
app.get('/emissoes', emissaoController.listarEmissoes);
app.get('/emissoes/:id', emissaoController.obterEmissao);
app.put('/emissoes/:id', emissaoController.editarEmissao);

describe('EmissaoController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /emissoes', () => {
        it('deve retornar 200 e a lista de emissões', async () => {
            const mockEmissoes = [{ id: 1, emissor: 'Test' }];
            EmissaoModel.getAll.mockResolvedValue(mockEmissoes);

            const response = await request(app).get('/emissoes');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockEmissoes);
        });

        it('deve retornar 500 se o model falhar', async () => {
            EmissaoModel.getAll.mockRejectedValue(new Error('DB Error'));

            const response = await request(app).get('/emissoes');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('DB Error');
        });
    });

    describe('GET /emissoes/:id', () => {
        it('deve retornar 200 se a emissão for encontrada', async () => {
            const mockEmissao = { id: 1, emissor: 'Test' };
            EmissaoModel.getById.mockResolvedValue(mockEmissao);

            const response = await request(app).get('/emissoes/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockEmissao);
        });

        it('deve retornar 404 se não for encontrada', async () => {
            EmissaoModel.getById.mockResolvedValue(null);

            const response = await request(app).get('/emissoes/99');

            expect(response.status).toBe(404);
        });
    });
});
