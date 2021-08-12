const jwt = require('jsonwebtoken');

const Token = require('../models/token')

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

class TokenService {
    generate(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d'});

        return { accessToken, refreshToken };
    }

    validateAccess(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;            
        } catch (e) {
            return null;
        }
    }

    validateRefresh(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;            
        } catch (e) {
            return null;
        }
    }

    async save(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await Token.create({ user: userId, refreshToken});
    }

    async remove(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken})
        return tokenData;
    }

    async find(refreshToken) {
        const tokenData = await Token.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();