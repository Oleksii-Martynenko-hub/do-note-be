const mongoose = require('mongoose');
const User = require('../models/users');

const token = 'kljhLKJDhflkh3983YFyhedh23iohnfs8D';

exports.addUser = (req, res, next) => {
  const user = new User(req.body);

  user.save().then((user) => res.status(201).json(user));
};

exports.userById = (req, res, next) => {
  User.findById(req.params.id).then((userById) => res.send(userById));
};

exports.editUser = (req, res, next) => {
  const {user_id, user} = req.body;

  User.findByIdAndUpdate(stringId, user).then((user) => {
    User.findById(user._id).then((userById) => res.send(userById));
  });
};

exports.editUserData = (req, res, next) => {
  const {user_id, data} = req.body;

  User.findByIdAndUpdate(user_id, { data }).then((user) => {
    User.findById(user._id).then((userById) => res.send(userById));
  });
};

exports.deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => res.send(user ? 'User successfully deleted' : 'Something wrong!'));
};

exports.reverseNameUser = (req, res, next) => {
  User.findById(req.params.id).then((userById) => {
    res.send(User.reverseNameUser(userById.name));
  });
};

exports.allUsers = (req, res, next) => {
  User.find().then((usersData) => res.send(usersData));
};
