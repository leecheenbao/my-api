const express = require('express');
const router = express.Router();
const { Category } = require('../models'); 
const authenticateToken = require('../config/auth'); // 使用前面定義的中間件

/**
 * @api {post} /api/v1/category 新增分類
 * @apiName AddCategory
 * @apiGroup Category
 * @apiParam {String} name 分類名稱
 * @apiSuccess {String} message 分類新增成功消息
 * @apiError (400) BadRequest 請求參數錯誤
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('/', authenticateToken, async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).send({ message: 'Name is required' });
    }

    try {
        const category = await Category.create({ name, description });

        res.status(201).send({ message: 'Category added successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * @api {put} /api/v1/category/:id 編輯分類
 * @apiName EditCategory
 * @apiGroup Category
 * @apiParam {Number} id 分類ID
 * @apiParam {String} name 分類名稱
 * @apiParam {String} description 分類描述
 * @apiSuccess {String} message 分類更新成功消息
 * @apiError (400) BadRequest 請求參數錯誤
 * @apiError (404) NotFound 分類不存在
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }

        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();

        res.status(200).send({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
