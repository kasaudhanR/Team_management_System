import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

// 🔐 Admin only
router.post("/", auth, role("admin"), createTask);

// 🔐 All logged users
router.get("/", auth, getTasks);

// 🔐 Assigned member or admin
router.put("/:id", auth, updateTask);

// 🔐 Admin only
router.delete("/:id", auth, role("admin"), deleteTask);

export default router;