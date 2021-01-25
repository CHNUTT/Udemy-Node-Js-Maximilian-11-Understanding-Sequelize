const fs = require('fs');
const { parse } = require('path');
const path = require('path');
const { isContext } = require('vm');
const rootDir = require('../util/path');
const Product = require('./product');

const cartDataPath = path.join(rootDir, 'data', 'cart.json');

const getProductsFromCart = (callback) => {
  fs.readFile(cartDataPath, (err, data) => {
    if (err) {
      callback({ products: [], totalPrice: 0 });
    } else {
      callback(JSON.parse(data));
    }
  });
};

/**
 *
 * @param {Number} productId
 * @returns {Object}
 */
const findIndexInCart = (productId, callback) => {
  getProductsFromCart((cart) => {
    if (cart.products.length === 0) {
      callback({ cart, index: undefined });
    } else {
      const index = cart.products.findIndex(
        (product) => product.id === productId
      );
      callback({ cart, index });
    }
  });
};

const saveToFile = (cart) => {
  fs.writeFile(cartDataPath, JSON.stringify(cart), (err) => {
    console.error(err);
  });
};

module.exports = class Cart {
  /**
   * @function addProduct async
   * Function: Add product to cart
   * 1. Fetch the previous cart
   * 2. Analyze the cart => Find existing product
   * 3. Add new product/ increase quantity
   * 4. write file
   * @param {number} productId id of the product user adding into cart
   * @param {string} productPrice price of the product user adding into cart
   * @author NUTT CHOKWITTAYA
   */
  static addProduct(productId, productPrice) {
    // TODO Fetch the previous cart
    findIndexInCart(productId, ({ cart, index: existingProductIndex }) => {
      // TODO Analyze the cart => Find existing product
      const existingProduct = cart.products[existingProductIndex];
      let updateProduct;
      // TODO Add new product/ increase quantity
      if (existingProduct) {
        updateProduct = { ...existingProduct };
        updateProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updateProduct;
      } else {
        updateProduct = { id: productId, qty: 1 };
        cart.products = [...cart.products, updateProduct];
      }
      cart.totalPrice += +productPrice;
      cart.totalPrice = Number(cart.totalPrice.toFixed(2));
      // TODO Save to file
      saveToFile(cart);
    });
  }

  static removeProduct(productId, productPrice) {
    findIndexInCart(productId, ({ cart, index: deletingProductIndex }) => {
      if (!cart.products.length || deletingProductIndex < 0) return;
      const [{ qty }] = cart.products.splice(deletingProductIndex, 1);
      cart.totalPrice = Number(
        (cart.totalPrice - qty * productPrice).toFixed(2)
      );
      saveToFile(cart);
    });
  }

  static getCart(cb) {
    getProductsFromCart(cb);
  }

  static deleteItemFromCart() {}
};
