import { Award } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { v4 as uuidv4 } from "uuid";

class AwardService {
  static async addAward({ user_id, title, organization, description }) {
    // id 는 유니크 값 부여
    const id = uuidv4();
    const newAward = { id, user_id, title, organization, description };

    // db에 저장
    const createdNewAward = await Award.create({ newAward });

    return createdNewAward;
  }

  static async getAward({ award_id }) {
    // award db에 존재 여부 확인
    const award = await Award.findById({ award_id });
    if (!award) {
      const errorMessage =
        "해당 id를 가진 수상 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return award;
  }

  static async getAwardList({ user_id }) {
    const awards = await Award.findByUserId({ user_id });
    return awards;
  } //모든 Award의 리스트를 받아오는 함수

  static async setAward({ award_id, toUpdate }) {
    // 우선 해당 id 의 award가 db에 존재하는지 여부 확인
    let award = await Award.findById({ award_id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!award) {
      const errorMessage =
        "해당 id를 가진 수상 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 업데이트 대상의 값이 null 이 아니라면 업데이트 진행
    if (toUpdate.title) {
      const fieldToUpdate = "title";
      const newValue = toUpdate.title;
      award = await Award.update({ award_id, fieldToUpdate, newValue });
    }

    if (toUpdate.organization) {
      const fieldToUpdate = "organization";
      const newValue = toUpdate.organization;
      award = await Award.update({ award_id, fieldToUpdate, newValue });
    }

    if (toUpdate.description) {
      const fieldToUpdate = "description";
      const newValue = toUpdate.description;
      award = await Award.update({ award_id, fieldToUpdate, newValue });
    }

    return award;
  }

  static async deleteAward({ award_id }) {
    const isDataDeleted = await Award.deleteById({ award_id });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!isDataDeleted) {
      const errorMessage =
        "해당 id를 가진 수상 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return { status: "ok" };
  }
}

export { AwardService };
