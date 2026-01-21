const db = require('../lib/db.js');

exports.getAll = (filters) => {
    let sql = `
        SELECT p.id, p.data, p.valor, p.link, e.nome as emissor, t.codigo as tipo
        FROM Primario p
        JOIN Emissor e ON p.id_emissor = e.id
        JOIN Tipo t ON p.id_tipo = t.id
    `;
    const params = [];
    
    if (filters.emissor) {
        sql += ` WHERE e.nome LIKE ?`;
        params.push(`%${filters.emissor}%`);
    }

    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.getById = (id) => {
    const sql = `
        SELECT p.*, e.nome as emissor, t.codigo as tipo
        FROM Primario p
        JOIN Emissor e ON p.id_emissor = e.id
        JOIN Tipo t ON p.id_tipo = t.id
        WHERE p.id = ?
    `;
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

exports.update = (id, data) => {
    const valorCentavos = data.valor ? Math.round(data.valor * 100) : null;
    const sql = `
        UPDATE Primario 
        SET valor = COALESCE(?, valor), 
            data = COALESCE(?, data),
            link = COALESCE(?, link)
        WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
        db.run(sql, [valorCentavos, data.data, data.link, id], function(err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
};
