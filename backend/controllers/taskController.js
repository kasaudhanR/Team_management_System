import Task from "../models/Task.js";
import Project from "../models/Project.js";

// ✅ CREATE TASK (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    // Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      dueDate
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET TASKS (Admin sees all, Member sees assigned)
export const getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "member") {
      filter.assignedTo = req.user.id;
    }

    // Optional: filter by project
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ UPDATE TASK (status change)
export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // Member can only update their own task
    if (
      req.user.role === "member" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    task.status = status || task.status;
    await task.save();

    res.json(task);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ DELETE TASK (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};