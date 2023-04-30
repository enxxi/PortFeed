import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    project_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
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

const ProjectModel = model("Project", ProjectSchema);

export { ProjectModel };