const express = require('express');
const router = express.Router();
const User = require('../models/User');


/**
 * @api {get} /api/v1/review 審查填寫資料
 * @apiName GetAllForms
 * @apiGroup Form
 * @apiSuccess {Object[]} users 返回所有用戶資料
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.get('', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @api {get} /api/v1/review/:id 審查填寫資料 detail
 * @apiName GetFormById
 * @apiGroup Form
 * @apiParam {Number} id 用戶 ID
 * @apiSuccess {Object} user 用戶資料
 * @apiError (404) NotFound 用戶未找到
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;
