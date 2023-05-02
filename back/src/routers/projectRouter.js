import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { ProjectService } from "../services/projectService";

const projectRouter = Router();
projectRouter.use(login_required)

projectRouter
  .route("/project/:user_id/:project_id")
  .post(async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const tokenUser_id = req.currentUserId;
      const pathUser_id = req.params.user_id;

      if (tokenUser_id !== pathUser_id) {
        throw new Error("인증정보가 올바르지 않습니다.");
      }

      const { title, description } = req.body;

      const newProject = await ProjectService.addProject({
        user_id : pathUser_id,
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
        const tokenUser_id = req.currentUserId;
        const pathUser_id = req.params.user_id;
        if (tokenUser_id !== pathUser_id) {
          throw new Error("인증정보가 올바르지 않습니다.");
        }
        
        const projectList = await ProjectService.getProjectList({ user_id: pathUser_id });

        return res.status(200).send(projectList);
        } catch (error) {
        next(error);
        }
    })
  

  .patch( async function(req, res, next) {
    try {
      const tokenUser_id = req.currentUserId;
			const pathUser_id = req.params.user_id;
			if (tokenUser_id !== pathUser_id) {
				throw new Error("인증정보가 올바르지 않습니다.");
			}

      const project_id = req.params.project_id;

      const { title, description } = req.body ?? null ;
      const toUpdate = { title, description }

      const updatedProject = await ProjectService.setProject({ project_id, toUpdate });

      if (updatedProject.errorMessage) {
        throw new Error(updatedProject.errorMessage);
      }
      return res.status(200).send(updatedProject);
    } catch (error) {
      next(error);
    }
  })


  .delete(async (req, res, next) => {
    try {

      const tokenUser_id = req.currentUserId;
			const pathUser_id = req.params.user_id;
			if (tokenUser_id !== pathUser_id) {
				throw new Error("인증정보가 올바르지 않습니다.");
			}
      const project_id = req.params.project_id;
      const result = await ProjectService.deleteProject({ project_id });
  
      if (!result) {
        throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
      }
      
      //status 204 : 삭제요청 완료, 추가 정보없음
      return res.status(204).send(deleteResult)
    } catch (error) {
      next(error);
    }
  });


export { projectRouter };