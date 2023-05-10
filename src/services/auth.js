const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const User = require('../models/users')
const mailService = require('./mail');
const tokenService = require('./token');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

// async function randomSalt() {
//     return crypto.randomBytes(64).toString('hex');
// }
// function sha256(txt){
//     const secret = 'abcdefg';
//     const hash = crypto.createHmac('sha256', secret)
//                     .update(txt)
//                     .digest('hex');
//    return hash;
// }



// function encryptAES(plainText, key){
 
//     const encrypt = crypto.createCipher('aes256', key);
//     let encrypted = encrypt.update(plainText, 'utf8', 'hex');
//     encrypted += encrypt.final('hex')
//     return encrypted;
// }




// function decryptAES(encryptedText, key){
//  try{
//     const decrypt = crypto.createDecipher('aes256', key);
//     let decrypted = decrypt.update(encryptedText, 'hex', 'utf8')
//     decrypted += decrypt.final()
//     return decrypted
//  }
//  catch(ex)
// {
//     return ex;
// }
 
// }
class AuthService {
    async signup(email, password) {
        const candidate = await User.findOne({ email });

        if (candidate) {throw ApiError.BadRequest(`User ${email} already exist!`);}

        const hashPassword = await bcrypt.hash(password, 6);

        const confirmLink = uuid.v4();
        const user = await User.create({ email, password: hashPassword, confirmLink });
        
        await mailService.sendConfirmMail(email, confirmLink);
        const userDto = new UserDto(user);
        const tokens = tokenService.generate({...userDto});
        await tokenService.save(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async confirm(confirmLink) {
        const user = await User.findOne({confirmLink});
        if (!user) {throw ApiError.BadRequest(`This link isn't correct!`);}
        user.isConfirmed = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({email})
        if (!user) {
            throw ApiError.BadRequest(`User ${email} not exist!`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password!');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generate({...userDto});

        await tokenService.save(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.remove(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefresh(refreshToken);
        const tokenFromDb = await tokenService.find(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generate({...userDto});

        await tokenService.save(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
}

module.exports = new AuthService();