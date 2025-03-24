import Admin from "../models/Admin.js"; // ✅ Import Admin model
import AdminTask from "../models/AdminTask.js";
import User from "../models/User.js";

// ✅ Create a new task
export const createAdminTask = async (req, res) => {
  try {
    console.log("📩 Task Data Received:", req.body);
    console.log("📷 Image Received:", req.file);

    const { title, description, priority, endDate, status, assignedEmail, adminId } = req.body;
    

    // ✅ Fetch the admin details using adminId
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (!title || !description || !priority || !endDate || !status || !assignedEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const assignedUser = await User.findOne({ email: assignedEmail });
    if (!assignedUser) {
      return res.status(404).json({ error: "Assigned user not found" });
    }

    // ✅ Create a new task object
    const newTask = new AdminTask({
      title,
      description,
      priority,
      endDate,
      status,
      assignedEmail: assignedUser._id,
      adminId, // ✅ Store admin reference
      image: req.file ? req.file.path : "", // Save image path if uploaded
    });

    // ✅ Save task to database
    await newTask.save();
    
    console.log("✅ Task saved successfully:", newTask);
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all users (For Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email"); // Fetch only names and emails
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get tasks assigned by the admin for a specific user
export const getTasksByAdminForUser = async (req, res) => {
  try {
    console.log("📩 Received request body:", req.body);
    console.log("🔑 Authenticated User:", req.user);

    const { userId } = req.body;
    const adminId = req.user ? req.user.id : null; // Prevent crash

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized: Admin ID is missing" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // ✅ Find tasks assigned by this admin to the user and populate admin details
    const tasks = await AdminTask.find({ assignedUser: userId, adminId })
      .populate("adminId", "name email") // Fetch admin's name & email
      .populate("assignedUser", "name email"); // Fetch user's name & email

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
};

// ✅ Get all tasks assigned to a specific user
export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // ✅ Find tasks assigned to this user and populate admin details
    const tasks = await AdminTask.find({ assignedUser: userId })
      .populate("adminId", "name email") // Fetch admin's name & email
      .populate("assignedUser", "name email"); // Fetch user's name & email

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching user tasks:", error);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
};
