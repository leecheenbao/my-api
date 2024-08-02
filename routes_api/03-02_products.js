const express = require('express');
const router = express.Router();
const { Product, Category, ProductImage } = require('../models'); // 假設你已經定義了這些 Sequelize 模型
const authenticateToken = require('../config/auth'); // 使用前面定義的中間件

/**
 * @api {post} /api/v1/product 新增商品
 * @apiName AddProduct
 * @apiGroup Product
 * @apiParam {String} name 商品名稱
 * @apiParam {String} description 商品描述
 * @apiParam {Number} price 商品價格
 * @apiParam {Number} categoryId 分類ID
 * @apiSuccess {String} message 商品新增成功消息
 * @apiSuccess {Object} product 新增的商品信息
 * @apiError (400) BadRequest 請求參數錯誤
 * @apiError (400) CategoryNotFound 找不到指定的分類
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('/', authenticateToken, async (req, res) => {
    const { name, description, price, categoryId } = req.body;

    if (!name || !description || !price || !categoryId) {
        return res.status(400).send({ message: 'Name, description, price, and categoryId are required' });
    }

    try {
        // 檢查分類是否存在
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).send({ message: 'Category not found' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            categoryId,
            stock
        });

        res.status(201).send({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


/**
 * @api {put} /api/v1/product/:id 修改商品資訊
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiParam {Number} id 商品ID
 * @apiParam {String} [name] 商品名稱
 * @apiParam {String} [description] 商品描述
 * @apiParam {Number} [price] 商品價格
 * @apiParam {Number} [categoryId] 分類ID
 * @apiSuccess {String} message 商品修改成功消息
 * @apiError (400) BadRequest 請求參數錯誤
 * @apiError (404) NotFound 商品不存在
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // 僅更新請求中提供的字段
        const updatedProduct = await product.update({
            name: name || product.name,
            description: description || product.description,
            price: price || product.price,
            stock: stock || product.stock,
            categoryId: categoryId || product.categoryId
        });

        res.status(200).send({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


/**
 * @api {get} /api/v1/product 獲取商品列表
 * @apiName GetProducts
 * @apiGroup Product
 * @apiSuccess {Object[]} products 商品列表
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, as: 'category' },  
                { model: ProductImage, as: 'productImages' } 
            ]
        });
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * @api {get} /api/v1/product/:id 獲取單一商品詳細資訊
 * @apiName GetProductById
 * @apiGroup Product
 * @apiParam {Number} id 商品ID
 * @apiSuccess {Object} product 商品詳細資訊
 * @apiError (404) NotFound 商品不存在
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'category' },  
                { model: ProductImage, as: 'productImages' } 
            ]
        });

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.status(200).send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * @api {post} /api/v1/product/:id/images 新增商品圖片
 * @apiName AddProductImage
 * @apiGroup Product
 * @apiParam {Number} id 商品ID
 * @apiParam {String} imageUrl 圖片網址
 * @apiSuccess {String} message 圖片新增成功消息
 * @apiError (400) BadRequest 請求參數錯誤
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('/:id/images', authenticateToken, async (req, res) => {
    const { imageUrl } = req.body;
    const productId = req.params.id;

    if (!imageUrl) {
        return res.status(400).send({ message: 'Image URL is required' });
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        await ProductImage.create({
            productId,
            imageUrl
        });

        res.status(201).send({ message: 'Image added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
