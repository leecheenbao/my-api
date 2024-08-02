// 引用所需的套件
const moment = require('moment-timezone');

// 設置時區
const timezone = 'Asia/Taipei';                                 // GMT+8 的時區名稱

// 目前時間
const now = moment().tz(timezone).format();

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // 確保將其設置為一個安全的密鑰
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';      // Token 有效期

module.exports = {
    timezone,
    now,
    JWT_SECRET,
    JWT_EXPIRES_IN
};
