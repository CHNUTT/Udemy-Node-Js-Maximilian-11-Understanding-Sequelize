const express = require('express');
const bodyParser = require('body-parser');
const { join } = require('path');
const rootDir = require('./util/path');

// Load routes
const adminRoutes = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');
const errorControllers = require('./controllers/error');

// Load Database
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

// view engine

// Ejs ****
app.set('view engine', 'ejs');
app.set('views', join(rootDir, 'views'));

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(rootDir, 'public')));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
  }
});

// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.get404);

const init = async () => {
  try {
    // ? Create relationship user 1->n products
    Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
    User.hasMany(Product);

    // ? Create realtionship cart 1->1 user
    // p.s.: if user is deleted cart will be deleted
    Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

    // ? Create relationship user has one cart
    User.hasOne(Cart);

    // ? Create relationship
    Cart.belongsToMany(Product, { through: CartItem });
    Product.belongsToMany(Cart, { through: CartItem });

    // const result = await sequelize.sync({ force: true });
    const result = await sequelize.sync();
    if (!result) throw new Error('Error on sequelize');

    const user =
      (await User.findByPk(1)) ||
      (await User.create({ name: 'Cheer', email: '1@1.com' }));

    // console.log(user);

    app.listen(3000, () => {
      console.log(`--------------------------------`);
      console.log(`Server is listening on port 3000`);
    });
  } catch (err) {
    console.error(err);
  }
};

init();
