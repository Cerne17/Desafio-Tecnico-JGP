const db = require('../lib/db.js');

exports.listarEmissoes = (req, res) => {
  let sql = `
    SELECT
      p.id,
      p.data,
      p.valor,
      p.link,
      e.nome as emissor,
      t.codigo as tipo
    FROM Primario p
    JOIN Emissor e ON p.id_emissor = e.id
    JOIN Tipo t ON p.id_tipo = t.id
  `;

  const params = [];
  if (req.query.emissor) {
    sql += ` WHERE e.nome LIKE ?`;
    params.push(`%${req.query.emissor}%`);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.obterEmissao = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT p.*, e.nome as emissor, t.codigo as tipo
    FROM Primario p
    JOIN Emissor e ON p.id_emissor = e.id
    JOIN Tipo t ON p.id_tipo = t.id
    WHERE p.id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    };
    if (!row) {
      return res.status(404).json({ error: 'Emissão não encontrada' });
    };
    res.json(row);
  });
};

exports.editarEmissao = (req, res) => {
  const { id } = req.params;
  const { valor, data, link } = req.body;
  const valorCentavos = valor ? Math.round(valor * 100) : null;

  const sql = `
    UPDATE Primario
    SET valor = COALESCE(?, valor),
        data  = COALESCE(?, data),
        link  = COALESCE(?, link)
    WHERE id = ?
  `;

  db.run(sql, [valorCentavos, data, link, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    };
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Emissão não encontrada' });
    };
    res.json({ message: 'Atualizado com sucesso', change: this.changes });
  });
};

exports.obterEstatisticas = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) as total_emissoes,
      SUM(valor) as valor_total_emissoes,
      ROUND(AVG(valor), 0) as valor_medio_centavos
    FROM Primario
  `;

  db.get(sql, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    };
    res.json(row);
  });
};

