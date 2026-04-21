import React, { useEffect, useState, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:5000/api/auth/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const navigate = useNavigate();
  
  // Refs for background elements
  const particlesRef = useRef(null);
  const shapesRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    
    // Create floating particles
    const createParticles = () => {
      if (!particlesRef.current) return;
      
      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.width = Math.random() * 6 + 2 + 'px';
          particle.style.height = particle.style.width;
          particle.style.animationDelay = Math.random() * 15 + 's';
          particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
          particlesRef.current.appendChild(particle);
          
          // Remove particle after animation completes
          setTimeout(() => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }, 30000);
        }, i * 300);
      }
    };
    
    // Create geometric shapes
    const createShapes = () => {
      if (!shapesRef.current) return;
      
      const shapes = ['triangle', 'circle', 'square'];
      const shapeCount = 15;
      
      for (let i = 0; i < shapeCount; i++) {
        setTimeout(() => {
          const shape = document.createElement('div');
          const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
          shape.className = `shape ${shapeType}`;
          shape.style.left = Math.random() * 100 + '%';
          shape.style.top = Math.random() * 100 + '%';
          shape.style.animationDelay = Math.random() * 20 + 's';
          shapesRef.current.appendChild(shape);
          
          // Remove shape after animation completes
          setTimeout(() => {
            if (shape.parentNode) {
              shape.parentNode.removeChild(shape);
            }
          }, 40000);
        }, i * 500);
      }
    };
    
    // Initialize background elements
    createParticles();
    createShapes();
    
    // Re-create elements periodically
    const particleInterval = setInterval(createParticles, 30000);
    const shapeInterval = setInterval(createShapes, 40000);
    
    return () => {
      clearInterval(particleInterval);
      clearInterval(shapeInterval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API_URL, { email, password });

      // Success
      setMessage(res.data.message || "Login successful!");
      setMessageType("success");

      // Save JWT Token
      localStorage.setItem("token", res.data.token);
      if (res.data?.userId) {
        localStorage.setItem("userId", res.data.userId);
      }
      localStorage.setItem("userEmail", res.data?.email || email);
      if (typeof res.data?.settings?.darkMode === "boolean") {
        localStorage.setItem("darkMode", JSON.stringify(res.data.settings.darkMode));
        window.dispatchEvent(new Event("dark-mode-sync"));
      }

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Server error. Please try again."
      );
      setMessageType("error");
    }
  };

  return (
    <div className="login-wrapper" data-aos="fade-up">
      {/* Beautiful Animated Background */}
      <div className="auth-background">
        <div className="gradient-bg"></div>
        <div className="particles" ref={particlesRef}></div>
        <div className="geometric-shapes" ref={shapesRef}></div>
        <div className="auth-overlay"></div>
      </div>
      <div className="login-container">
        {/* Top Icon */}
        <div className="login-icon-container">
          <FaSignInAlt size={32} color="#fff" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue your journey</p>

        {/* Login Form Card */}
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn">
              <FaSignInAlt className="btn-icon" />
              Sign In
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
