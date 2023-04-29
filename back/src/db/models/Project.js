import { ProjectModel } from "../schemas/Project";

class Project {
  static async create({ newProject }) {
    const createdNewProject = await ProjectModel.create(newProject);
    return createdNewProject;
  }

  static async findById({ user_id }) {
    const Project = await UserModel.findOne({ user_id });
    return Project;
  }

  static async findById({ project_id }) {
    const Project = await ProjectModel.findOne({ id: project_id });
    return Project;
  }

  static async findAll() {
    const Projects = await ProjectModel.find({});
    return Projects;
  }

  static async update({ project_id, fieldToUpdate, newValue }) {
    const filter = { id: project_id };
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
      const deleteResult = await ProjectModel.deleteOne({ id: project_id });
      const isDataDeleted = deleteResult.deletedCount === 1;
      return isDataDeleted;
  }
}

export { Project };