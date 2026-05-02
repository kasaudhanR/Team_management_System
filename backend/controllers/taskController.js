import Task from "../models/Task.js";
import Project from "../models/Project.js";


export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ msg: "Required fields missing" });
    }


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


export const getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "member") {
      filter.assignedTo = req.user.id;
    }

  
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


export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    
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