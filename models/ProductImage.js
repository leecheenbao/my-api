const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'product_images',
    timestamps: false
});

module.exports = ProductImage;
