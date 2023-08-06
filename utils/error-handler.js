const handleControllerError = (error, res) => {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || '서버 오류입니다.';
    res.status(status).json({ error: message });
};

module.exports = handleControllerError;
