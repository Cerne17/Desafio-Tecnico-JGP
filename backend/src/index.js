const express = require('express');
const cors =  require('cors');
const emissaoController = require('./controllers/emissao.controller.js');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/emissoes', emissaoController.listarEmissoes);
app.get('/emissoes/:id', emissaoController.obterEmissao);
app.put('/emissoes/:id', emissaoController.editarEmissao);
app.get('/stats', emissaoController.obterEstatisticas);

app.get('/', (req, res) => {
  res.json({ message: 'API JGP Crédito rodando!'});
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
