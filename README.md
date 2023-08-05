# 원티드 프리온보딩 백엔드 인턴십 - 선발 과제

지원자 : 최지수
<br/>
<br/>

# ⚙️ 애플리케이션의 실행 방법
**1. Project Clone**
<details>
<summary>.env 파일</summary>
<div markdown="1">
  
-   .env
  
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_PASSWORD=MySQL비밀번호
DB_NAME=MySQL데이터베이스이름
DB_USERNAME=

JWT_SECRET_KEY=MYSECRETKEY
JWT_EXP=1h
```

<br/>
</div>
</details>

```
git clone https://github.com/CHEESECHOUX/wanted-pre-onboarding-backend.git
```

**2. Project Setup**<br/>

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
  
1. mysql<br/>
$ npm install mysql

2. sequelize<br/>
$ npm install sequelize
$ npm install mysql2
$ npm install -g sequelize-cli

3. prettier<br/>
$ npm install --save-dev prettier

4. config<br/>
$ npm install dotenv

5. 비밀번호 암호화<br/>
$ npm install bcrypt

6. JWT<br/>
$ npm install jsonwebtoken

7. Express에서 request body 파싱<br/>
$ npm install body-parser

<br/>
</div>
</details>
<br/>

# 🛠 데이터베이스 테이블 구조
![원티드 프리온보딩](https://github.com/CHEESECHOUX/wanted-pre-onboarding-backend/assets/89918678/6f229643-c0f5-4894-899c-4a3affa1c45e)

- User와 Post 테이블은 일대다 관계입니다. 이 프로젝트의 모든 데이터는 soft Delete로 처리했습니다.
<br/>
<br/>

# 👩🏻‍💻 구현 방법 및 이유
### [구현한 API의 동작을 촬영한 데모 영상 링크]()

## User
**1. 사용자 회원가입**<br/>

- 이메일과 비밀번호에 대한 유효성 검사
      - 이메일 조건: @ 포함
      - 비밀번호 조건: 8자 이상
     
    - bcypt를 이용해 비밀번호 암호화

-   **2. 사용자 로그인**
    - 로그인 시 JWT 토큰 사용자에게 반환
<br/>

## POST
**1. 새로운 게시글 생성**<br/>

- 제목, 내용 모두 입력 시 게시글 생성
- 동일한 제목의 게시글 생성 불가

**2. 게시글 목록 조회**<br/>

사용자가 게시글 목록 조회 시 얻을 수 있는 정보
1. 현재 페이지 번호
2. 전체 페이지 수
3. 요청한 페이지의 게시글 목록 (Pagenation)
    - 게시글은 updatedAt 필드를 기준으로 내림차순으로 정렬
    - 전체 페이지에서 업데이트 최신순 게시글 10개 조회
    - 사용자가 지정한 페이지의 업데이트 최신순 게시글 10개 조회 

**3. 특정 게시글 조회**<br/>
- 게시글 ID로 특정 게시글 조회

**4. 특정 게시글 수정**<br/>
- 게시글 ID와 수정 내용으로 해당 게시글 수정
    
- 작성자만 해당 게시글 수정

**5. 특정 게시글 삭제**<br/>
- 게시글 ID로 특정 게시글 삭제
- 작성자만 해당 게시글 삭제
<br/>


## 1. MVC (Model-View-Controller) 패턴으로 코드 작성
- **모델(Model), 라우트(Route), 컨트롤러(Controller)로 구분하여 작성**했습니다.

- **단일 책임 원칙 준수** : MVC 패턴으로 코드를 작성하게 되면, 각 모듈은 특정한 책임을 가지며 역할이 분명하게 구분됩니다. 데이터베이스와의 상호작용은 models에서, HTTP 요청과 응답은 controller에서, 비즈니스 로직은 service에서 다루게 됩니다.
  
- **재사용성과 확장성 증가** : 각각의 기능을 독립적인 모듈로 분리하면 해당 기능을 다른 프로젝트나 다른 부분에서 재사용하기 쉬워지고, 서비스가 확장될 경우에도 코드의 유지보수와 디버깅에 더 편리합니다.
<br/>

## 2. bcypt를 활용해 비밀번호 암호화
- bcypt는 **일방향 함수**이므로, 암호화된 비밀번호를 복호화할 수 없습니다.
- 저장된 **비밀번호가 유출되어도 원래 비밀번호를 알아낼 수 없기 때문에 사용**했습니다.
<br/>

## 3. 게시글 목록 조회시 Pagnation 기능 구현

**1. 전체 게시글 중 업데이트 최신 순으로 게시글 10개 조회**<br/>

- 웹사이트에서는 일반적으로 최신순으로 데이터를 보여주는 방법을 사용합니다.
- **사용자들이 가장 최신 정보에 접근하고 다른 사용자들과 실시간으로 상호작용하는 것이 중요하기 때문**입니다.
- **updateAt 필드를 기준으로 내림차순으로 게시글을 조회**하는 코드를 작성했습니다.
<br/>

**2. 사용자가 지정한 페이지에서 업데이트 최신순으로 게시글 10개 조회**<br/>

- 사용자는 원하는 페이지 번호를 요청해 현재 페이지 번호, 총 페이지 수, 요청된 페이지의 게시물 10개를 조회할 수 있습니다.
- **페이지 번호가 1보다 작거나, 전체 페이지 수보다 클 경우 에러가 발생**합니다.
<br/>

## 4. 사용자, 게시글 모두 Soft Delete 처리

작은 규모의 프로젝트이기 때문에 사용자와 게시글 데이터 모두 소프트 삭제로 관리했습니다.<br/>

**소프트 삭제는 데이터를 완전히 삭제하는 것이 아니라, 해당 데이터의 레코드에 삭제된 상태를 표시**하는 방법입니다. 사용자나 게시글을 삭제처리할 경우 **deletedAt 열에 삭제 시점의 타임스탬프가 기록**됩니다.

- **데이터 복구에 용이** : 소프트 삭제를 사용하면 데이터를 완전히 삭제하기 전에 실수로 삭제된 데이터를 복구할 수 있습니다. 잘 못 삭제된 데이터를 복구할 수 있으면 중요한 정보를 잃지 않고 비즈니스 활동을 지원하는데 도움이 됩니다.

- **오류와 버그 처리** : 데이터를 완전히 삭제하면 해당 데이터가 연결된 다른 데이터와의 관계를 끊을 수 있습니다. 이로 인해 시스템 오류가 발생하거나 버그가 발생할 수 있는데, 소프트 삭제 시 데이터의 논리적인 관계를 유지하여 이러한 문제를 방지할 수 있습니다.
<br/>

# 📡 API 명세
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

