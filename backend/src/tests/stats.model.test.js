const dbMock = require('./mocks/db.mock');
jest.mock('../lib/db.js', () => dbMock);

const StatsModel = require('../models/stats.model');

describe('StatsModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getGeneralStats', () => {
        it('deve retornar estatísticas gerais', async () => {
            const mockRow = { total_emissoes: 10, valor_total_centavos: 1000 };
            dbMock.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow);
            });

            const result = await StatsModel.getGeneralStats();
            expect(result).toEqual(mockRow);
            expect(dbMock.get).toHaveBeenCalledWith(expect.stringContaining('SUM(valor)'), [], expect.any(Function));
        });
    });

    describe('getStatsByEmissor', () => {
        it('deve retornar estatísticas agrupadas por emissor', async () => {
            const mockRows = [{ nome: 'JGP', total: 5 }];
            dbMock.all.mockImplementation((sql, params, callback) => {
                callback(null, mockRows);
            });

            const result = await StatsModel.getStatsByEmissor();
            expect(result).toEqual(mockRows);
            expect(dbMock.all).toHaveBeenCalledWith(expect.stringContaining('GROUP BY e.nome'), [], expect.any(Function));
        });
    });
});
