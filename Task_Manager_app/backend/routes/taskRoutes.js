import express from "express";
import { createTask, deleteTask, getAllTasks } from "../controllers/taskController.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = express.Router();

router.post("/create", upload.single("image"), createTask);
router.post("/all", getAllTasks);
router.delete("/delete/:taskId", deleteTask);

export default router;
