const express = require('express');

const usersControllers = require('../controllers/users')

const router = express.Router();

router.post('/add-user', usersControllers.addUser);

router.get('/user/:id', usersControllers.userById);

router.post('/user/edit', usersControllers.editUser);

router.post('/user/edit-data', usersControllers.editUserData);

router.get('/user/:id/delete', usersControllers.deleteUser);

router.get('/users', usersControllers.allUsers);

module.exports = router;
