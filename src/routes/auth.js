const express = require('express');
const {body} = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post(
    '/signup',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    authController.signup,
);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/confirm/:link', authController.confirm);

router.get('/refresh', authController.refresh);

module.exports = router;
