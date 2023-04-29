import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { EducationService } from "../services/educationService";

const eduRouter = Router();
eduRouter.use(login_required);

//추가
eduRouter.post("education/create", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const user_id = req.body.user_id;
    const school = req.body.school;
    const major = req.body.major;
    //const degree = req.body.description;

    // 위 데이터를 Education db에 추가하기
    const newEducation = await EducationService.addEducation({
      user_id,
      school,
      major,
    });

    return res.status(201).json(newEducation);
  } catch (error) {
    next(error);
  }
});

eduRouter.get("/educations/:id", async function (req, res, next) {
  try {
    const edu_id = req.params.id;

    const education = await EducationService.getEducation({ edu_id });

    if (education.errorMessage) {
      throw new Error(education.errorMessage);
    }

    res.status(200).send(education);
  } catch (error) {
    next(error);
  }
});

//수정
eduRouter.put("/educations/:id", async function (req, res, next) {
  try {
    //edu_id 추출
    const edu_id = req.params.id;

    const school = req.body.school ?? null;
    const major = req.body.major ?? null;

    const toUpdate = { school, major };

    const education = await EducationService.setEducation({ edu_id, toUpdate });

    if (education.errorMessage) {
      throw new Error(education.errorMessage);
    }

    res.status(200).send(education);
  } catch (error) {
    next(error);
  }
});

//삭제
eduRouter.delete("/educations/:id", async function (req, res, next) {
  try {
    //id가져오기
    const edu_id = req.params.id;

    const result = await EducationService.deleteEducation({ edu_id });

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

eduRouter.get("/educationList/:user_id", async function (req, res, next) {
  try {
    const user_id = req.params.user_id;
    const educationList = await EducationService.getEducationList({ user_id });
    res.status(200).send(educationList);
  } catch (error) {
    next(error);
  }
});

export { eduRouter };
