import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { AwardService } from "../services/educationService";

const awardRouter = Router();
awardRouter.use(login_required);

awardRouter.post("/award/create", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const user_id = req.body.user_id;
    const title = req.body.title;
    const organization = req.body.organization;
    const description = req.body.description;

    // 위 데이터를 Award db에 추가하기
    const newAward = await AwardService.addAward({
      user_id,
      title,
      organization,
      description,
    });

    res.status(201).json(award); //201이 의미하는게 멀까..?
  } catch (error) {
    next(error);
  }
});

awardRouter.get("/awards/:id", async function (req, res, next) {
  try {
    const awardId = req.params.id;

    const award = await AwardService.getAward({ awardId });

    if (award.errorMessage) {
      throw new Error(award.errorMessage);
    }

    res.status(200).send(award);
  } catch (error) {
    next(error);
  }
});

awardRouter.put("/awards/:id", async function (req, res, next) {
  try {
    //awardId 추출
    const awardId = req.params.id;

    const title = req.body.title ?? null;
    const organization = req.body.organization ?? null;
    const description = req.body.description ?? null;

    const toUpdate = { title, organization, description };

    const award = await AwardService.setAward({ awardId, toUpdate });

    if (award.errorMessage) {
      throw new Error(award.errorMessage);
    }

    res.status(200).send(award);
  } catch (error) {
    next(error);
  }
});

awardRouter.delete("/awards/:id", async function (req, res, next) {
  try {
    //id가져오기
    const award_id = req.params.id;

    const result = await AwardService.deleteAward({ award_id });

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

awardRouter.get("/awardList/:user_id", async function (req, res, next) {
  try {
    const user_id = req.params.user_id;
    const awardList = await AwardService.getAwardList({ user_id });
    res.status(200).send(awardList);
  } catch (error) {
    next(error);
  }
});

export { awardRouter };
