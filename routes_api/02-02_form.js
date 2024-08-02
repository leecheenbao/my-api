const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @api {post} /api/v1/form 填寫表單
 * @apiName CreateForm
 * @apiGroup Form
 * @apiParam {Object} data 表單資料，格式為 {"test001": 1, "test002": 2}
 * @apiSuccess {Number} id 表單 ID
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('', async (req, res) => {
    try {
        const data = req.body; // 收到的資料應該是 {"test001": 1, "test002": 2}
        const form = await User.create(data);
        res.status(201).send({ id: form.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {post} /api/v1/form/:id 後台編輯表單
 * @apiName EditForm
 * @apiGroup Form
 * @apiParam {Number} id 用戶 ID
 * @apiParam {Object} data 更新的表單資料
 * @apiSuccess {String} message 更新成功消息
 * @apiError (404) NotFound 用戶未找到
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        await user.update(req.body);
        res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
