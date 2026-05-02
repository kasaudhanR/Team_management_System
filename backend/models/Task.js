import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    dueDate: Date
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);