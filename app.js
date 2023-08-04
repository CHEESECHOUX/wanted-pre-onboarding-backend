const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./src/routes/auth');

const app = express();
const port = 3000;
const sequelize = require('./src/config/db-config');

const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

sequelize
    .authenticate()
    .then(() => {
        console.log('MySQL 연결 성공');
    })
    .catch(err => {
        console.error('MySQL 연결 실패:', err);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(authRouter);

// 에러 처리
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// 예외 필터
app.use((req, res, next) => {
    try {
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// CORS를 지정된 옵션으로 활성화
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin.join(', '));
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
    next();
});

// HTTP 로깅 인터셉터
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
