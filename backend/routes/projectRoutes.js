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

router.post("/", auth, role("admin"), createProject);


router.get("/", auth, getProjects);


router.put("/:id/add-member", auth, role("admin"), addMember);


router.delete("/:id", auth, role("admin"), deleteProject);

export default router;