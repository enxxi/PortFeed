# PortFeed
##### 🪴<strong>[PortFeed](http://kdt-ai7-team05.elicecoding.com/) <strong>: "Portfolio" + "Feed" : 다른 사용자와 포트폴리오를 공유하며 정보를 흡수하는 서비스입니다.
##### RainbowSpark [5iE1]
> [FrontEnd] 구병주 김태은 이진주

> [BackEnd] 노충완 이은석 탁은경


## 기능
- 학력, 수상이력, 프로젝트, 자격증을 기재할 수 있는 게시판
- 다른 사람의 포트폴리오를 관람할 수 있는 네트워크 페이지

## 주요 사용 기술

1. 프론트엔드
- React (create-react-app으로 구현되었습니다.)
- React Bootstrap
- axios
1. 백엔드
- Express (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose

### 파일 구조
<details>
<summary>구조</summary>
<div markdown="1">

```
portfolio-share-service-racer
├─ back
│  ├─ src
│  │  ├─ app.js
│  │  ├─ controllers
│  │  │  ├─ awardController.js
│  │  │  ├─ certificateController.js
│  │  │  ├─ educationController.js
│  │  │  ├─ projectController.js
│  │  │  └─ userController.js
│  │  ├─ data
│  │  │  └─ profile
│  │  │     ├─ test1.png
│  │  ├─ db
│  │  │  ├─ index.js
│  │  │  ├─ models
│  │  │  │  ├─ Award.js
│  │  │  │  ├─ Certificate.js
│  │  │  │  ├─ Education.js
│  │  │  │  ├─ Project.js
│  │  │  │  └─ User.js
│  │  │  └─ schemas
│  │  │     ├─ award.js
│  │  │     ├─ certificate.js
│  │  │     ├─ education.js
│  │  │     ├─ project.js
│  │  │     └─ user.js
│  │  ├─ middlewares
│  │  │  ├─ errorMiddleware.js
│  │  │  ├─ login_required.js
│  │  │  └─ validation.js
│  │  ├─ routers
│  │  │  ├─ awardRouter.js
│  │  │  ├─ certificateRouter.js
│  │  │  ├─ educationRouter.js
│  │  │  ├─ projectRouter.js
│  │  │  └─ userRouter.js
│  │  └─ services
│  │     ├─ awardService.js
│  │     ├─ certificateService.js
│  │     ├─ educationService.js
│  │     ├─ projectService.js
│  │     └─ userService.js
├─ front
│  ├─ public
│  │  ├─ favicons
│  │  └─ index.html
│  ├─ README.md
│  ├─ src
│  │  ├─ App.js
│  │  ├─ components
│  │  │  ├─ award
│  │  │  │  └─ Award.js
│  │  │  ├─ certificate
│  │  │  │  └─ Certificate.js
│  │  │  ├─ common
│  │  │  │  └─ Header.js
│  │  │  ├─ education
│  │  │  │  └─ Education.js
│  │  │  ├─ Portfolio.js
│  │  │  ├─ project
│  │  │  │  └─ Project.js
│  │  │  └─ user
│  │  │     ├─ LoginForm.js
│  │  │     ├─ Network.js
│  │  │     ├─ RegisterForm.js
│  │  │     ├─ User.js
│  │  │     ├─ UserCard.js
│  │  │     ├─ UserEditForm.js
│  │  │     └─ UserFileEditForm.js
│  │  ├─ index.js
│  │  ├─ lib
│  │  │  └─ apis
│  │  │     └─ api.js
│  │  ├─ pages
│  │  │  ├─ index.js
│  │  │  ├─ LoginPage.js
│  │  │  ├─ NetworkPage.js
│  │  │  ├─ PortfolioPage.js
│  │  │  └─ RegisterPage.js
│  │  └─ store
│  │     └─ reducers
│  │        └─ loginReducer.js
└─ README.md
```

</div>
</details>

## 설치 방법

1. 프론트 엔드 서버 실행

```
cd front
yarn
yarn start
```

1. 백엔드 서버 실행

```
back 폴더 내부 README 참고
```

---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.

Copyright 2023 엘리스 Inc. All rights reserved.
