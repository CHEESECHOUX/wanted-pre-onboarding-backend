const express = require("express");
const app = express();
const port = 3000;

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const MysqlConfig = require("./src/config/mysql-config");

const mysql = require("mysql");
const connection = mysql.createConnection(MysqlConfig);

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
  }
  if (!err) {
    console.log("MySQL 연결 성공");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 에러 처리
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// 예외 필터
app.use((req, res, next) => {
  try {
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// CORS를 지정된 옵션으로 활성화
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin.join(", "));
  res.header("Access-Control-Allow-Methods", corsOptions.methods.join(", "));
  res.header(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(", ")
  );
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
