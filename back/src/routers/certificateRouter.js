import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { CertificateService } from "../services/CertificateService";

const certificateRouter = Router();

//로그인이 되어야만 실행되도록
certificateRouter.post(
    "/certificate/:user_id", 
    async function (req, res, next) {
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

    // 위 데이터를 유저 db에 추가하기
    const newCertificate = await CertificateService.addcertificate({
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
});

certificateRouter.get('/certificate/:user_id',
    async function(req, res, next) {
    try {
        const user_id = req.params.user_id
        const certificate_id = req.body.id;
        
        const certificate = await CertificateService.getCertificate({ user_id, certificate_id });

        res.status(200).send(certificate);
        } catch (error) {
        next(error);
        }
    });

certificateRouter.put('/certificate/:user_id',
    async function(req, res, next) {
    try {
    const user_id = req.params.user_id;
    const certificate_id = req.body.certificate_id;
    const title = req.body.title ?? null;
    const description = req.body.description ?? null;

    const toUpdate = { title, description }

    const updatedCertificate = await CertificateService.setCertificate({ user_id, certificate_id, toUpdate });

    res.status(200).send(updatedCertificate);
  } catch (error) {
    next(error);
  }
});

certificateRouter.delete("/certificate/:user_id", 
    login_required, 
    async (req, res, next) => {
    try {
      const certificate_id = req.body.certificate_id;
      const deleteResult = await certificateService.deleteCertificate({ certificate_id });
  
      if (!deleteResult) {
        throw new Error("해당 프로젝트를 삭제할 수 없습니다.");
      }
      
      //status 204 : 삭제요청 완료, 추가 정보없음?
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  export { certificateRouter };