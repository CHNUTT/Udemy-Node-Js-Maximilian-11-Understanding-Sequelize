const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');

// Load controller
const adminControllers = require('../controllers/admin');

router.get('/add-product', adminControllers.getAddProduct);

router.post('/add-product', adminControllers.postAddProduct);

router.get('/edit-product/:productId', adminControllers.getAdminEditProduct);

router.get('/products', adminControllers.getAdminProducts);

router.post('/products', adminControllers.postEditProduct);

router.post('/delete-product/:productId', adminControllers.postDeleteProduct);

module.exports = router;
