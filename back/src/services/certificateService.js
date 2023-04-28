import { Certificate } from "../db"; 
import { v4 as uuidv4 } from "uuid";

class CertificateService {
  static async addCertificate({ name, organization, description, user_id }) {

    // id 는 각 자격증에 유니크 값 부여
    const id = uuidv4();
    const newCertificate = { id, name, organization, description, user_id };

    // db에 저장
    const createdNewCertificate = await Certificate.create({ newCertificate });
    createdNewCertificate.errorMessage = null; 

    return createdNewCertificate;
  }

  static async getCertificates() {
    const Certificates = await Certificate.findAll();
    return Certificates;
  }

  static async setCertificate({ user_id, certificate_id, toUpdate }) {
    // db에 자격증 id가 존재하는지 확인
    let certificate = await certificate.findById({ user_id, certificate_id });

    // 자격증이 없는 경우 오류 메시지
    if (!Certificate) {
        const errorMessage =
          "해당하는 자격증 내역이 없습니다. 다시 한 번 확인해 주세요.";
        return { errorMessage };
      }
  
    // 자격증 수정사항 업데이트
    if (toUpdate.name) {
        const fieldToUpdate = "name";
        const newValue = toUpdate.name;
        Certificate = await Certificate.update({ certificate_id, fieldToUpdate, newValue });
      }
  
      if (toUpdate.organization) {
        const fieldToUpdate = "organization";
        const newValue = toUpdate.organization;
        Certificate = await Certificate.update({ certificate_id, fieldToUpdate, newValue });
      }

      if (toUpdate.description) {
        const fieldToUpdate = "description";
        const newValue = toUpdate.description;
        Certificate = await Certificate.update({ certificate_id, fieldToUpdate, newValue });
      }
  
      return certificate;
  }
  
  static async deleteCertificate({ user_id, certificate_id }) {

    // 자격증이 db에 존재하는지 확인
    const Certificate = await Certificate.findById({ user_id, certificate_id });
    if (!Certificate) {
      const errorMessage =
        "자격증가 존재하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    
    // 자격증 삭제
    const deletedCertificate = await Certificate.deleteOne({ id: certificate_id });

    return deletedCertificate;

  }
  
}

export { CertificateService };