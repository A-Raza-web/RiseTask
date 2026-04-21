// src/components/About.jsx
import {
  FaReact,
  FaBootstrap,
  FaTasks,
  FaHeart,
  FaRocket,
  FaCheckCircle,
  FaBolt,
  FaUsers,
  FaChartLine,
  FaMobile,
} from "react-icons/fa";
import aboutImage from "../../assets/images/aboutpage.png";
import logo from "../../assets/onlinelogomaker-011226-1832-3129.png";
import riseLogo from "../../assets/images/rise-logo.png";
import riseIcon from "../../assets/images/rise-icon.jpg";
import ImageTrail from "./ImageTrail";
import "./About.css";

function createSymbolBadge(symbolEntity, label, fromColor, toColor) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" rx="34" fill="url(#g)" />
      <circle cx="150" cy="120" r="68" fill="rgba(255,255,255,0.18)" />
      <text x="150" y="139" text-anchor="middle" fill="#ffffff" font-size="68" font-family="Arial, sans-serif">
        ${symbolEntity}
      </text>
      <text x="150" y="238" text-anchor="middle" fill="#ffffff" font-size="30" font-weight="700" font-family="Arial, sans-serif" letter-spacing="1">
        ${label}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const HERO_TRAIL_ITEMS = [
  logo,
  riseLogo,
  riseIcon,
  createSymbolBadge("RT", "RiseTask", "#fd7e14", "#e87211"),
  createSymbolBadge("&#10003;", "Tasks", "#059669", "#10b981"),
  createSymbolBadge("&#128197;", "Planning", "#0ea5e9", "#1d4ed8"),
  createSymbolBadge("&#128276;", "Alerts", "#6366f1", "#4f46e5"),
  createSymbolBadge("&#128200;", "Progress", "#f59e0b", "#ea580c"),
  createSymbolBadge("&#127919;", "Goals", "#ec4899", "#be185d"),
  createSymbolBadge("&#128101;", "Team", "#0891b2", "#0f766e"),
  createSymbolBadge("&#9889;", "Focus", "#facc15", "#f97316"),
];

const About = () => {
  return (
    <div className="about-container">
      {/* Custom Header with Logo */}
      <div className="about-header fade-in-scale">
        <div className="header-logo-section">
          <img src={logo} alt="RiseTask Logo" className="header-logo" />
          <div className="header-text">
            <h2 className="header-title">RiseTask</h2>
            <p className="header-tagline">Your Productivity Partner</p>
          </div>
        </div>
      </div>

      <div className="about-hero fade-in-top">
        <div className="hero-trail-overlay" aria-hidden="true">
          <ImageTrail items={HERO_TRAIL_ITEMS} variant={5} trackOnWindow />
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <img src={logo} alt="RiseTask Logo" className="logo-image" />
          </div>
          <h1 className="hero-title">About RiseTask</h1>
          <p className="hero-subtitle">
            Elevate Your Productivity with Modern Task Management
          </p>
          <p className="hero-trail-hint">Move anywhere in this hero section</p>

          {/* Hero Features Icons */}
          <div className="hero-features">
            <div
              className="hero-feature-item fade-in-scale"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="feature-icon-circle">
                <FaRocket />
              </div>
              <span className="feature-label">Fast & Efficient</span>
            </div>
            <div
              className="hero-feature-item fade-in-scale"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="feature-icon-circle">
                <FaBolt />
              </div>
              <span className="feature-label">Real-time Updates</span>
            </div>
            <div
              className="hero-feature-item fade-in-scale"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="feature-icon-circle">
                <FaUsers />
              </div>
              <span className="feature-label">Team Collaboration</span>
            </div>
            <div
              className="hero-feature-item fade-in-scale"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="feature-icon-circle">
                <FaChartLine />
              </div>
              <span className="feature-label">Progress Tracking</span>
            </div>
            <div
              className="hero-feature-item fade-in-scale"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="feature-icon-circle">
                <FaMobile />
              </div>
              <span className="feature-label">Mobile Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-content">
        <div className="content-card fade-in-scale" style={{ animationDelay: "0.2s" }}>
          <div className="card-image-wrapper">
            <img
              src={aboutImage}
              className="about-image"
              alt="RiseTask - Modern Task Management"
            />
          </div>

          <div className="card-text-content">
            <div className="text-section fade-in-left" style={{ animationDelay: "0.4s" }}>
              <p className="intro-text">
                Welcome to <span className="brand-highlight">RiseTask</span> - a
                powerful, modern task management solution designed to boost your
                productivity and streamline your workflow.
              </p>
            </div>

            <div className="features-section fade-in-left" style={{ animationDelay: "0.6s" }}>
              <h2 className="section-title">
                <FaReact className="title-icon" />
                Technologies Used
              </h2>
              <div className="tech-grid">
                <div className="tech-item">
                  <div className="tech-icon">
                    <FaReact />
                  </div>
                  <div className="tech-content">
                    <h4>React</h4>
                    <p>Fast and interactive user interfaces</p>
                  </div>
                </div>
                <div className="tech-item">
                  <div className="tech-icon">
                    <FaBootstrap />
                  </div>
                  <div className="tech-content">
                    <h4>Bootstrap 5</h4>
                    <p>Responsive design and modern layout</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="features-section fade-in-left" style={{ animationDelay: "0.8s" }}>
              <h2 className="section-title">
                <FaTasks className="title-icon" />
                Key Features
              </h2>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaCheckCircle />
                  </div>
                  <p>Add, update, and delete tasks with ease</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaCheckCircle />
                  </div>
                  <p>Switch between Light and Dark modes</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaCheckCircle />
                  </div>
                  <p>Simple and intuitive navigation</p>
                </div>
              </div>
            </div>

            <div className="footer-section fade-in-left" style={{ animationDelay: "1s" }}>
              <div className="footer-divider"></div>
              <p className="footer-text">
                Developed with <FaHeart className="heart-icon" /> using open-source tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
