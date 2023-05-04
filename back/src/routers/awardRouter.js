import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import {
  userTokenValidation,
  awardValidation,
} from "../middlewares/validation";
import { awardController } from "../controllers/awardController";

const awardRouter = Router();
awardRouter.use(login_required);

awardRouter
  .route("/award/:user_id/:award_id")
  .post(userTokenValidation, awardValidation, awardController.awardPostFunction)

  .get(awardController.awardGetFunction)

  .patch(
    userTokenValidation,
    awardValidation,
    awardController.awardPatchFunction
  )

  .delete(userTokenValidation, awardController.awardDeleteFunction);

export { awardRouter };
