const route = require('express').Router();
const controller = require('../controller/orderController');
const checkAuth = require('../middleware/check-auth');

route.get('/', checkAuth, controller.getReq);

route.post('/', checkAuth, controller.create);

route.get('/:orderId', checkAuth, controller.showDetail);

route.delete('/:orderId', checkAuth, controller.deleteOrder);

module.exports = route;
