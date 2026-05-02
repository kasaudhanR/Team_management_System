import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

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
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "done").length;
  const pending = tasks.filter(t => t.status !== "done").length;

  const today = new Date();
  const overdue = tasks.filter(
    t => new Date(t.dueDate) < today && t.status !== "done"
  ).length;

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Dashboard</h1>

        
        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <h3>Total Tasks</h3>
            <p>{total}</p>
          </div>

          <div className={styles.card}>
            <h3>Completed</h3>
            <p className={styles.green}>{completed}</p>
          </div>

          <div className={styles.card}>
            <h3>Pending</h3>
            <p className={styles.orange}>{pending}</p>
          </div>

          <div className={styles.card}>
            <h3>Overdue</h3>
            <p className={styles.red}>{overdue}</p>
          </div>

          <div className={styles.card}>
            <h3>Projects</h3>
            <p>{projects.length}</p>
          </div>
        </div>

        
        <div className={styles.section}>
          <h2>Recent Tasks</h2>

          <div className={styles.taskGrid}>
            {tasks.slice(0, 6).map(task => (
              <div key={task._id} className={styles.taskCard}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <div className={styles.meta}>
                  <span>{task.projectId?.title}</span>
                  <span className={styles.status}>{task.status}</span>
                </div>

                <p className={styles.date}>
                  Due: {task.dueDate?.slice(0, 10)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}