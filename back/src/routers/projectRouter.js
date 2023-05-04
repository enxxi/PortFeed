import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import {
  userTokenValidation,
  projectValidation,
} from "../middlewares/validation";
import { projectController } from "../controllers/projectController";

const projectRouter = Router();
projectRouter.use(login_required);

projectRouter
  .route("/project/:user_id/:project_id")
  .post(
    userTokenValidation,
    projectValidation,
    projectController.projectPostFunction
  )

  .get(projectController.projectGetFunction)

  .patch(
    userTokenValidation,
    projectValidation,
    projectController.projectPatchFunction
  )

  .delete(userTokenValidation, projectController.projectDeleteFunction);

export { projectRouter };
