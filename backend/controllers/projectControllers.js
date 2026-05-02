import Project from "../models/Project.js";

// ✅ CREATE PROJECT (Admin only)
export const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const project = await Project.create({
      title,
      description,
      members,
      createdBy: req.user.id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ GET PROJECTS (Admin + Member)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id }
      ]
    })
    .populate("createdBy", "name email")
    .populate("members", "name email");

    res.json(projects);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ ADD MEMBER TO PROJECT (Admin only)
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // avoid duplicate member
    if (project.members.includes(userId)) {
      return res.status(400).json({ msg: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ DELETE PROJECT (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({ msg: "Project deleted" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};