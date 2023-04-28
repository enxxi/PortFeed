import { Schema, model } from "mongoose";

const UserCertificateSchema = new Schema(
  { 
    user_id: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: true,
      default: "발급기관명을 입력해주세요."
    },
    description: {
      type: String,
      required: false,
      default: "자격증 상세설명을 입력해주세요."
    }

    },
  {
    timestamps: true,
  }
);

const UserCertificateModel = model("UserCertificate", UserCertificateSchema);

export { UserCertificateModel };
