import React, { useState, useEffect } from "react";
import "../components/MainPage/MainPage.css";

function Toggle({ compact = false }) {
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
    <button
      type="button"
      className={`themeToggleButton${compact ? " themeToggleButton--compact" : ""}`}
      onClick={() => setTheme(isChecked ? "light" : "dark")}
      aria-label={`Switch to ${isChecked ? "light" : "dark"} mode`}
      title={`Switch to ${isChecked ? "light" : "dark"} mode`}
    >
      <span className="themeToggleGlyph" aria-hidden="true">
        {isChecked ? "☾" : "☀"}
      </span>
      {!compact && (
        <span className="themeToggleText">{isChecked ? "Dark" : "Light"}</span>
      )}
    </button>
  );
}

export default Toggle;
