const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

const User = require('../models/users');

const transport = nodemailer.createTransport(sendGrid({
  auth: { api_key: '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'}
}))

const token = 'kljhLKJDhflkh3983YFyhedh23iohnfs8D';

exports.signup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) return res.send('User with this email exist');
      if ( password !== confirmPassword ) return res.send('Passwords differ');
      bcrypt.hash(password, 10)
        .then((hashPassword) => {
          const newUser = new User({ 
            name,
            email,
            password: hashPassword
          });
          newUser.save();
          res.send('Successfully signup');
        })
        .then(res => {
          transport.sendMail({
            to: email,
            from: 'alex47alex50@gmail.com',
            subject: 'Successfully signup',
            html: `<h1 style="color: #00ff00;" >Successfully signup</h1><p style="color: #0000ff;">Hi, ${name}! Congratulation, you have account of Notes&Tasks!!!</p>`
          })
        })
        .catch(err => console.log(err));
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.send('User with this email not exist');
      bcrypt.compare(password, user.password)
        .then((isValid) => {
          if ( !isValid ) return res.send('Password invalid');
          res.json(user._id.toString() + '.' + token);
        })
        .catch((err) => {
          console.log(err);
          res.send('server error');
        });
    });
};
