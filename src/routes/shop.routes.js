const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

// Load controller
const shopControllers = require('../controllers/shop');

const router = express.Router();

router.get('/', shopControllers.getIndex);

router.get('/products', shopControllers.getProducts);

router.get('/products/:productId', shopControllers.getProduct);

router.post('/cart', shopControllers.postCart);

router.get('/cart', shopControllers.getCart);

router.post('/cart-delete-item', shopControllers.postDeleteItemFromCart);

router.get('/checkout', shopControllers.getCheckout);

router.get('/orders', shopControllers.getOrders);

router.post('/orders', shopControllers.postOrder);

module.exports = router;
