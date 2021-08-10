const jwt = require('jsonwebtoken');

const Token = require('../models/token')
// const tokenService = require('./token-service');
// const UserDto = require('../dtos/user-dto');
// const ApiError = require('../exceptions/api-error');

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

class TokenService {
    generate(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d'});

        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await Token.create({ user: userId, refreshToken});
    }
}

module.exports = new TokenService();