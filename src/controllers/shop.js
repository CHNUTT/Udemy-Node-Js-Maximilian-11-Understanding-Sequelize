const Product = require('../models/product');
const Cart = require('../models/cart');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/product-list', {
      prods: products,
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
    const product = await Product.findByPk(productId);
    const [product2, ..._] = await Product.findAll({
      where: { id: productId },
    });
    console.log(product2);
    if (!product) {
      throw new Error(`Can't find the product`);
    }
    res.render('shop/product-detail', {
      pageTitle: `Product detail | ${product.title} `,
      path: `product/${product.id}`,
      product,
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};

const getCart = async (req, res, next) => {
  try {
    // TODO 1) Get current user cart
    const cart = await req.user.getCart();

    // TODO 2) Get all products from the cart
    const cartProducts = await cart.getProducts();

    // TODO 3) Pass cartProducts into view to render
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: cartProducts,
    });
  } catch (err) {
    console.error(err);
  }
};

const postCart = async (req, res, next) => {
  // TODO 1) Get product id
  const { productId } = req.body;
  let newQty = 1;

  try {
    // TODO 2) Check if the product existed
    const product = await Product.findByPk(productId);
    if (!product) throw new Error(`Invalid product id`);

    // TODO 3) Get the current user cart
    const cart = await req.user.getCart();

    // TODO 4) Check if the adding product is alread existed in the cart
    const [existingProduct, ..._] = await cart.getProducts({
      where: { id: productId },
    });

    if (existingProduct) {
      // TODO 4.1 if it is in the cart
      const oldQuantity = existingProduct.cartItem.quantity;
      newQty = oldQuantity + 1;
    }
    // TODO 4.2) if it not add it into the cart and give the quantity to 1
    const result = await cart.addProduct(product, {
      through: { quantity: newQty },
    });

    res.redirect('/cart');
  } catch (err) {
    console.error(err);
  }
};

const postDeleteItemFromCart = async (req, res, next) => {
  // TODO 1) Get product id from body
  const { productId } = req.body;

  // TODO 2) Get current user cart
  const cart = await req.user.getCart();
  if (!cart) return;

  // TODO 3) Query the cart to get the item match the deleting item by id
  const [deletingItem, ..._] = await cart.getProducts({
    where: { id: productId },
  });
  if (!deletingItem) return;

  // TODO 4) Delete item from the junction table (cartItem table)
  await deletingItem.cartItem.destroy();
  res.redirect('/cart');
};

const getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      prods: products,
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
