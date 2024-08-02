const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN, now } = require('../config/common');
const authenticateToken = require('../config/auth');

/**
 * @api {post} /api/v1/admin/register 註冊
 * @apiName Register
 * @apiGroup Admin
 * @apiParam {String} username 用戶名
 * @apiParam {String} password 密碼
 * @apiParam {String} email 電子郵件
 * @apiSuccess {String} message 註冊成功消息
 * @apiError (400) BadRequest 請求參數錯誤
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).send({ message: 'Username, password, and email are required' });
    }

    try {
        // 檢查用戶名是否已經存在
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send({ message: 'Username already exists' });
        }

        // 檢查電子郵件是否已經存在
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(now);
        // 創建新用戶
        const newUser = await User.create({
            username,
            passwordHash: hashedPassword,
            email,
            createdAt: now
        });

        res.status(201).send({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * @api {post} /api/v1/admin/login 管理員登入
 * @apiName AdminLogin
 * @apiGroup Admin
 * @apiParam {String} username 管理員用戶名
 * @apiParam {String} password 管理員密碼
 * @apiSuccess {String} token JWT token
 * @apiSuccess {String} message 登入成功消息
 * @apiError (400) BadRequest 用戶名或密碼錯誤
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    try {
        // 查找用戶
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        // 比較密碼
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        // 生成 JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } // Token 有效期設為從環境變數中讀取的值
        );

        // 更新最後登入時間
        await user.update({ lastLogin: now });

        // 登入成功
        res.status(200).send({ token, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * @api {get} /api/v1/admin/users 檢視用戶列表
 * @apiName GetUsers
 * @apiGroup Admin
 * @apiSuccess {Object[]} users 用戶列表
 * @apiSuccess {Number} users.id 用戶ID
 * @apiSuccess {String} users.username 用戶名
 * @apiSuccess {String} users.email 電子郵件
 * @apiSuccess {Date} users.createdAt 創建日期
 * @apiSuccess {Date} users.updatedAt 最後更新日期
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['passwordHash'] } // 排除 passwordHash 欄位
        });
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * @api {get} /api/v1/admin/users/:id 檢視用戶詳細資料
 * @apiName GetUserById
 * @apiGroup Admin
 * @apiParam {Number} id 用戶ID
 * @apiSuccess {Number} id 用戶ID
 * @apiSuccess {String} username 用戶名
 * @apiSuccess {String} email 電子郵件
 * @apiSuccess {Date} createdAt 創建日期
 * @apiSuccess {Date} updatedAt 最後更新日期
 * @apiError (404) NotFound 用戶不存在
 * @apiError (500) InternalServerError 伺服器錯誤
 */
router.get('/users/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['passwordHash'] } // 排除 passwordHash 欄位
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
