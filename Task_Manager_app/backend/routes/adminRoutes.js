import express from "express";
import { createTask, getAllAdminTasks } from "../controllers/adminController.js";

const router = express.Router();

// Route to create a task and assign it to a user
router.post("/tasks/create", createTask);

// Route to get all admin-created tasks
router.get("/tasks", getAllAdminTasks);

export default router;
