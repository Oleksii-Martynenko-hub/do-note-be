const express = require('express');

const authControllers = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authControllers.signup);

router.post('/login', authControllers.login);

module.exports = router;
