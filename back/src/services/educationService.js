import { Education } from "../db";
import { v4 as uuidv4 } from "uuid";

class EducationService {
  // 학력을 추가하는 함수
  static async addEducation({ user_id, name, field }) {
    // id는 유니크 값 부여
    const id = uuidv4();
    const newEducation = { id, user_id, name, field };

    //db에 저장
    const createdNewEducation = await Education.create({ newEducation });

    return createdNewEducation;
  }

  // edu_id에 해당하는 학력을 가져오는 함수
  static async getEducation({ edu_id }) {
    //edu db에 존재 여부 확인
    const education = await Education.findById({ edu_id });
    if (!education) {
      const errorMessage =
        "해당 id를 가진 학력은 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return education;
  }

  //모든 학력 List를 받아오는 함수
  static async getEducationList({ user_id }) {
    const educations = await Education.findByUserId({ user_id });
    return educations;
  }

  //해당 id의 학력을 수정하는 함수
  static async setEducation({ edu_id, toUpdate }) {
    let education = await Education.findById({ edu_id });

    //db에서 찾지 못한 경우, 에러 메시지 반환
    if (!education) {
      const errorMessage =
        "해당 id를 가진 학력은 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    //업데이트 대상의 값이 null이 아니라면 업데이트
    if (toUpdate.name) {
      const fieldToUpdate = "name";
      const newValue = toUpdate.name;
      education = await Education.update({ edu_id, fieldToUpdate, newValue });
    }

    if (toUpdate.field) {
      const fieldToUpdate = "field";
      const newValue = toUpdate.field;
      education = await Education.update({ edu_id, fieldToUpdate, newValue });
    }

    return education;
  }

  static async deleteEducation({ edu_id }) {
    const isDataDeleted = await Education.deleteById({ edu_id });

    if (!isDataDeleted) {
      const errorMessage =
        "해당 id를 가진 학력은 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return { status: "ok" };
  }
}

export { EducationService };
