import { EducationModel } from "../schemas/education";

class Education {
  static async create({ newEducation }) {
    const createdNewEducation = await EducationModel.create(newEducation);
    return createdNewEducation;
  }

  static async findById({ edu_id }) {
    const education = await EducationModel.findOne({ id: edu_id });
    return education;
  }

  static async findByUserId({ user_id }) {
    const educations = await EducationModel.find({ user_id });
    return educations;
  }

  static async update({ edu_id, fieldToUpdate, newValue }) {
    const filter = { id: edu_id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedEducation = await EducationModel.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedEducation;
  }

  static async deleteById({ edu_id }) {
    const deleteResult = await EducationModel.deleteOne({ id: edu_id });
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  }
}

export { Education };
