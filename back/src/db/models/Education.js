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
    const awards = await AwardModel.find({ user_id });
    return awards;
  }
}

export { Education };
