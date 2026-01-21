const db = require('../lib/db.js');

exports.getGeneralStats = () => {
    const sql = `
        SELECT 
            COUNT(*) as total_emissoes,
            SUM(valor) as valor_total_centavos,
            CAST(ROUND(AVG(valor)) AS INTEGER) as valor_medio_centavos
        FROM Primario
    `;
    return new Promise((resolve, reject) => {
        db.get(sql, [], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

exports.getStatsByEmissor = () => {
    const sql = `
        SELECT e.nome, COUNT(p.id) as total, SUM(p.valor) as valor_total
        FROM Primario p
        JOIN Emissor e ON p.id_emissor = e.id
        GROUP BY e.nome
        ORDER BY valor_total DESC
        LIMIT 10 -- Top 10 emissores para não poluir
    `;
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.getStatsByTipo = () => {
    const sql = `
        SELECT t.codigo, COUNT(p.id) as total, SUM(p.valor) as valor_total
        FROM Primario p
        JOIN Tipo t ON p.id_tipo = t.id
        GROUP BY t.codigo
        ORDER BY valor_total DESC
    `;
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
