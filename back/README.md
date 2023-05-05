# 포트폴리오 공유 서비스 백엔드 코드

## 실행 방법

```bash
npm install --global yarn
yarn
yarn start
```

<hr />
<details>
<summary>구조</summary>
<div markdown="1">

```portfolio-share-service-racer
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
```

</div>
</details>

- src/middlewares:
  - jwt토큰을 다루는 미들웨어인 login_required.js
  - 학습 편의를 위해 일괄 http 400 코드로 에러를 변환하는 에러핸들러인 errorMiddleware.js
  - user와 input data를 검증하는 validation.js
