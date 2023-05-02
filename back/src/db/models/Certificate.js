import { CertificateModel } from "../schemas/certificate";

class Certificate {
  static async create({ newCertificate }) {
    const createdNewCertificate = await CertificateModel.create(newCertificate);
    return createdNewCertificate;
  }

  static async findByUserId({ user_id }) {
    const Certificate = await CertificateModel.find({ user_id });
    return Certificate;
  }

  static async findByCertificateId({ certificate_id }) {
    const Certificate = await CertificateModel.findOne({ certificate_id });
    return Certificate;
  }

  static async findAll() {
    const Certificates = await CertificateModel.find({});
    return Certificates;
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
