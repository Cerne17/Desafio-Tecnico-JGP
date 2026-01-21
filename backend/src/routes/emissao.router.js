const express = require('express');
const emissaoController = require('../controllers/emissao.controller.js');

const router = express.Router();

router.get('/', emissaoController.listarEmissoes);
router.get('/:id', emissaoController.obterEmissao);
router.put('/:id', emissaoController.editarEmissao);

module.exports = router;
