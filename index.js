// third party place
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
cors = require('cors');

//connect database
mongoose.connect(process.env.URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true
});

// express config
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// middleware place

// import Routers
const productRouter = require('./api/routers/product');
const orderRouter = require('./api/routers/order');
const userRoute = require('./api/routers/user');

// use third party place
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With', 'Content-Type', 'Accept', 'Authorization');
	if (req.method === 'OPTIONS') {
		req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

//Router place
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/user', userRoute);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
