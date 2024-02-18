import { Schema, Types, model } from "mongoose";

const tasksSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "Users", required: true },
    assignTo: { type: Types.ObjectId, ref: "Users", required: true },
    deadline: { type: Date, required: true },
    taskAttachment: { secure_url: String, public_id: String },
  },
  { timestamps: true }
);

export const Task = model("tasks", tasksSchema);
