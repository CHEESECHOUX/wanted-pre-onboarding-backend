const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictException = require('../exceptions/conflict-exception');
const ValidationError = require('../exceptions/validation-error');

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 이메일과 비밀번호 유효성 검사
        if (!email || !password) {
            throw new ValidationError('이메일과 비밀번호를 입력해주세요.');
        }

        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_REGEX.test(email)) {
            throw new ValidationError('올바른 이메일 형식이 아닙니다. (@가 포함되어야 합니다)');
        }

        const MIN_PASSWORD_LENGTH = 8;
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new ValidationError('비밀번호는 8자 이상이어야 합니다.');
        }

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
        console.error(error);

        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else if (error.name === 'ConflictException') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 이메일과 비밀번호 유효성 검사
        if (!email || !password) {
            throw new ValidationError('이메일과 비밀번호를 입력해주세요.');
        }
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_REGEX.test(email)) {
            throw new ValidationError('올바른 이메일 형식이 아닙니다.');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('해당 이메일의 사용자를 찾을 수 없습니다.');
        }

        const MIN_PASSWORD_LENGTH = 8;

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new ValidationError('비밀번호는 8자 이상이어야 합니다.');
        } else if (!isPasswordMatch) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const JWT_EXP = process.env.JWT_EXP;

        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: JWT_EXP });

        res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);

        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
