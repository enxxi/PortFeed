import { ProjectModel } from "../schemas/project";

class Project {
  static async create({ newProject }) {
    const createdNewProject = await ProjectModel.create(newProject);
    return createdNewProject;
  }

  static async findById({ project_id }) {
    const project = await ProjectModel.findOne({ id: project_id });
    return project;
  }

  static async findByUserId({ user_id }) {
    const projects = await ProjectModel.find({ user_id });
    return projects;
  }

  static async update({ project_id, fieldToUpdate, newValue }) {
    const filter = { project_id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedProject = await ProjectModel.findOneAndUpdate(
      filter,
      update,
      option
    );

    return updatedProject;
  }
  static async deleteById({ project_id }) {
    const deleteResult = await ProjectModel.deleteOne({ project_id });
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  }
}

export { Project };
