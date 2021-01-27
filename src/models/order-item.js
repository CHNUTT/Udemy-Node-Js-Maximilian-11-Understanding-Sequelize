const { INTEGER } = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: INTEGER,
    allowNull: false,
  },
});

module.exports = OrderItem;
