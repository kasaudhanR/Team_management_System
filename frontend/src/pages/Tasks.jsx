import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import styles from "./Tasks.module.css";

export default function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    dueDate: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [taskRes, projectRes] = await Promise.all([
      API.get("/tasks"),
      API.get("/projects")
    ]);

    setTasks(taskRes.data);
    setProjects(projectRes.data);

    try {
      const userRes = await API.get("/users");
      setUsers(userRes.data);
    } catch {
      console.log("Users API missing");
    }
  };

  // ➕ CREATE TASK
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title || !form.projectId || !form.assignedTo) {
      return setError("All required fields missing");
    }

    await API.post("/tasks", form);

    setForm({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      dueDate: ""
    });

    setError("");
    fetchData();
  };

  // 🔄 UPDATE STATUS
  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchData();
  };

  // ❌ DELETE TASK
  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchData();
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Task Manager</h1>

        {error && <p className={styles.error}>{error}</p>}

        {/* CREATE TASK */}
        {user?.role === "admin" && (
        <div className={styles.formCard}>
          <h2>Create Task</h2>

          <form onSubmit={handleCreate} className={styles.form}>
            <input
              placeholder="Task Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.projectId}
              onChange={(e) =>
                setForm({ ...form, projectId: e.target.value })
              }
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <select
              value={form.assignedTo}
              onChange={(e) =>
                setForm({ ...form, assignedTo: e.target.value })
              }
            >
              <option value="">Assign User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />

            <button>Create Task</button>
          </form>
        </div>
        )}

        {/* TASK LIST */}
        <div className={styles.grid}>
          {tasks.map((task) => (
            <div key={task._id} className={styles.card}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <div className={styles.meta}>
                <span>{task.projectId?.title}</span>
                <span>{task.assignedTo?.name}</span>
              </div>

              <div className={styles.statusBox}>
                <span className={`${styles.status} ${styles[task.status]}`}>
                  {task.status}
                </span>
              </div>

              <p className={styles.date}>
                Due: {task.dueDate?.slice(0, 10)}
              </p>

              <div className={styles.actions}>
                <button onClick={() => updateStatus(task._id, "todo")}>
                  Todo
                </button>
                <button onClick={() => updateStatus(task._id, "in-progress")}>
                  Progress
                </button>
                <button onClick={() => updateStatus(task._id, "done")}>
                  Done
                </button>
              </div>
            {user?.role === "admin" && (
              <button
                className={styles.delete}
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            )}  
            </div>
          ))}
        </div>
      </div>
    </>
  );
}