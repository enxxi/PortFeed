import { CertificateModel } from "../schemas/certificate";

class Certificate {
  static async create({ newCertificate }) {
    const createdNewCertificate = await CertificateModel.create(newCertificate);
    return createdNewCertificate;
  }

  static async findById({ certificate_id }) {
    const certificate = await CertificateModel.findOne({ id: certificate_id });
    return certificate;
  }

  static async findByUserId({ user_id }) {
    const certificates = await CertificateModel.find({ user_id });
    return certificates;
  }

  static async update({ certificate_id, fieldToUpdate, newValue }) {
    const filter = { certificate_id };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };

    const updatedCertificate = await CertificateModel.findOneAndUpdate(
      filter,
      update,
      option
    );

    return updatedCertificate;
  }

  static async deleteById({ certificate_id }) {
    const deleteResult = await CertificateModel.deleteOne({ certificate_id });
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  }
}

export { Certificate };
