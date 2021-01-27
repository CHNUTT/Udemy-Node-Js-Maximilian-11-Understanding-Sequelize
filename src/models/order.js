const { INTEGER, DOUBLE } = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  price: {
    type: DOUBLE,
    defaultValue: 0,
  },
});

module.exports = Order;
