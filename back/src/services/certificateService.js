import { Certificate } from "../db";
import { v4 as uuidv4 } from "uuid";

class CertificateService {
  static async addCertificate({ name, organization, date, description, user_id }) {
    // id 는 각 자격증에 유니크 값 부여
    const certificate_id = uuidv4();
    const newCertificate = {
      certificate_id,
      user_id,
      name,
      date,
      organization,
      description,
    };
    // db에 저장
    const createdNewCertificate = await Certificate.create({ newCertificate });

    return createdNewCertificate;
  }

  static async getCertificate({ certificate_id }) {
    const certificate = await Certificate.findById({ certificate_id });
    if (!certificate) {
      const errorMessage =
        "해당 id를 가진 자격증은 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return certificate;
  }

  static async getCertificateList({ user_id }) {
    const certificates = await Certificate.findByUserId({ user_id });
    return certificates;
  }

  static async setCertificate({ certificate_id, toUpdate }) {
    // db에 자격증 id가 존재하는지 확인
    let certificate = await Certificate.findById(certificate_id);

    // 자격증이 없는 경우 오류 메시지
    if (!certificate) {
      const errorMessage =
        "해당하는 자격증 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const fieldsToUpdate = {
      name: "name",
      organization: "organization",
      description: "description",
      date: "date",
    };

    for (const [field, fieldToUpdate] of Object.entries(fieldsToUpdate)) {
      if (toUpdate[field] || field === "description" || field === "date") {
        const newValue = toUpdate[field];
        certificate = await Certificate.update({
          certificate_id,
          fieldToUpdate,
          newValue,
        });
      }
    }

    return certificate;
  }

  static async deleteCertificate({ certificate_id }) {
    const isDataDeleted = await Certificate.deleteById({ certificate_id });

    if (!isDataDeleted) {
      const errorMessage =
        "해당 id를 가진 자격증이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return { status: "ok" };
  }
}

export { CertificateService };
