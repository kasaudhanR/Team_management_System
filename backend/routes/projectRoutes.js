import express from "express";
import auth from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

import {
  createProject,
  getProjects,
  addMember,
  deleteProject
} from "../controllers/projectControllers.js";

const router = express.Router();

// 🔐 Admin only
router.post("/", auth, role("admin"), createProject);

// 🔐 Admin + Member
router.get("/", auth, getProjects);

// 🔐 Admin only
router.put("/:id/add-member", auth, role("admin"), addMember);

// 🔐 Admin only
router.delete("/:id", auth, role("admin"), deleteProject);

export default router;