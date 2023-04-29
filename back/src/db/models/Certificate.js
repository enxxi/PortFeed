import { CertificateModel } from "../schemas/Certificate";

class Certificate {
  static async create({ newCertificate }) {
    const createdNewCertificate = await CertificateModel.create(newCertificate);
    return createdNewCertificate;
  }

  static async findById({ user_id }) {
    const Certificate = await UserModel.findOne({ user_id });
    return Certificate;
  }

  static async findById({ certificate_id }) {
    const Certificate = await UserModel.findOne({ id:certificate_id });
    return Certificate;
  }

  static async findAll() {
    const Certificates = await CertificateModel.find({});
    return Certificates;
  }

  static async update({ certificate_id, fieldToUpdate, newValue }) {
    const filter = { id: certificate_id };
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
    const deleteResult = await CertificateModel.deleteOne({ id: certificate_id });
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  }
}

export { Certificate };
