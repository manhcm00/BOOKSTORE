const route = require('express').Router();
const controller = require('../controller/productController');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

route.get('/', controller.index);

route.get('/:productId', controller.getById);

route.patch('/:productId', checkAuth, controller.updateById);

route.post('/', checkAuth, upload.single('productImage'), controller.create);

route.delete('/:productId', checkAuth, controller.deleteById);

module.exports = route;
