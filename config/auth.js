const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 格式為 Bearer <token>

    console.log(token);
    if (token == null) return res.status(401).send({ message: 'Token is required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
