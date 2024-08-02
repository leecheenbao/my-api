const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
require('dotenv').config();
const port = process.env.MAIN_NODE_PORT;

// 中介軟體
app.use(bodyParser.json());

// 請求記錄中介軟體
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// Multer 設定
const upload = multer({ storage: multer.memoryStorage() });

// POST 填寫表單
app.post('/form', async (req, res) => {
    try {
        const data = req.body; // 收到的資料應該是 {"test001": 1, "test002": 2}
        const form = await User.create(data);
        res.status(201).send({ id: form.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET 審查填寫資料
app.get('/review', async (req, res) => {
    try {
        const Users = await User.findAll();
        res.status(200).send(Users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET 審查填寫資料 detail
app.get('/review/:id', async (req, res) => {
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


// POST 後台編輯表單
app.post('/edit/:id', async (req, res) => {
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

// POST 上傳圖片
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const blob = bucket.file(Date.now() + '_' + req.file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', err => res.status(500).send(err.message));
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            res.status(200).send({ url: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST 管理員登入
app.post('/admin/login', async (req, res) => {
    // 這裡需要添加你自己的管理員登入邏輯，例如驗證帳號和密碼
    // 這裡僅作範例返回成功
    res.status(200).send({ message: 'Login successful' });
});



// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
