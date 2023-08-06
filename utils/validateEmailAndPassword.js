const ValidationError = require('../exceptions/validation-error');

const validateEmailAndPassword = (email, password) => {
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
};

module.exports = validateEmailAndPassword;
