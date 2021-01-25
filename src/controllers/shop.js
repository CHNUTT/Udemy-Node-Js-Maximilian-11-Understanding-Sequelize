const Product = require('../models/product');
const Cart = require('../models/cart');

const getProducts = async (req, res, next) => {
  try {
    const [rows, fieldData] = await Product.fetchAll();
    res.render('shop/product-list', {
      prods: rows,
      path: '/products',
      pageTitle: 'All Products',
    });
  } catch (err) {
    console.error(err);
  }
};

const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) throw new Error('Product id is missing');
  try {
    const [[row], ..._] = await Product.findById(productId);
    res.render('shop/product-detail', {
      pageTitle: `Product detail | ${row.title} `,
      path: `product/${row.id}`,
      product: row,
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};

const getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = cart.products.map(({ id, qty }) => ({
        productData: products.find((prod) => prod.id === id),
        qty,
      }));
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

const postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
    res.redirect('/products');
  });
};

const postDeleteItemFromCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.removeProduct(productId, product.price);
  });
  res.redirect('/cart');
};

const getIndex = async (req, res, next) => {
  try {
    const [rows, fieldData] = await Product.fetchAll();
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (err) {
    console.error(err);
  }
};

const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

module.exports = {
  getProducts,
  getCart,
  getIndex,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postDeleteItemFromCart,
};
