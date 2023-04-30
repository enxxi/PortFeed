import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { ProjectService } from "../services/projectService";

const projectRouter = Router();
projectRouter.use(login_required)

projectRouter
.route("/project/:user_id")
.post(async function (req, res, next) {
    try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const user_id = req.params.user_id;
    const title = req.body.title;
    const description = req.body.description;

    // 위 데이터를 유저 db에 추가하기
    const newProject = await ProjectService.addProject({
      user_id,
      title,
      description,
    });

    if (newProject.errorMessage) {
      throw new Error(newProject.errorMessage);
    }

    //201 created
    return res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
})

.get(async function(req, res, next) {
  try {
      const user_id = req.params.user_id
      
      const projectList = await ProjectService.getProjectList({ user_id });

      return res.status(200).send(projectList);
      } catch (error) {
      next(error);
      }
  })


  .patch(async function(req, res, next) {
    try {
      const project_id = req.body.project_id;
      const title = req.body.title ?? null;
      const description = req.body.description ?? null;

      const toUpdate = { title, description }

      const updatedProject = await ProjectService.setProject({ project_id, toUpdate });

      if (updatedProject.errorMessage) {
        throw new Error(updatedProject.errorMessage);
      }
      return res.status(200).send(updatedProject);
    } catch (error) {
      next(error);
    }
  });


projectRouter.delete("/project/:project_id",
  async (req, res, next) => {
    try {
      const project_id = req.params;
      const deleteResult = await ProjectService.deleteProject({ project_id });
  
      if (!deleteResult) {
        throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
      }
      
      //status 204 : 삭제요청 완료, 추가 정보없음?
      return res.status(204).send(deleteResult)
    } catch (error) {
      next(error);
    }
  });


export { projectRouter };