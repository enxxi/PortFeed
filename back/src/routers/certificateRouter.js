import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { CertificateService } from "../services/certificateService";
import { certificateValidation } from "../middlewares/validation";

const certificateRouter = Router();
certificateRouter.use(login_required);

certificateRouter
  .route("/certificate/:user_id/:certificate_id")
  .post(certificateValidation, async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      const tokenUser_id = req.currentUserId;
      const pathUser_id = req.params.user_id;

      if (tokenUser_id !== pathUser_id) {
        throw new Error("인증정보가 올바르지 않습니다.");
      }
      const { name, organization, description, date } = req.body;

      const newCertificate = await CertificateService.addCertificate({
        user_id: pathUser_id,
        name,
        organization,
        description,
        date,
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
      const pathUser_id = req.params.user_id;
      const certificate = await CertificateService.getCertificateList({
        user_id: pathUser_id,
      });

      if (certificate.errorMessage) {
        throw new Error(certificate.errorMessage);
      }

      return res.status(200).send(certificate);
    } catch (error) {
      next(error);
    }
  })

  .patch(certificateValidation, async function (req, res, next) {
    try {
      const tokenUser_id = req.currentUserId;
      const pathUser_id = req.params.user_id;

      if (tokenUser_id !== pathUser_id) {
        throw new Error("인증정보가 올바르지 않습니다.");
      }

      const certificate_id = req.params.certificate_id;
      const { name, organization, description, date } = req.body ?? null;
      const toUpdate = { name, organization, description, date };

      const certificate = await CertificateService.setCertificate({
        certificate_id,
        toUpdate,
      });

      if (certificate.errorMessage) {
        throw new Error(certificate.errorMessage);
      }
      return res.status(200).send(certificate);
    } catch (error) {
      next(error);
    }
  })

  .delete(async (req, res, next) => {
    try {
      const tokenUser_id = req.currentUserId;
      const pathUser_id = req.params.user_id;

      if (tokenUser_id !== pathUser_id) {
        throw new Error("인증정보가 올바르지 않습니다.");
      }

      const certificate_id = req.params.certificate_id;

      const result = await CertificateService.deleteCertificate({
        certificate_id,
      });

      if (!result) {
        throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
      }

      //status 204 : 삭제요청 완료, 추가 정보없음
      return res.status(204).send(result);
    } catch (error) {
      next(error);
    }
  });

export { certificateRouter };
