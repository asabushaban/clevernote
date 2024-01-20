import React, { useState, useEffect } from "react";
import "../components/MainPage/MainPage.css";

function Toggle() {
  const [theme, setTheme] = useState("light");
  const [isChecked, setIsChecked] = useState(theme === "dark");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    setIsChecked(theme === "dark");
  }, [theme]);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
    toggleTheme();
  };

  return (
    <div
      className={`toggle-container ${isChecked ? "active" : ""}`}
      onClick={toggleSwitch}
    >
      <div className={`slider ${isChecked ? "active" : ""}`}></div>
    </div>
  );
}

export default Toggle;
