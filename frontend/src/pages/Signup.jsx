import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import styles from "./Signup.module.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
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
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/signup", form);

      alert(res.data.msg || "Signup successful");

      navigate("/"); // redirect to login

    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Account</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />

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

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className={styles.linkText}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}