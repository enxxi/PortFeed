import { Project } from "../db"; 
import { v4 as uuidv4 } from "uuid";

class ProjectService {
  static async addProject({ title, description, user_id }) {

    // id 는 각 프로젝트에 유니크 값 부여
    const project_id = uuidv4();
    const newProject = { project_id, title, description, user_id };

    // db에 저장
    const createdNewProject = await Project.create({ newProject });
    createdNewProject.errorMessage = null; 

    return createdNewProject;
  }

  // 모든 유저의 프로젝트 정보조회 - 필요한 경우 추가
  // static async getProjects() {
  //   const Projects = await Project.findAll();
  //   return Projects;
  // }

  static async getProjectList({ user_id }) {
    const ProjectList = await Project.findByUserId({ user_id });
    return ProjectList;
  }

  static async setProject({ project_id, toUpdate }) {
    // db에 프로젝트 id가 존재하는지 확인
    let project = await Project.findByProjectId( project_id );

    // 프로젝트가 없는 경우 오류 메시지
    if (!Project) {
        const errorMessage =
          "해당하는 프로젝트 내역이 없습니다. 다시 한 번 확인해 주세요.";
        return { errorMessage };
      }
  
    // 프로젝트 수정사항 업데이트
    if (toUpdate.title) {
        const fieldToUpdate = "title";
        const newValue = toUpdate.title;
        project = await Project.update({ project_id, fieldToUpdate, newValue });
      }
  

      if (toUpdate.description) {
        const fieldToUpdate = "description";
        const newValue = toUpdate.description;
        project = await Project.update({ project_id, fieldToUpdate, newValue });
      }
  
      return project;
  }

  static async deleteProject({ project_id }) {
    const isDataDeleted = await Project.deleteById( project_id );

    if (!isDataDeleted) {
      const errorMessage =
        "프로젝트가 존재하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return { status: "ok" };
  }
  
}

export { ProjectService };