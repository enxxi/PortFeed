import { Project } from "../db"; 
import { v4 as uuidv4 } from "uuid";

class ProjectService {
  static async addProject({ title, description, user_id }) {

    // id 는 각 프로젝트에 유니크 값 부여
    const id = uuidv4();
    const newProject = { id, title, description, user_id };

    // db에 저장
    const createdNewProject = await Project.create({ newProject });
    createdNewProject.errorMessage = null; 

    return createdNewProject;
  }

  static async getProjects() {
    const Projects = await Project.findAll();
    return Projects;
  }

  static async setProject({ user_id, project_id, toUpdate }) {
    // db에 프로젝트 id가 존재하는지 확인
    let project = await Project.findById({ user_id, project_id });

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

  static async deleteProject({ user_id, project_id }) {

    // 프로젝트가 db에 존재하는지 확인
    const project = await Project.findById({ user_id, project_id });
    if (!project) {
      const errorMessage =
        "프로젝트가 존재하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 프로젝트 삭제
    const deletedProject = await Project.deleteOne({ id: project_id });

    return deletedProject;

  }
  
}

export { ProjectService };