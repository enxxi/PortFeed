import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { ProjectService } from "../services/ProjectService";

const projectRouter = Router();

//프로젝트 추가
projectRouter('/projects/:user_id')
  .post(login_required, 
    async function (req, res, next) {
    try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const user_id = req.params.user_id;
    const title = req.body.title;
    const description = req.body.description;

    const newProject = await ProjectService.addProject({
      user_id,
      title,
      description,
    });

    if (newProject.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    //201 -> 201 created
    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
})

//유저의 모든 프로젝트 조회
  .get(async function(req, res, next) {
  try {
    const user_id = req.params.user_id;
      
      const project = await ProjectService.getProject({ user_id });

      res.status(200).send(project);
      } catch (error) {
      next(error);
      }
  })
  
//프로젝트 수정
.put(login_required, 
async function(req, res, next) {
  try {
      const user_id = req.params.user_id;
      const project_id = req.body.project_id;
      const title = req.body.title ?? null;
      const description = req.body.description ?? null;

      const toUpdate = { title, description }

      const updatedProject = await ProjectService.setProject({ user_id, project_id, toUpdate });

      res.status(200).send(updatedProject);
    } catch (error) {
      next(error);
    }
  })

.delete(login_required, 
  async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const project_id = req.body.project_id;

    const deleteResult = await ProjectService.deleteProject({ user_id, project_id });

    if (!deleteResult) {
      throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
    }
    
    //status 204 : 삭제요청 완료, 추가 정보없음?
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


projectRouter.get("/projects/:user_id/:project_id",
    login_required,
    async function (req, res, next) {
    try {
      const {user_id, project_id} = req.params;
      const projectList = await ProjectService.getProjects({ user_id });

      res.status(200).send(projectList);
    } catch (error) {
      next(error);
    }
  });
  
export { projectRouter };

  

