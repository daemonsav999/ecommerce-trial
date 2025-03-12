import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Dark Mode Toggle
const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-700 text-white rounded-md">
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

// Notification Bell Component
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from backend
    const eventSource = new EventSource("http://localhost:5000/api/notifications");
    eventSource.onmessage = (event) => {
      setNotifications((prev) => [...prev, JSON.parse(event.data)]);
    };
    return () => eventSource.close();
  }, []);

  return (
    <div className="relative">
      <button className="relative bg-gray-800 text-white p-2 rounded-full">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
    </div>
  );
};

// Navbar Component
const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-5">
        <Link to="/" className="text-2xl font-bold">🛍️ MyShop</Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="hover:underline">🛒 Cart</Link>
          <Link to="/profile" className="hover:underline">👤 Profile</Link>
          <Link to="/leaderboard" className="hover:underline">🏆 Leaderboard</Link>
          <DarkModeToggle />
          <NotificationBell />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
