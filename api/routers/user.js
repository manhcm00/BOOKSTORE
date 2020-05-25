const route = require('express').Router();
const controller = require('../controller/userController');

route.post('/signup', controller.createUser);

route.post('/login', controller.login);

route.delete('/:userId', controller.deleteUser);

module.exports = route;
