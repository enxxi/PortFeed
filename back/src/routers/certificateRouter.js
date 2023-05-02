import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { CertificateService } from "../services/certificateService";

const certificateRouter = Router();
certificateRouter.use(login_required);

certificateRouter
  .route("/certificate/:user_id")
  .post(async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const user_id = req.params.user_id;
      const name = req.body.name;
      const organization = req.body.organization;
      const description = req.body.description;

      const newCertificate = await CertificateService.addCertificate({
        user_id,
        name,
        organization,
        description,
      });

      if (newCertificate.errorMessage) {
        throw new Error(newCertificate.errorMessage);
      }

      //201 created
      return res.status(201).json(newCertificate);
    } catch (error) {
      next(error);
    }
  })

  .get(async function (req, res, next) {
    try {
      const user_id = req.params.user_id;

      const certificateList = await CertificateService.getCertificateList({
        user_id,
      });

      return res.status(200).send(certificateList);
    } catch (error) {
      next(error);
    }
  })

  .patch(async function (req, res, next) {
    try {
      const certificate_id = req.body.certificate_id;
      const name = req.body.name ?? null;
      const organization = req.body.organization ?? null;
      const description = req.body.description ?? null;

      const toUpdate = { name, organization, description };

      const updatedCertificate = await CertificateService.setCertificate({
        certificate_id,
        toUpdate,
      });

      if (updatedCertificate.errorMessage) {
        throw new Error(updatedCertificate.errorMessage);
      }
      return res.status(200).send(updatedCertificate);
    } catch (error) {
      next(error);
    }
  });

certificateRouter.delete(
  "/certificate/:certificate_id",
  async (req, res, next) => {
    try {
      const certificate_id = req.params;
      const deleteResult = await CertificateService.deleteCertificate({
        certificate_id,
      });

      if (!deleteResult) {
        throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
      }

      //status 204 : 삭제요청 완료, 추가 정보없음?
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { certificateRouter };
