import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import {
  userTokenValidation,
  certificateValidation,
} from "../middlewares/validation";
import { certificateController } from "../controllers/certificateController";

const certificateRouter = Router();
certificateRouter.use(login_required);

certificateRouter
  .route("/certificate/:user_id/:certificate_id")
  .post(
    userTokenValidation,
    certificateValidation,
    certificateController.certificatePostFunction
  )

  .get(certificateController.certificateGetFunction)

  .patch(
    userTokenValidation,
    certificateValidation,
    certificateController.certificatePatchFunction
  )

  .delete(userTokenValidation, certificateController.certificateDeleteFunction);

export { certificateRouter };
