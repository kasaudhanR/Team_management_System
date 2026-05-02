import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();

  // 🧠 Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      {/* 🔹 Logo */}
      <h2 className={styles.logo}>TaskManager</h2>

      {/* 🔹 Links */}
      <div className={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </div>

      {/* 🔹 Right Section */}
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.user}>
              {user.name} ({user.role})
            </span>

            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}