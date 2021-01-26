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
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
};

const getAdminEditProduct = (req, res, next) => {
  const { edit: editMode } = req.query;
  if (!editMode) return res.redirect('/');
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    if (!product) return res.redirect('/');

    res.render('admin/edit-product', {
      pageTitle: 'Admin | Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const {
    productId,
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDescription,
  } = req.body;
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.deleteProduct(productId);
  res.redirect('/admin/products');
};

const getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin | Products',
      path: '/admin/admin-products',
    });
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  getAdminEditProduct,
  postEditProduct,
  postDeleteProduct,
};
