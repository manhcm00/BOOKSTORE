const mongoose = require('mongoose');
const moment = require('moment-timezone');

const dateVietnam = moment.tz(Date.now(), "Asia/Bangkok").format();

const orderSchema = mongoose.Schema({
	// _id: mongoose.Schema.Types.ObjectId,
	// product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	// quantity: { type: Number, default: 1 }
	_id: mongoose.Schema.Types.ObjectId,
	userId: mongoose.Schema.Types.ObjectId,
	reciverName: { type: String, require: true },
	reciverPhone: { type: String, required: true, match: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/ },
	reciverEmail: {
		type: String,
		required: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	reciverAddress: {
		type: String,
		required: true
	},
	orderDate: { type: Date, default: dateVietnam },
	comment: { type: String },
	products: [ {} ],
	total: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema);
