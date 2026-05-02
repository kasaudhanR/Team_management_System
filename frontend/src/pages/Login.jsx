import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Basic validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      // (Optional) store user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.msg || "Login successful");

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.linkText}>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}