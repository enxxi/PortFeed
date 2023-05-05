import is from "@sindresorhus/is";
import { ProjectService } from "../services/projectService";
const logger = require("../config/logger");
class projectController {
  static async projectPostFunction(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const pathUser_id = req.params.user_id;

      //fromdate, todate 추가됨
      const { title, date, description, fromdate, todate } = req.body;

      const newProject = await ProjectService.addProject({
        user_id: pathUser_id,
        title,
        date,
        description,
        fromdate,
        todate,
      });
      logger.info('POST /project 200 "프로젝트가 추가되었습니다"');
      if (newProject.errorMessage) {
        throw new Error(newProject.errorMessage);
      }

      //201 created
      return res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  }

  static async projectGetFunction(req, res, next) {
    
    try {
      const pathUser_id = req.params.user_id;
      const project = await ProjectService.getProjectList({
        user_id: pathUser_id,
      });

      if (project.errorMessage) {
        throw new Error(project.errorMessage);
      }

      return res.status(200).send(project);
    } catch (error) {
      next(error);
    }
  }

  static async projectPatchFunction(req, res, next) {
    logger.info('PATCH /project/:user_id/:project_id 200 "프로젝트가 편집되었습니다"');
    try {
      const project_id = req.params.project_id;

      const { title, date, description } = req.body ?? null;
      const toUpdate = { title, date, description };

      const project = await ProjectService.setProject({
        project_id,
        toUpdate,
      });

      if (project.errorMessage) {
        throw new Error(project.errorMessage);
      }
      return res.status(200).send(project);
    } catch (error) {
      next(error);
    }
  }

  static async projectDeleteFunction(req, res, next) {
    logger.info('DELETE /project 204 "프로젝트가 삭제되었습니다"');
    try {
      const project_id = req.params.project_id;
      const result = await ProjectService.deleteProject({ project_id });

      if (!result) {
        throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
      }


      //status 204 : 삭제요청 완료, 추가 정보없음
      return res.status(204).send(result);
    } catch (error) {
      next(error);
    }
  }
}

export { projectController };

