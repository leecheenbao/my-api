const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.MAIN_NODE_PORT;

// 中介軟體
app.use(bodyParser.json());
app.use(cors());

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
const category_api = require('./routes_api/03-01_categories');
const product_api = require('./routes_api/03-02_products');

app.use('/api/v1/review', routes_api);
app.use('/api/v1/admin', admin_api);
app.use('/api/v1/form', form_api);
app.use('/api/v1/category', category_api);
app.use('/api/v1/product', product_api);

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
