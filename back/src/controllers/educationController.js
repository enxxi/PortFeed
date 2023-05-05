import { EducationService } from "../services/educationService";
import is from "@sindresorhus/is";
const logger = require("../config/logger");
class eduController {
  static async educationPostFunction(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const pathUser_id = req.params.user_id;

      const { school, major, degree } = req.body;

      // 위 데이터를 Education db에 추가하기
      const newEducation = await EducationService.addEducation({
        user_id: pathUser_id,
        school,
        major,
        degree,
      });
      logger.info('POST /education/:user_id/:education_id 201 "학력이 추가되었습니다"');
      if (newEducation.errorMessage) {
        throw new Error(newEducation.errorMessage);
      }

      return res.status(201).json(newEducation);
    } catch (error) {
      next(error);
    }
  }
  static async educationGetFunction(req, res, next) {
    
    try {
      const pathUser_id = req.params.user_id;
      const education = await EducationService.getEducationList({
        user_id: pathUser_id,
      });

      if (education.errorMessage) {
        throw new Error(education.errorMessage);
      }

      return res.status(200).send(education);
    } catch (error) {
      next(error);
    }
  }
  static async educationPatchFunction(req, res, next) {
    logger.info('PATCH /education/:user_id/:education_id 200 "학력이 수정되었습니다"');
    try {
      //edu_id 추출
      const education_id = req.params.education_id;

      //date 추가됨
      const { school, major, degree, description } = req.body ?? null;

      const toUpdate = { school, major, degree, description };

      const education = await EducationService.setEducation({
        education_id,
        toUpdate,
      });

      if (education.errorMessage) {
        throw new Error(education.errorMessage);
      }

      return res.status(200).send(education);
    } catch (error) {
      next(error);
    }
  }

  static async educationDeleteFunction(req, res, next) {
    logger.info('DELETE /education/:user_id/:education_id 200 "학력이 삭제되었습니다"');
    try {
      //id가져오기
      const education_id = req.params.education_id;

      const result = await EducationService.deleteEducation({ education_id });

      if (!result) {
        throw new Error("해당 학력을 삭제할 수 없습니다.");
      }

      return res.status(204).send(result);
    } catch (error) {
      next(error);
    }
  }
}

export { eduController };
