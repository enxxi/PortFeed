import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";
import { UserModel } from "../db/schemas/user";
import { userValidation } from "../middlewares/validation";
import { userController } from "../controllers/userController";

const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/data/profile");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
});
// const upload = multer({ storage: fileStorage });
const userAuthRouter = Router();

userAuthRouter.post(
  "/user/register",
  userValidation,
  userController.userPostFunction
);

userAuthRouter.post("/user/login", userController.userLoginFunction);

userAuthRouter.get(
  "/userlist",
  login_required,
  userController.userGetListFunction
);

userAuthRouter.get(
  "/user/current",
  login_required,
  userController.userGetCurrentFunction
);

userAuthRouter.put(
  "/users/:id",
  userValidation,
  login_required,
  userController.userPutFunction
);

userAuthRouter.get(
  "/users/:id",
  login_required,
  userController.userGetInfoFunction
);

// jwt 토큰 기능 확인용, 삭제해도 되는 라우터임.
userAuthRouter.get("/afterlogin", login_required, function (req, res, next) {
  res
    .status(200)
    .send(
      `안녕하세요 ${req.currentUserId}님, jwt 웹 토큰 기능 정상 작동 중입니다.`
    );
});

userAuthRouter.patch(
  "/users/:id",
  userValidation,
  login_required,
  upload.single("profile"),
  userController.userPatchProfileFunction
);

export { userAuthRouter };
