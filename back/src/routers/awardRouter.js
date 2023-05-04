import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import {
  userTokenValidation,
  awardValidation,
} from "../middlewares/validation";
import { awardController } from "../controllers/awardController";

const awardRouter = Router();
awardRouter.use(login_required);

//추가
awardRouter
  .route("/award/:user_id/:award_id")
  .post(userTokenValidation, awardValidation, awardController.awardPostFunction)

  //수상 목록 받아오기
  .get(awardController.awardGetFunction)

  //수정
  .patch(
    userTokenValidation,
    awardValidation,
    awardController.awardPatchFunction
  )

  .delete(userTokenValidation, awardController.awardDeleteFunction);

export { awardRouter };
