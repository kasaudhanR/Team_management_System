import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import styles from "./Projects.module.css";

export default function Projects() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      console.log("Users API missing");
    }
  };

  // ➕ CREATE PROJECT
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title) return setError("Title required");

    await API.post("/projects", form);

    setForm({ title: "", description: "" });
    setError("");
    fetchProjects();
  };

  // ➕ ADD MEMBER
  const handleAddMember = async () => {
    if (!selectedProject || !selectedUser) {
      return setError("Select project & user");
    }

    await API.put(`/projects/${selectedProject}/add-member`, {
      userId: selectedUser
    });

    setSelectedProject("");
    setSelectedUser("");
    fetchProjects();
  };

  // ❌ DELETE PROJECT
  const handleDelete = async (id) => {
    await API.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Projects</h1>

        {error && <p className={styles.error}>{error}</p>}

        {/* CREATE PROJECT */}
       {user?.role === "admin" && ( 
        <div className={styles.section}>
          <h2>Create Project</h2>

          <form className={styles.form} onSubmit={handleCreate}>
            <input
              placeholder="Project Title"
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

            <button>Create</button>
          </form>
        </div>
       )}


        {/* ADD MEMBER */}

        {user?.role === "admin" && (
        <div className={styles.section}>
          <h2>Add Member</h2>

          <div className={styles.memberBox}>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <button onClick={handleAddMember}>Add</button>
          </div>
        </div>
        )}

        {/* PROJECT LIST */}
        <div className={styles.grid}>
          {projects.map((p) => (
            <div key={p._id} className={styles.card}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>

              <div className={styles.members}>
                <strong>Members:</strong>
                <div className={styles.memberList}>
                  {p.members?.length > 0
                    ? p.members.map((m) => (
                        <span key={m._id}>{m.name}</span>
                      ))
                    : "No members"}
                </div>
              </div>
            {user?.role === "admin" && (
              <button
                className={styles.delete}
                onClick={() => handleDelete(p._id)}
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