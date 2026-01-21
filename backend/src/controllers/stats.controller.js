const StatsModel = require('../models/stats.model.js');

exports.obterEstatisticas = async (req, res) => {
    try {
        // Executa as 3 consultas em paralelo para ser mais rápido
        const [geral, porEmissor, porTipo] = await Promise.all([
            StatsModel.getGeneralStats(),
            StatsModel.getStatsByEmissor(),
            StatsModel.getStatsByTipo()
        ]);

        res.json({
            geral,
            por_emissor: porEmissor,
            por_tipo: porTipo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

