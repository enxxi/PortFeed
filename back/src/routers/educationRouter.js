import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { EducationService } from "../services/educationService";

const educationRouter = Router();
educationRouter.use(login_required);

//추가
educationRouter
	.route("/education/:user_id/:education_id")
	.post(async function (req, res, next) {
		try {
			if (is.emptyObject(req.body)) {
				throw new Error(
					"headers의 Content-Type을 application/json으로 설정해주세요"
				);
			}
			const tokenUser_id = req.currentUserId; //토큰에서 user_id받아오기
			// req (request) 에서 데이터 가져오기
			const pathUser_id = req.params.user_id;
			if (tokenUser_id !== pathUser_id) {
				throw new Error("인증정보가 올바르지 않습니다.");
			}

			const { school, major, degree } = req.body;

			// 위 데이터를 Education db에 추가하기
			const newEducation = await EducationService.addEducation({
				user_id: pathUser_id,
				school,
				major,
				degree,
			});

			if (newEducation.errorMessage) {
				throw new Error(newEducation.errorMessage);
			}

			return res.status(201).json(newEducation);
		} catch (error) {
			next(error);
		}
	})

	//학력 받아오기
	.get(async function (req, res, next) {
		try {
			const tokenUser_id = req.currentUserId; //토큰에서 user_id받아오기
			// req (request) 에서 데이터 가져오기
			const pathUser_id = req.params.user_id;

			if (tokenUser_id !== pathUser_id) {
				throw new Error("인증정보가 올바르지 않습니다.");
			}

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
	})

	//수정
	.patch(async function (req, res, next) {
		try {
			const tokenUser_id = req.currentUserId; //토큰에서 user_id받아오기
			// req (request) 에서 데이터 가져오기
			const pathUser_id = req.params.user_id;

			if (tokenUser_id !== pathUser_id) {
				throw new Error("인증정보가 올바르지 않습니다.");
			}

			//edu_id 추출
			const education_id = req.params.education_id;

			const { school, major, degree } = req.body ?? null;

			const toUpdate = { school, major, degree };

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
	})

	//삭제
	.delete(async function (req, res, next) {
		try {
			const tokenUser_id = req.currentUserId; //토큰에서 user_id받아오기
			// req (request) 에서 데이터 가져오기
			const pathUser_id = req.params.user_id;

			if (tokenUser_id !== pathUser_id) {
				throw new Error("인증정보가 올바르지 않습니다.");
			}

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
	});

export { educationRouter };
