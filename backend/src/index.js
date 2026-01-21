const express = require('express');
const cors =  require('cors');
const emissoes = require('./routes/emissao.router.js');
const stats = require('./routes/stats.router.js');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/emissoes', emissoes)
app.use('/stats', stats);

app.get('/', (req, res) => {
  res.json({ message: 'API JGP Crédito rodando!'});
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
