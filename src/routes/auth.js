const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/confirm/:link', authController.confirm);

router.post('/refresh', authController.refresh);

module.exports = router;
