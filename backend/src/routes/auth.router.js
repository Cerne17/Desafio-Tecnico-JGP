const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'jgp-secret-key-123';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Autenticação mockada para o desafio
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ id: 1, user: 'admin' }, SECRET, {
            expiresIn: '1d'
        });

        return res.json({ token });
    }

    return res.status(401).json({ error: 'Credenciais inválidas' });
});

module.exports = router;
