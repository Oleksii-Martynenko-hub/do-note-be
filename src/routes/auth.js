const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/confirm/:link', authController.confirm);

router.get('/refresh', authController.refresh);

module.exports = router;
