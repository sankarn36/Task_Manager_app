import express from "express";
import { createAdminTask, getAllAdminTasks, getAllUsers } from "../controllers/adminController.js";
import { getUserTasks } from "../controllers/taskController.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();



router.post("/tasks/create", upload.single("image"), createAdminTask); 

// Route to get all admin-created tasks
router.get("/tasks", getAllAdminTasks);
router.get("/all-tasks", getUserTasks);
router.get("/users", getAllUsers);

export default router;
