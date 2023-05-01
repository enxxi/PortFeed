import { Project } from "../db"; 
import { v4 as uuidv4 } from "uuid";

class ProjectService {
  static async addProject({ title, description, user_id }) {

    // id 는 각 프로젝트에 유니크 값 부여
    const project_id = uuidv4();
    const newProject = { project_id, title, description, user_id };

    // db에 저장
    const createdNewProject = await Project.create({ newProject });

    return createdNewProject;
  }
  
  static async getProjectList({ user_id }) {
    const ProjectList = await Project.findByUserId({ user_id });
    return ProjectList;
  }

  static async setProject({ project_id, toUpdate }) {
    // db에 프로젝트 id가 존재하는지 확인
    let project = await Project.findByProjectId( project_id );

    // 프로젝트가 없는 경우 오류 메시지
    if (!project) {
			const errorMessage =
				"해당 id를 가진 학력은 없습니다. 다시 한 번 확인해 주세요.";
			return { errorMessage };
		}

		const fieldsToUpdate = {
			title: "title",
			description: "description",
		};

		for (const [field, fieldToUpdate] of Object.entries(fieldsToUpdate)) {
			if (toUpdate[field]) {
				const newValue = toUpdate[field];
				  project = await project.update({
					project_id,
					fieldToUpdate,
					newValue,
				});
			}
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