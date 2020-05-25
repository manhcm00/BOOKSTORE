const mongoose = require('mongoose');

const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');

module.exports.getReq = (req, res, next) => {
	Order.find()
		.select('product quantity _id')
		.populate('product', 'name _id price')
		.exec()
		.then((docs) => {
			res.status(200).json({
				count: docs.length,
				order: docs.map((doc) => {
					return {
						_id: doc._id,
						product: doc.product,
						quantity: doc.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:5000/orders/' + doc._id
						}
					};
				})
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};

module.exports.create = (req, res, next) => {
	Product.findById(req.body.productId)
		.exec()
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					message: 'Product not found'
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				product: req.body.productId,
				quantity: req.body.quantity
			});
			return order.save();
		})
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: 'Order stored',
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:5000/orders/' + result._id
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

module.exports.showDetail = (req, res, next) => {
	Order.findById(req.params.orderId)
		.select('_id product quantity')
		.populate('product')
		.exec()
		.then((order) => {
			if (!order) {
				return res.status(404).json({
					message: 'Order not found'
				})
			}
			res.status(200).json({
				order: order,
				request: {
					type: 'GET',
					url: 'httl://localhost:5000/orders/'
				}
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};

module.exports.deleteOrder = (req, res, next) => {
	Order.remove({ _id: req.params.orderId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Order deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:5000/orders',
					body: {
						productId: 'ID',
						quantity: 'Number'
					}
				}
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};
