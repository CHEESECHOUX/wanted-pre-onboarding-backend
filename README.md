# 원티드 프리온보딩 백엔드 인턴십 - 선발 과제

지원자 : 최지수
<br/>
- Language & Framework : JavaScript ES6, Express(Node.js v18.16.1)<br/>
- Database : MySQL(v8.0.33), sequelize<br/>
<br/>
<br/>

# ⚙️ 1. 애플리케이션의 실행 방법
<a id="⚙️-애플리케이션의-실행-방법"></a>
### 1. Project Clone
<details>
<summary>.env 파일</summary>
<div markdown="1">
  
-   .env
  
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_PASSWORD=MySQL비밀번호
DB_NAME=MySQL데이터베이스이름
DB_USERNAME=MySQL사용자이름

JWT_SECRET_KEY=MYSECRETKEY
JWT_EXP=1h
```

<br/>
</div>
</details>

```
git clone https://github.com/CHEESECHOUX/wanted-pre-onboarding-backend.git
```

### 2. Project Setup<br/>

#### 2-1. Docker로 Project Setup
Docker Compose 명령어
```
docker-compose up -d
```

<details>
<summary>Docker 이미지 빌드 & 해당 이미지로 컨테이너 실행 명령어</summary>
<div markdown="2">

```
docker build . -t wanted-jisoo-choi
```
```
docker container run -d -p 3000:3000 --env-file ./.env wanted-jisoo-choi
```
<br/>
</div>
</details>

```
npm install
```

<details>
<summary>설치한 패키지 목록</summary>
<div markdown="2">

1. express<br/>
$ npm install express

2. prettier<br/>
$ npm install --save-dev prettier
  
3. mysql<br/>
$ npm install mysql

4. sequelize<br/>
$ npm install sequelize<br/>
$ npm install mysql2<br/>
$ npm install -g sequelize-cli<br/>

5. config(.env)<br/>
$ npm install dotenv

6. bcrypt 비밀번호 암호화<br/>
$ npm install bcrypt

7. JWT<br/>
$ npm install jsonwebtoken

7. Express에서 request body 파싱<br/>
$ npm install body-parser

<br/>
</div>
</details>
<br/>

#### 2-2. Node.js로 로컬 환경에서 Project Setup

```
npm install
```

```
npm start
```
<br/>

# 🛎 2. 엔드포인트 호출 방법

## User
**과제 1. 사용자 회원가입**<br/>
```
POST /signup
      -d '{ "email": "test@test.com", "password": "testpassword" }
```

- 이메일 조건: @ 포함<br/>
- 비밀번호 조건: 8자 이상<br/>
- 이메일은 고유한 값(중복 불가능)
<br/>

**과제 2. 사용자 로그인**
```
POST /signup
      -d '{ "email": "test@test.com", "password": "testpassword" }
```
- 이메일 조건: @ 포함<br/>
- 비밀번호 조건: 8자 이상<br/>
- 로그인 시 JWT 토큰 사용자에게 반환
<br/>

## POST
**과제 3. 새로운 게시글 생성**<br/>
```
POST /post
    -H "Authorization: Bearer ${token}"" 
    -d '{ "title": "게시글 제목", "content": "게시글 내용" }
```
- 게시글을 작성하려면 로그인시 반환된 JWT토큰이 필요합니다.
- 제목, 내용 모두 입력 시 게시글 생성 가능
- 제목은 고유한 값(중복 불가능)
<br/>

**과제 4. 게시글 목록 조회(Pagenation)** <br/>

1. **전체 페이지**에서 업데이트 최신순 게시글 10개 조회
```
GET /post
```
2. **사용자가 지정한 페이지**의 업데이트 최신순 게시글 10개 조회
```
GET /post?page=1
```
<br/>

**과제 5. 특정 게시글 조회**<br/>
```
GET /api/v1/post/:postId
```
- 게시글 ID로 특정 게시글 조회
<br/>

**과제 6. 특정 게시글 수정**<br/>
```
PATCH /post/:id
    -H "Authorization: Bearer ${token}" 
    -d '{ "title": "게시글 제목 수정", "content": "게시글 내용 수정" }
