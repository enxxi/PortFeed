import is from "@sindresorhus/is";
import { AwardService } from "../services/awardService";
const logger = require("../config/logger");
class awardController {
  static async awardPostFunction(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const pathUser_id = req.params.user_id;

      const { title, organization, description, date } = req.body;

      // 위 데이터를 Award db에 추가하기
      const newAward = await AwardService.addAward({
        user_id: pathUser_id,
        title,
        organization,
        description,
        date,
      });
      logger.info('POST /award/:user_id/:award_id 201 "수상이력이 추가되었습니다"');
      if (newAward.errorMessage) {
        throw new Error(newAward.errorMessage);
      }

      return res.status(201).json(newAward);
    } catch (error) {
      next(error);
    }
  }

  static async awardGetFunction(req, res, next) {
    try {
      const pathUser_id = req.params.user_id;
      const award = await AwardService.getAwardList({ user_id: pathUser_id });

      if (award.errorMessage) {
        throw new Error(award.errorMessage);
      }

      return res.status(200).send(award);
    } catch (error) {
      next(error);
    }
  }

  static async awardPatchFunction(req, res, next) {
    logger.info('PATCH /award/:user_id/:award_id 201 "수상이력이 수정되었습니다"');
    try {
      const award_id = req.params.award_id;

      const { title, organization, description, date } = req.body ?? null;
      const toUpdate = { title, organization, description, date };

      const award = await AwardService.setAward({ award_id, toUpdate });

      if (award.errorMessage) {
        throw new Error(award.errorMessage);
      }

      return res.status(200).send(award);
    } catch (error) {
      next(error);
    }
  }

  static async awardDeleteFunction(req, res, next) {
    logger.info('DELETE /award/:user_id/:award_id 201 "수상이력이 삭제되었습니다"');
    try {
      const award_id = req.params.award_id;

      const result = await AwardService.deleteAward({ award_id });

      if (!result) {
        throw new Error("해당 학력을 삭제할 수 없습니다.");
      }

      return res.status(204).send(result);
    } catch (error) {
      next(error);
    }
  }
}

export { awardController };
