const Product = require('../models/productSchema');
const mongoose = require('mongoose');

module.exports.index = (req, res, next) => {
	const perPage = 9;
	const pageNumber = req.query.page || 0
	Product.find()
		.skip(pageNumber * perPage)
		.limit(perPage)
		.select('name price _id productImage')
		.exec()
		.then((docs) => {
			const response = {
				count: docs.length,
				products: docs.map((doc) => {
					return {
						name: doc.name,
						price: doc.price,
						_id: doc._id,
						productImage: doc.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:5000/products/' + doc._id
						}
					};
				})
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

module.exports.getById = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select('name price _id productImage')
		.exec()
		.then((doc) => {
			console.log('From database', doc);
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: 'GET',
						description: 'GET all products',
						url: 'http://localhost:5000/products/'
					}
				});
			} else {
				res.status(404).json({ message: 'No valid entry found for provided ID' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
};

module.exports.create = (req, res, next) => {
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	product
		.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: 'Created product successfully!',
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:5000/products/' + result._id
					}
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

module.exports.updateById = (req, res, next) => {
	const id = req.params.productId;
	const updateOps = { ...req.body };
	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			console.log(result);
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

module.exports.deleteById = (req, res, next) => {
	Product.remove({ _id: req.params.productId })
		.exec()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
