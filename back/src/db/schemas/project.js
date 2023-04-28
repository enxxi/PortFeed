import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // 보류
    // images: {
    //   type: Object,
    //   required: false,
    // },

    description: {
      type: String,
      required: false,
      default: "포트폴리오 상세설명을 추가해주세요.",
    },
  },
  {
    timestamps: true,
  }
);

const ProjectrModel = model("Project", ProjectSchema);

export { ProjectrModel };