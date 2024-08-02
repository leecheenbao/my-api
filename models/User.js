const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Form = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users'
});

module.exports = Form;
