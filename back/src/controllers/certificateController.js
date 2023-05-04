import is from "@sindresorhus/is";
import { CertificateService } from "../services/certificateService";

class certificateController {
  static async certificatePostFunction(req, res, next) {
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
  }
}

export { certificateController };
