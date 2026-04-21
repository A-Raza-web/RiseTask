import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrophy, FaThLarge, FaTh, FaTimes, FaArrowLeft } from "react-icons/fa";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import TaskFilter from "./TaskFilter";
import TaskStats from "./TaskStats";
import TaskItem from "./TaskItem";
import ProgressBar from "./ProgressBar";
import TaskEditForm from "./TaskEditForm";
import MyTasklist from "./MyTasklist";
import ShowCountMenu from "./ShowMenu";
import "./TaskList.css";

const TaskList = () => {
  console.log("TASKLIST COMPONENT MOUNTED");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter states
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Grid Layout states
  const [gridLayout, setGridLayout] = useState(2); // 2, 3, or 4 columns (single view removed)

  // Show count (how many tasks to display)
  const [showCount, setShowCount] = useState("All"); // Number or 'All'
  const showOptions = [5, 10, 20, "All"];
  const API_URL = "http://localhost:5000/api/tasklist";
  const getCurrentUserId = () => localStorage.getItem("userId");

  // Grid Layout Helper
  const getGridClass = () => {
    switch (gridLayout) {
      case 1:
        return "col-12"; // Single column
      case 2:
        return "col-12 col-md-6"; // 2 columns on medium+ screens
      case 3:
        return "col-12 col-md-6 col-lg-4"; // 3 columns on large screens
      case 4:
        return "col-12 col-sm-6 col-md-4 col-lg-3"; // 4 columns on large screens
      default:
        return "col-12";
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        setTasks([]);
        return;
      }

      const res = await axios.get(API_URL, {
        params: { userId },
      });
      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (res.data.success) {
        setTasks(res.data.data);
      } else {
        console.error("Failed to fetch tasks:", res.data.message);
        setTasks([]);
      }
    } catch (err) {
      console.error("Load Error:", err.message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskInState = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleDelete = async (taskId) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      await axios.delete(`${API_URL}/${taskId}`, {
        params: { userId },
      });
      fetchTasks();
    } catch (err) {
      console.error("Delete Error:", err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Search + filter
  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((task) => {
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
      return true; // all
    });

  // Visible tasks according to showCount
  const visibleTasks = showCount === "All" ? filteredTasks : filteredTasks.slice(0, showCount);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="pt-5 container-fluid task-list-container">
        <TaskFilter
          filter={filter}
          setFilter={setFilter}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TaskStats tasks={tasks} />

        <div className="grid-layout-controls-container">
          <div className="grid-layout-controls" role="group" aria-label="Grid layout controls">
            <button
              type="button"
              className={`btn grid-btn ${gridLayout === 2 ? "active" : ""}`}
              onClick={() => setGridLayout(2)}
              title="Two columns view"
            >
              <FaThLarge className="me-2" /> Two
            </button>
            <button
              type="button"
              className={`btn grid-btn ${gridLayout === 3 ? "active" : ""}`}
              onClick={() => setGridLayout(3)}
              title="Three columns view"
            >
              <FaTh className="me-2" /> Three
            </button>
            <button
              type="button"
              className={`btn grid-btn ${gridLayout === 4 ? "active" : ""}`}
              onClick={() => setGridLayout(4)}
              title="Four columns view"
            >
              <TfiLayoutGrid4Alt className="me-2" /> Four
            </button>
          </div>

          <div className="show-right">
            <ShowCountMenu showOptions={showOptions} showCount={showCount} setShowCount={setShowCount} />
          </div>
        </div>

        <MyTasklist
          tasks={visibleTasks}
          getGridClass={getGridClass}
          editId={editId}
          setEditId={setEditId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          updateTaskInState={updateTaskInState}
          API_URL={API_URL}
          handleDelete={handleDelete}
        />

        {tasks.length > 0 && <ProgressBar tasks={tasks} />}
      </div>
    </div>
  );
};

export default TaskList;
