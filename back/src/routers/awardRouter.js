import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { AwardService } from "../services/awardService";

const awardRouter = Router();
awardRouter.use(login_required);

//추가
awardRouter
	.route("/award/:user_id")
	.post(async function (req, res, next) {
		try {
			if (is.emptyObject(req.body)) {
				throw new Error(
					"headers의 Content-Type을 application/json으로 설정해주세요"
				);
			}

			// req (request) 에서 데이터 가져오기
			const user_id = req.params.user_id;
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

			if (newAward.errorMessage) {
				throw new Error(newAward.errorMessage);
			}

			return res.status(201).json(newAward);
		} catch (error) {
			next(error);
		}
	})

	//수상 목록 받아오기
	.get(async function (req, res, next) {
		try {
			const user_id = req.params.user_id;
			const award = await AwardService.getAwardList({ user_id });

			if (award.errorMessage) {
				throw new Error(award.errorMessage);
			}

			return res.status(200).send(award);
		} catch (error) {
			next(error);
		}
	})

	//수정
	.patch(async function (req, res, next) {
		try {
			//edu_id 추출
			const award_id = req.body.award_id;
			const title = req.body.title ?? null;
			const organization = req.body.organization ?? null;
			const description = req.body.description ?? null;

			const toUpdate = { title, organization, description };

			const award = await AwardService.setAward({ award_id, toUpdate });

			if (award.errorMessage) {
				throw new Error(award.errorMessage);
			}

			return res.status(200).send(award);
		} catch (error) {
			next(error);
		}
	});

awardRouter.delete("/award/:award_id", async function (req, res, next) {
	try {
		//id가져오기
		const award_id = req.params.award_id;

		const result = await AwardService.deleteAward({ award_id });

		if (!result) {
			throw new Error("해당 학력을 삭제할 수 없습니다.");
		}

		return res.status(204).send(result);
	} catch (error) {
		next(error);
	}
});

export { awardRouter };
