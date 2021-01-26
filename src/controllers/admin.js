const Product = require('../models/product');
const Cart = require('../models/cart');

const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin | Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const postAddProduct = async (req, res, next) => {
  try {
    const { title, imageUrl, price, description } = req.body;
    console.log(title, imageUrl, price, description);
    const result = await Product.create({
      title,
      price,
      imageUrl,
      description,
    });
    console.log(result);
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
  }
};

const getAdminEditProduct = async (req, res, next) => {
  const { edit: editMode } = req.query;
  if (!editMode) {
    res.redirect('/');
    throw new Error('No edit mode defined');
  }
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);
    res.render('admin/edit-product', {
      pageTitle: 'Admin | Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  } catch (err) {
    console.error(err);
  }
};

const postEditProduct = async (req, res, next) => {
  const { productId: id, title, price, imageUrl, description } = req.body;
  if (!id || !title || !price | !imageUrl || !description) {
    throw new Error('Data is missing');
  }
  try {
    const updatedProduct = await Product.update(
      { title, price, imageUrl, description },
      { returning: true, where: { id: id } }
    );
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
  }
};

const postDeleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    throw new Error('Unable to find the product related to that id');
  }
  try {
    const result = await Product.destroy({
      returning: true,
      where: { id: productId },
    });
    res.redirect('/admin/products');
  } catch (err) {
    console.error(err);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin | Products',
      path: '/admin/admin-products',
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getAdminEditProduct,
  postEditProduct,
  postDeleteProduct,
};
