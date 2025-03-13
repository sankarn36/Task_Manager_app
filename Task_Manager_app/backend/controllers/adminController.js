import AdminTask from "../models/AdminTask.js";
import UserTask from "../models/Task.js";

// ✅ Create a new task and assign it to a user
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, endDate, assignedEmail, adminId, image } = req.body;

    if (!title || !description || !priority || !status || !endDate || !assignedEmail || !adminId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Save task in the AdminTask collection
    const adminTask = new AdminTask({
      title,
      description,
      priority,
      status,
      endDate,
      assignedEmail,
      adminId,
      image,
    });

    await adminTask.save();

    // ✅ Save task in the UserTask collection (so user can see it)
    const userTask = new UserTask({
      title,
      description,
      priority,
      status,
      endDate,
      assignedEmail,
      assignedByAdmin: true,
      image,
    });

    await userTask.save();

    res.status(201).json({ message: "Task assigned successfully", adminTask, userTask });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Fetch all admin-created tasks
export const getAllAdminTasks = async (req, res) => {
  try {
    const tasks = await AdminTask.find();
    res.json(tasks);
  } catch (error) {
    console.error("❌ Error fetching admin tasks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
