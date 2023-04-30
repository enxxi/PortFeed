import { Certificate } from "../db"; 
import { v4 as uuidv4 } from "uuid";

class CertificateService {
  static async addCertificate({ name, organization, description, user_id }) {

    // id 는 각 자격증에 유니크 값 부여
    const certificate_id = uuidv4();
    const newCertificate = { certificate_id, name, organization, description, user_id };

    // db에 저장
    const createdNewCertificate = await Certificate.create({ newCertificate });
    createdNewCertificate.errorMessage = null; 

    return createdNewCertificate;
  }

  // 모든 유저의 자격증 정보조회
  // static async getCertificates() {
  //   const Certificates = await Certificate.findAll();
  //   return Certificates;
  // }

  static async getCertificateList({ user_id }) {
    const certificateList = await Certificate.findByUserId({ user_id });
    return certificateList;
  }

  static async setCertificate({ certificate_id, toUpdate }) {
    // db에 자격증 id가 존재하는지 확인
    let certificate = await Certificate.findByCertificateId( {certificate_id} );

    // 자격증이 없는 경우 오류 메시지
    if (!certificate) {
        const errorMessage =
          "해당하는 자격증 내역이 없습니다. 다시 한 번 확인해 주세요.";
        return { errorMessage };
      }
  
    // 자격증 수정사항 업데이트
    if (toUpdate.name) {
        const fieldToUpdate = "name";
        const newValue = toUpdate.name;
        certificate = await Certificate.update({ certificate_id, fieldToUpdate, newValue });
      }
  
      if (toUpdate.organization) {
        const fieldToUpdate = "organization";
        const newValue = toUpdate.organization;
        certificate = await Certificate.update({ certificate_id, fieldToUpdate, newValue });
      }

      if (toUpdate.description) {
        const fieldToUpdate = "description";
        const newValue = toUpdate.description;
        certificate = await Certificate.update({ certificate_id, fieldToUpdate, newValue });
      }
  
      return certificate;
  }
  
  static async deleteCertificate({ certificate_id }) {
    const isDataDeleted = await Certificate.deleteById( certificate_id );

    if (!isDataDeleted) {
      const errorMessage =
        "자격증이 존재하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return { status : "ok"};
  }
  
}

export { CertificateService };