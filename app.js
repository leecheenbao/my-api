const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.MAIN_NODE_PORT;

// 中介軟體
app.use(bodyParser.json());

// 請求記錄中介軟體
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// 路由
const admin_api = require('./routes_api/01-01_admin');
const routes_api = require('./routes_api/02-01_review');
const form_api = require('./routes_api/02-02_form');

app.use('/api/v1/review', routes_api);
app.use('/api/v1/admin', admin_api);
app.use('/api/v1/form', form_api);

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
