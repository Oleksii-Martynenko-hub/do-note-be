const authService = require('../services/auth');
const { validationResult } = require('express-validator');

const ApiError = require('../exceptions/api-error');

//  if ( password !== confirmPassword ) return res.send('Passwords differ');

class AuthController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return next(ApiError.BadRequest('Error validation', errors.array()))
      }
      const { email, password } = req.body;
      const userData = await authService.signup(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log("body",req.body, req.query);
      const userData = await authService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async confirm(req, res, next) {
    try {
      const confirmLink = req.params.link;
      await authService.confirm(confirmLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
