const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictException = require('../exceptions/conflict-exception');
const handleControllerError = require('../utils/error-handler');
const validateEmailAndPassword = require('../utils/validateEmailAndPassword');

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 이메일과 비밀번호 유효성 검사
        validateEmailAndPassword(email, password);

        // 비밀번호 암호화
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser && existingUser.email === email) {
            throw new ConflictException('이미 존재하는 이메일입니다');
        }

        // 사용자 생성
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json(user);
    } catch (error) {
        // 중앙 에러 처리 함수를 사용하여 예외 처리
        handleControllerError(error, res);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 이메일과 비밀번호 유효성 검사
        validateEmailAndPassword(email, password);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        // JWT 토큰 생성 및 반환
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const JWT_EXP = process.env.JWT_EXP;

        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: JWT_EXP });

        res.status(200).json({ user, token });
    } catch (error) {
        handleControllerError(error, res);
    }
};
