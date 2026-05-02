import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 🌐 Global CSS (only reset/base styles)
import "./index.css";

// 🚀 Render App
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);