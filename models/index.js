const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');

// 定义关联
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'productImages' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
    Category,
    Product,
    ProductImage,
    sequelize
};
