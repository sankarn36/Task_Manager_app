import mongoose from "mongoose";

const UserTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
  endDate: { type: Date, required: true },
  image: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("UserTask", UserTaskSchema);
