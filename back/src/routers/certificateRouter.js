import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { CertificateService } from "../services/CertificateService";

const certificateRouter = Router();

//자격증 정보 추가
certificateRouter('/certificates/:user_id')
  .post(login_required, 
    async function (req, res, next) {
    try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const user_id = req.params.user_id;
    const title = req.body.title;
    const organization = req.body.organization;
    const description = req.body.description;

    const newCertificate = await CertificateService.addCertificate({
      user_id,
      title,
      organization,
      description,
    });

    if (newCertificate.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    //201 -> 201 created
    res.status(201).json(newCertificate);
  } catch (error) {
    next(error);
  }
})

//유저의 모든 자격증 정보 조회
  .get(async function(req, res, next) {
  try {
      const user_id = req.params.user_id;
      
      const certificatelist = await CertificateService.getCertificate({ user_id });

      res.status(200).send(certificatelist);
      } catch (error) {
      next(error);
      }
  })
  
//자격증 정보 수정
.put(login_required, 
async function(req, res, next) {
  try {
      const user_id = req.params.user_id;
      const Certificate_id = req.body.Certificate_id;
      const title = req.body.title ?? null;
      const organization = req.body.organization ?? null;
      const description = req.body.description ?? null;

      const toUpdate = { title, organization, description }

      const updatedCertificate = await CertificateService.setCertificate({ user_id, Certificate_id, toUpdate });

      res.status(200).send(updatedCertificate);
    } catch (error) {
      next(error);
    }
  })

.delete(login_required, 
  async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const certificate_id = req.body.certificate_id;

    const deleteResult = await CertificateService.deleteCertificate({ user_id, certificate_id });

    if (!deleteResult) {
      throw new Error("해당 자격증 정보를 삭제할 수 없습니다.");
    }
    
    //status 204 : 삭제요청 완료, 추가 정보없음?
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


certificateRouter.get("/certificates/:user_id/:certificate_id",
    login_required,
    async function (req, res, next) {
    try {
      const {user_id, Certificate_id} = req.params;
      const CertificateList = await CertificateService.getCertificates({ user_id });

      res.status(200).send(certificateList);
    } catch (error) {
      next(error);
    }
  });
  

export { certificateRouter };