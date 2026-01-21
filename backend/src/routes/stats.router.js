const express = require('express');
const statsController = require('../controllers/stats.controller.js');

const router = express.Router();

router.get('/', statsController.obterEstatisticas);

module.exports = router;

