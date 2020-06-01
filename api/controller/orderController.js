const mongoose = require('mongoose');

const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');

module.exports.getReq = (req, res, next) => {
	Order.find()
		.select('_id reciverName reciverPhone orderDate total')
		.exec()
		.then((docs) => {
			res.status(200).json({
				count: docs.length,
				order: docs.map((doc) => {
					return {
						_id: doc._id,
						product: doc.product,
						orderDate: doc.orderDate,
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
	console.log(req.body);
	const { reciverName, reciverPhone, reciverEmail, reciverAddress, comment, products, total, userId } = req.body;
	const newOrder = new Order({
		_id: mongoose.Types.ObjectId(),
		userId: userId,
		reciverName: reciverName,
		reciverPhone: reciverPhone,
		reciverEmail: reciverEmail,
		reciverAddress: reciverAddress,
		comment: comment,
		products: [ ...products ],
		total: total
	});
	newOrder
		.save()
		.then((doc) => {
			res.status(201).json({
				message: 'Order successfully',
				createdOrder: {
					...newOrder
				},
				document: doc,
				request: {
					type: 'GET',
					url: 'http://localhost:5000/orders/' + newOrder._id
				}
			});
		})
		.catch((err) => {
			res.status(201).json({
				message: "Order failed, please make sure your reciver's information is valid",
				error: err
			});
		});
};

module.exports.showDetail = (req, res, next) => {
	Order.findById(req.params.orderId)
		.exec()
		.then((order) => {
			if (!order) {
				return res.status(404).json({
					message: 'Order not found'
				});
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