```
- 게시글을 수정하려면 로그인시 반환된 JWT토큰이 필요합니다.
  - 해당 게시글 작성자만 게시글을 수정할 수 있습니다.
<br/>

**과제 7. 특정 게시글 삭제**<br/>
```
DELETE /post/:postId
      -H "Authorization: Bearer ${token}" 
```
- 게시글을 삭제하려면 로그인시 반환된 JWT토큰이 필요합니다.
  - 해당 게시글 작성자만 게시글을 삭제할 수 있습니다.
<br/>

# 🛠 3. 데이터베이스 테이블 구조
![원티드 프리온보딩](https://github.com/CHEESECHOUX/wanted-pre-onboarding-backend/assets/89918678/6f229643-c0f5-4894-899c-4a3affa1c45e)
<br/>
<br/>

## 🔗 테이블 관계
### User와 Post 테이블은 일대다 관계<br/>
- 게시판은 다수의 게시글을 갖고 있고, 각 게시글은 하나의 사용자에 의해 작성됩니다.<br/>
- 과제의 API 요구 사항에 맞게 테이블을 최소화하여 만들었습니다.<br/>
<br/>

## 🔗 관계형 데이터베이스(MySQL)를 선택한 이유
### 1. 정형화된 데이터와 스키마<br/>
관계형 데이터베이스는 테이블로 구성되며, 각 테이블은 정해진 스키마에 따라 구조화된 데이터를 저장합니다.<br/>
**게시판 과제와 같이 게시글, 사용자 등 특정 속성이 있는 경우, 데이터의 일관성을 유지하고 테이블 간의 관계를 명확하게 정의**하여 코드 수정과 기능 추가를 간편하게 수행할 수 있기 때문에 사용하였습니다. 이를 통해 **데이터 관리와 검색이 용이**해지며, **애플리케이션의 유지보수와 확장**이 더욱 편리해집니다.
 
### 2. 데이터 중복 최소화<br/>
관계형 데이터베이스는 정규화를 통해 데이터 중복을 최소화합니다. 이로 인해 **저장 공간을 절약**할 수 있습니다.

### 3. 데이터 무결성 보장<br/>
**제약 조건을 설정해 데이터 무결성을 보장**합니다. **이메일 컬럼에 Unique 제약 조건을 설정**해 중복 데이터가 입력되는 것을 방지했습니다.
<br/>

### 4. 비 관계형 데이터베이스를 선택하지 않은 이유
비 관계형 데이터베이스(NoSQL)는 빠르게 변하는 대량의 데이터를 다루는 데 강점이 있고, 비구조화 또는 반구조화된 데이터를 다루거나 스키마를 유연하게 변경해야 하는 경우 자주 사용되기 때문에, 관계형 데이터베이스 중에 가장 널리 사용되고 있는 MySQL을 선택했습니다.
<br/>
<br/>
<br/>

# 👩🏻‍💻 4. 구현 방법 및 이유
### [구현한 API의 동작을 촬영한 데모 영상 링크](https://drive.google.com/file/d/1JXqavXWHLiE3aONElVUuZeIJeZZr0s5m/view?usp=drive_link)
<br/>

## 1. MVC (Model-View-Controller) 패턴으로 코드 작성
- **모델(Model), 라우트(Route), 컨트롤러(Controller)로 구분하여 작성**했습니다.

- **단일 책임 원칙 준수** : MVC 패턴으로 코드를 작성하게 되면, **각 모듈은 특정한 책임을 가지며 역할이 분명하게 구분**됩니다. 데이터베이스와의 상호작용은 models에서, HTTP 요청과 응답은 controller에서, 비즈니스 로직은 service에서 다루게 됩니다.
  
- **재사용성과 확장성 증가** : 각각의 기능을 독립적인 모듈로 분리하면 해당 기능을 다른 프로젝트나 다른 부분에서 재사용하기 쉬워지고, 서비스가 확장될 경우에도 코드의 유지보수와 디버깅에 더 편리합니다.
<br/>

## 2. bcypt를 활용해 비밀번호 암호화
- bcypt는 **일방향 함수**이므로, 암호화된 비밀번호를 복호화할 수 없습니다.
- 저장된 **비밀번호가 유출되어도 원래 비밀번호를 알아낼 수 없기 때문에 사용**했습니다.
<br/>

## 3. JWT(Jason Web Token)

JWT를 선택한 이유는 토큰 기반의 인증 방식으로, 서버에 사용자의 세션 정보를 저장할 필요가 없어 **간편하게 인증이 가능**하고, 클라이언트 측에 토큰이 저장되기 때문에 서버의 부담이 줄어들어 **확장성과 분산 시스템 지원에 용이**합니다.

토큰 자체에 정보를 포함하므로 토큰의 크기가 커질 수 있고, 토큰이 유출될 경우 보안 취약점이 발생할 수 있지만, 이러한 문제를 최소화하기 위해 **토큰에는 필수적인 사용자 정보인 ID정보만을 담고 있으며, 유효 시간을 한 시간으로 제한**하여 보안을 강화하였습니다.

또한, **auth-Middleware를 사용**해 **인증된 사용자에게만 특정 라우터에 접근 권한을 부여**하여 보다 안전한 서비스를 제공하도록 구현하였습니다.
<br/>
<br/>
<br/>

## 4. 게시글 목록 조회 시 Pagnation 기능

**1. 전체 게시글 중 업데이트 최신순으로 게시글 10개 조회**<br/>

- 웹사이트에서는 일반적으로 최신순으로 데이터를 보여주는 방법을 사용합니다.
- **사용자들이 가장 최신 정보에 접근하고 다른 사용자들과 실시간으로 상호작용하는 것이 중요하기 때문**입니다.
- **updateAt 필드를 기준으로 내림차순으로 게시글을 조회**하는 코드를 작성했습니다.
<br/>

**2. 사용자가 지정한 페이지에서 업데이트 최신순으로 게시글 10개 조회**<br/>

- 사용자는 원하는 페이지 번호를 요청해 **현재 페이지 번호, 총 페이지 수, 요청된 페이지의 게시물 10개**를 조회할 수 있습니다.
- **페이지 번호가 1보다 작거나, 전체 페이지 수보다 클 경우 에러가 발생**합니다.
<br/>

## 5. 사용자, 게시글 모두 소프트 삭제(soft Delete) 처리

**소프트 삭제는 데이터를 완전히 삭제하는 것이 아니라, 해당 데이터의 레코드에 삭제된 상태를 표시**하는 방법입니다.<br/>
사용자나 게시글을 삭제 처리할 경우 **deletedAt 열에 삭제 시점의 타임스탬프가 기록**됩니다.

- **데이터 복구에 용이** : 소프트 삭제를 사용하면 데이터를 완전히 삭제하기 전에 실수로 삭제된 데이터를 복구할 수 있습니다. 잘 못 삭제된 데이터를 복구할 수 있으면 중요한 정보를 잃지 않고 비즈니스 활동을 지원하는 데 도움이 됩니다.

- **오류와 버그 처리** : 데이터를 완전히 삭제하면 해당 데이터가 연결된 다른 데이터와의 관계를 끊을 수 있습니다. 이로 인해 시스템 오류가 발생하거나 버그가 발생할 수 있는데, 소프트 삭제 시 데이터의 논리적인 관계를 유지하여 이러한 문제를 방지할 수 있습니다.
<br/>

소프트 삭제를 선택한 이유는 과제에 민감한 데이터(ex : 결제 시 생성되는 사용자의 신용카드 정보 등)가 없으며, 작은 규모의 과제이기 때문에 성능 저하의 우려가 적었습니다. 소프트 삭제를 통해 실수로 인한 데이터 손실을 방지하고 데이터의 논리적인 관계를 유지할 수 있게 되었습니다.
<br/>
<br/>
<br/>

# 📡 5. API 명세
### [API Documentation 링크](https://documenter.getpostman.com/view/20782433/2s9XxyRYjz)

|기능|EndPoint|메소드|
|:---|:---|:---:|
|회원가입|/signup|POST|
|로그인|/login|POST|
|새로운 게시글 생성|/post|POST|
|전체 게시글 중, 업데이트 최신순 게시글(10개) 목록 조회|/post|GET|
|사용자가 지정한 페이지, 업데이트 최신순 게시글(10개) 목록 조회|/post?/page=1|GET|
|특정 게시글(ID) 조회|/post/:postId|GET|
|특정 게시글(ID) 수정|/post/:postId|PATCH|
|특정 게시글(ID) 삭제|/post/:postId|DELETE|
<br/>
<br/>



