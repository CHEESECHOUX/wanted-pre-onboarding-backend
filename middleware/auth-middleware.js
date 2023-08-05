const jwt = require('jsonwebtoken');
const ConflictException = require('../exceptions/conflict-exception');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ConflictException('토큰이 없습니다.');
        }

        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = decodedToken.userId; // token에서 추출한 userId를 req.userId에 저장

        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'ConflictException') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(401).json({ error: '인증에 실패하였습니다.' });
        }
    }
};

module.exports = authMiddleware;
