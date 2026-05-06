import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaInfoCircle,
  FaChartBar,
  FaCogs,
  FaEnvelope,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaList,
  FaRegStar
} from "react-icons/fa";
import logo from "../assets/onlinelogomaker-011226-1832-3129.png";
import NotificationCenter from "./NotificationCenter";
import './MyNavbar.css';

const MyNavbar = () => {
  const navigate = useNavigate();

  const getUserEmail = () => {
    if (typeof window === "undefined") return "user@gmail.com";

    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) return storedEmail;

    const token = localStorage.getItem("token");
    if (!token) return "user@gmail.com";

    try {
      const payloadPart = token.split(".")[1];
      if (!payloadPart) return "user@gmail.com";

      const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(normalized));
      return decoded?.email || decoded?.user?.email || "user@gmail.com";
    } catch (error) {
      return "user@gmail.com";
    }
  };

  const isAuthenticated =
    typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
  const userEmail = isAuthenticated ? getUserEmail() : "";
  const userName = userEmail.includes("@") ? userEmail.split("@")[0] : "Profile User";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
    }
    navigate("/");
  };

  return (
    <Navbar expand="lg" sticky="top" className="shadow-sm site-navbar">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand-custom"
        >
          <img
            src={logo}
            alt="Rise Task Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        {isAuthenticated ? (
          <>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto">
                
                <Nav.Link as={Link} to="/dashboard">
                  <FaChartBar className="me-1" style={{ color: "#fd7e14" }} /> Dashboard
                </Nav.Link>
                {/* Change "Tasks" from a single link to a dropdown menu */}
                <NavDropdown title={
                  <span>
                    <FaTasks className="me-1" style={{ color: "#fd7e14" }} /> Tasks
                  </span>
                } id="tasks-dropdown">
                  <NavDropdown.Item as={Link} to="/add-task">
                    <FaPlusCircle className="me-1" style={{ color: "#fd7e14" }} /> Add Task
                  </NavDropdown.Item>
                   <NavDropdown.Item as={Link} to="/tasks">
                    <FaList className="me-1" style={{ color: "#fd7e14" }} /> View Tasks
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title={
                    <span>
                      <FaRegStar className="me-1" style={{ color: "#fd7e14" }} /> Review
                    </span>
                  }
                  id="review-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/review/submit">
                    <FaPlusCircle className="me-1" style={{ color: "#fd7e14" }} /> Submit Review
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/review/all">
                    <FaList className="me-1" style={{ color: "#fd7e14" }} /> All Reviews
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/settings">
                  <FaCogs className="me-1" style={{ color: "#fd7e14" }} /> Settings
                </Nav.Link>
                <Nav.Link as={Link} to="/about">
                  <FaInfoCircle className="me-1" style={{ color: "#fd7e14" }} /> About
                </Nav.Link>
                <Nav.Link as={Link} to="/contact">
                  <FaEnvelope className="me-1" style={{ color: "#fd7e14" }} /> Contact
                </Nav.Link>
              </Nav>
              <Nav className="d-flex align-items-center">
                <div className="me-3"></div>
                <NotificationCenter />
                <NavDropdown
                  align="end"
                  id="profile-dropdown"
                  className="profile-dropdown"
                  title={
                    <span className="profile-circle-btn" aria-label="Profile menu">
                      <FaUserCircle />
                    </span>
                  }
                >
                  <div className="profile-dropdown-header px-3 py-2">
                    <div className="profile-header-icon">
                      <FaUserCircle />
                    </div>
                    <div className="profile-header-meta">
                      <div className="profile-header-name">{userName}</div>
                      <div className="profile-header-email">{userEmail}</div>
                    </div>
                  </div>

                  <NavDropdown.Divider />

                  <NavDropdown.Item as={Link} to="/profile">
                    <FaUserCircle className="me-2" /> Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/settings">
                    <FaCogs className="me-2" /> Settings
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={handleLogout} className="profile-logout-item">
                    <FaSignOutAlt className="me-2" /> Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
         <Nav className="ms-auto d-flex align-items-center auth-nav-actions">
          <Nav.Link 
              as={Link} 
              to="/login" 
              className="signin-nav-btn d-none d-lg-flex align-items-center"
            >
              <FaSignInAlt /> Sign In
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" className="signup-nav-btn">
              <FaUserPlus /> Sign Up
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
