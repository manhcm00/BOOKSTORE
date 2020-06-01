const mongoose = require('mongoose');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const localStorage = require('local-storage');

module.exports.createUser = (req, res, next) => {
	if (!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
		return res.status(409).json({
			message: 'Password contain at least 8 characters, 1 number, 1 uppercase and 1 lowercase'
		});
	}
	User.find({ email: req.body.email })
		.exec()
		.then((user) => {
			if (user.length >= 1) {
				return res.status(409).json({
					message: 'Mail exists'
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err
						});
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash
						});
						user
							.save()
							.then((result) => {
								console.log(result);
								res.status(201).json({
									message: 'User created successfully'
								});
							})
							.catch((err) => {
								console.log(err);
								res.status(500).json({
									error: err
								});
							});
					}
				});
			}
		})
		.catch((err) => {
			res.status(404).json({
				error: err
			});
		});
};

module.exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			bcrypt.compare(req.body.password, user.password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email: user.email,
							userId: user._id
						},
						process.env.JWT_KEY,
						{
							expiresIn: '1h'
						}
					);
					localStorage.set('jwtToken', token);
					return res.status(200).json({
						message: 'Auth successful',
						token: token,
						userId: user._id
					});
				}
				res.status(401).json({
					message: 'Auth failed'
				});
			});
		})
		.catch((err) => {
			res.status(404).json({
				error: err
			});
		});
};

module.exports.deleteUser = (req, res, next) => {
	User.remove({ _id: req.params.userId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'User deleted'
			});
		})
		.catch((err) => {
			res.status(404).json({
				error: err
			});
		});
};
