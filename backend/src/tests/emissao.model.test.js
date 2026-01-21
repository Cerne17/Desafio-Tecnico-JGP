const dbMock = require('./mocks/db.mock');

// Mock o módulo de banco de dados real para retornar o nosso mock
jest.mock('../lib/db.js', () => dbMock);

const EmissaoModel = require('../models/emissao.model');

describe('EmissaoModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('deve retornar todas as emissões sem filtros', async () => {
            const mockRows = [{ id: 1, emissor: 'Test' }];
            dbMock.all.mockImplementation((sql, params, callback) => {
                callback(null, mockRows);
            });

            const result = await EmissaoModel.getAll({});
            expect(result).toEqual(mockRows);
            expect(dbMock.all).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [], expect.any(Function));
        });

        it('deve aplicar filtro de emissor corretamente', async () => {
            dbMock.all.mockImplementation((sql, params, callback) => {
                callback(null, []);
            });

            await EmissaoModel.getAll({ emissor: 'JGP' });
            expect(dbMock.all).toHaveBeenCalledWith(
                expect.stringContaining('WHERE e.nome LIKE ?'),
                ['%JGP%'],
                expect.any(Function)
            );
        });
    });

    describe('getById', () => {
        it('deve retornar uma emissão por ID', async () => {
            const mockRow = { id: 1, emissor: 'Test' };
            dbMock.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow);
            });

            const result = await EmissaoModel.getById(1);
            expect(result).toEqual(mockRow);
            expect(dbMock.get).toHaveBeenCalledWith(expect.stringContaining('WHERE p.id = ?'), [1], expect.any(Function));
        });
    });
});
