import mongoose from "mongoose";

const AdminTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
  endDate: { type: Date, required: true },
  image: { type: String, default: "" },
  assignedEmail: { type: String, required: true }, // Assign task to user via email
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Track which admin created it
});


export default mongoose.model("AdminTask", AdminTaskSchema);
