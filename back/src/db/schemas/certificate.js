import { Schema, model } from "mongoose";

const CertificateSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    certificate_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
      default: "발급기관명을 입력해주세요.",
    },

    description: {
      type: String,
      required: false,
      default: "자격증 상세설명을 입력해주세요.",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CertificateModel = model("Certificate", CertificateSchema);

export { CertificateModel };
