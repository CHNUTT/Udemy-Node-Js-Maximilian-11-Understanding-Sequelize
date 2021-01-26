const express = require('express');
const bodyParser = require('body-parser');
const { join } = require('path');
const rootDir = require('./util/path');

// Load routes
const adminRoutes = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');
const errorControllers = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

// view engine

// Ejs ****
app.set('view engine', 'ejs');
app.set('views', join(rootDir, 'views'));

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(rootDir, 'public')));

// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorControllers.get404);

const init = async () => {
  try {
    const result = await sequelize.sync();
    // console.log(result);
    app.listen(3000, () => {
      console.log(`Server is listening on port 3000`);
    });
  } catch (err) {
    console.error(err);
  }
};

init();
