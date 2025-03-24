import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    console.log("📥 Request received:", req.body);

    let imageUrl = req.body.image || ""; // ✅ Use the Cloudinary URL from frontend

    const { title, description, priority, endDate, status, userId } = req.body;

    const task = new Task({ title, description, priority, endDate, status, image: imageUrl, userId });
    await task.save();

    console.log("✅ Task successfully saved in DB:", task);
    res.status(201).json({ message: "Task created", task });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getAllTasks = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const tasks = await Task.find({ userId }).select("_id title description priority endDate status image");

    console.log

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const tasks = await Task.find({ assignedEmail: userId }).populate("userId", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching user tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Ensure all fields remain intact
    task.status = status || task.status;
    task.title = task.title || req.body.title;
    task.description = task.description || req.body.description;
    task.priority = task.priority || req.body.priority;
    task.endDate = task.endDate || req.body.endDate;

    await task.save();
    res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
