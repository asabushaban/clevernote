import React, { useState, useEffect } from "react";
import "../components/MainPage/MainPage.css";

function Toggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("clevernote-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("clevernote-theme", theme);
  }, [theme]);

  const isChecked = theme === "dark";

  return (
    <div
      className={`toggle-container ${isChecked ? "active" : ""}`}
      onClick={() => setTheme(isChecked ? "light" : "dark")}
      role="button"
      aria-label="Toggle theme"
    >
      <div className={`slider ${isChecked ? "active" : ""}`}></div>
    </div>
  );
}

export default Toggle;
