import express from "express";
import { createAdminTask, getAllUsers, getTasksByAdminForUser, getUserTasks } from "../controllers/adminController.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();



router.post("/tasks/create", upload.single("image"), createAdminTask); 

// Route to get all admin-created tasks
router.post("/admin-tasks", getTasksByAdminForUser);
router.get("/user-tasks", getUserTasks);
router.get("/users", getAllUsers);

export default router;
