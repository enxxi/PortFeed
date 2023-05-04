import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import {
  userTokenValidation,
  educationValidation,
} from "../middlewares/validation";
import { eduController } from "../controllers/educationController";

const educationRouter = Router();
educationRouter.use(login_required);

//추가
educationRouter
  .route("/education/:user_id/:education_id")
  .post(
    userTokenValidation,
    educationValidation,
    eduController.educationPostFunction
  )

  //학력 받아오기
  .get(eduController.educationGetFunction)

  //수정
  .patch(
    userTokenValidation,
    educationValidation,
    eduController.educationPatchFunction
  )

  //삭제
  .delete(userTokenValidation, eduController.educationDeleteFunction);

export { educationRouter };
