import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AOS from "aos";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import Home from "./components/Home";
import SchedulerPage from "./pages/SchedulerPage";
import AITaskForm from "./pages/AITaskForm";
import TeamTasksPage from "./pages/TeamTasksPage";
import AllReviewsPage from "./pages/AllReviewsPage";
import SubmitReviewPage from "./pages/SubmitReviewPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings";
import About from "./components/About";
import Contact from "./components/Contact";
import MyNavbar from "./components/MyNavbar";
import Auth from "./components/Auth";
import Footer from "./components/Homepages/Footer";

function AppContent() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  // Check if current route is login or signup
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/auth";
  const isAuthenticated =
    typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const syncDarkModeFromStorage = () => {
      try {
        const saved = localStorage.getItem("darkMode");
        if (saved != null) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "boolean") {
            setDarkMode(parsed);
          }
        }
      } catch (error) {
        // Silently handle malformed localStorage values
      }
    };

    window.addEventListener("dark-mode-sync", syncDarkModeFromStorage);
    window.addEventListener("storage", syncDarkModeFromStorage);
    return () => {
      window.removeEventListener("dark-mode-sync", syncDarkModeFromStorage);
      window.removeEventListener("storage", syncDarkModeFromStorage);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [darkMode]);

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
      },
      transitions: {
        duration: {
          shortest: 150,
          shorter: 200,
          short: 250,
          standard: 300,
          complex: 375,
          enteringScreen: 225,
          leavingScreen: 195,
        },
      },
    });
  }, [darkMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <div
          className={`min-vh-100 page-transition d-flex flex-column ${
            darkMode ? "bg-dark text-white" : "bg-light text-dark"
          }`}
          data-theme={darkMode ? "dark" : "light"}
        >
          {!isAuthPage && <MyNavbar />}
          <main className="flex-grow-1 d-flex flex-column">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
              <Route path="/add-task" element={<TaskForm />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/scheduler" element={<SchedulerPage />} />
              <Route path="/ai-scheduler" element={<AITaskForm />} />
              <Route path="/team-tasks" element={<TeamTasksPage />} />
              <Route path="/review" element={<AllReviewsPage />} />
              <Route path="/review/all" element={<AllReviewsPage />} />
              <Route path="/review/submit" element={<SubmitReviewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings setDarkMode={setDarkMode} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
            </Routes>
          </main>
          {!isAuthPage && <Footer />}
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
