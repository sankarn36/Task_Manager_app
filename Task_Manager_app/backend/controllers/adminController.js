import cloudinary from "../config/cloudinaryConfig.js";
import AdminTask from "../models/AdminTask.js";
import User from "../models/User.js";

// ✅ Create a new task
export const createAdminTask = async (req, res) => {
  try {
    console.log("📥 Admin task request received:", req.body);
    let imageUrl = "";

    // ✅ Ensure a file was received for upload
    if (req.file) {
      console.log("📤 Uploading file to Cloudinary...");

      try {
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "task_images", // Optional: Organize images in a folder
          resource_type: "image", // Ensure it's treated as an image
        });
        imageUrl = uploadedImage.secure_url;
        console.log("✅ Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError.message);
        return res.status(500).json({ message: "Image upload failed", error: error.message });
      }
    } else {
      console.warn("⚠️ No image file received for upload.");
    }

    // ✅ Extract task details
    const { title, description, priority, endDate, status, assignedEmail, adminId } = req.body;

    const task = new AdminTask({
      title,
      description,
      priority,
      endDate,
      status,
      assignedEmail,
      image: imageUrl || "", // Save the Cloudinary URL in MongoDB
      adminId,
    });

    await task.save();

    console.log("✅ Task successfully saved in DB:", task);
    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllAdminTasks = async (req, res) => {
  try {
    const tasks = await AdminTask.find().populate("adminId", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email"); // Fetch only names and emails
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("userId", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching all tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
