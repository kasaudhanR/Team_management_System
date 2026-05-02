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


router.post("/", auth, role("admin"), createTask);


router.get("/", auth, getTasks);


router.put("/:id", auth, updateTask);


router.delete("/:id", auth, role("admin"), deleteTask);

export default router;