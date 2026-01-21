const EmissaoModel = require('../models/emissao.model.js');

exports.listarEmissoes = async (req, res) => {
    try {
        const emissoes = await EmissaoModel.getAll(req.query);
        res.json(emissoes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obterEmissao = async (req, res) => {
    try {
        const emissao = await EmissaoModel.getById(req.params.id);
        if (!emissao) return res.status(404).json({ error: 'Emissão não encontrada' });
        res.json(emissao);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editarEmissao = async (req, res) => {
    try {
        const result = await EmissaoModel.update(req.params.id, req.body);
        if (result.changes === 0) return res.status(404).json({ error: 'Emissão não encontrada' });
        res.json({ message: 'Atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

