import cloudinary from "../config/cloudinaryConfig.js";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    let image = "";
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path);
      image = uploadedImage.secure_url;
    }

    const { title, description, priority, endDate, status, userId } = req.body;

    const task = new Task({ title, description, priority, endDate, status, image, userId });
    await task.save();

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const tasks = await Task.find({ userId }).select("title description priority endDate status image");

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
