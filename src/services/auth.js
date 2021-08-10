const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const User = require('../models/users')
const mailService = require('./mail');
const tokenService = require('./token');
const UserDto = require('../dtos/user-dto');
// const ApiError = require('../exceptions/api-error');

class AuthService {
    async signup(email, password) {
        const candidate = await User.findOne({ email });
        if (candidate) throw new Error(`User ${email} already exist!`);
        const hashPassword = await bcrypt.hash(password, 6);
        const confirmLink = uuid.v4();
        const user = await User.create({ email, password: hashPassword, confirmLink });
        await mailService.sendConfirmMail(email, confirmLink);
        const userDto = new UserDto(user);
        const tokens = tokenService.generate({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
}

module.exports = new AuthService();