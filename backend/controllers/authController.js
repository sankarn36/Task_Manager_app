import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

// ✅ User/Admin Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "user"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'user'" });
    }

    const Model = role.toLowerCase() === "admin" ? Admin : User;
    const existingUser = await Model.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Model({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ User/Admin Login
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "user"].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'user'" });
    }

    const Model = role.toLowerCase() === "admin" ? Admin : User;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
