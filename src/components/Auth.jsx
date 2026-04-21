import React, { useEffect, useState, useRef } from "react";
import { FaSignInAlt, FaUserPlus, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/onlinelogomaker-011226-1832-3129.png";
import "./Auth.css";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
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
          
          setTimeout(() => {
            if (shape.parentNode) {
              shape.parentNode.removeChild(shape);
            }
          }, 40000);
        }, i * 500);
      }
    };
    
    createParticles();
    createShapes();
    
    const particleInterval = setInterval(createParticles, 30000);
    const shapeInterval = setInterval(createShapes, 40000);
    
    return () => {
      clearInterval(particleInterval);
      clearInterval(shapeInterval);
    };
  }, []);

  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  // Reset form when toggling between sign in/up
  useEffect(() => {
    setFormData({ name: "", email: "", password: "" });
    setMessage("");
    setIsError(false);
    setShowPassword(false);
  }, [isSignUp]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        // Sign Up
        const res = await axios.post("https://rise-task-server.vercel.app/api/auth/signup", formData);
        setMessage(res.data.message);
        setIsError(false);
        
        // Switch to sign in after successful signup
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      } else {
        // Sign In
        const res = await axios.post("https://rise-task-server.vercel.app/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        setMessage(res.data.message || "Login successful!");
        setIsError(false);
        
        // Save JWT Token
        localStorage.setItem("token", res.data.token);
        if (res.data?.userId) {
          localStorage.setItem("userId", res.data.userId);
        }
        localStorage.setItem("userEmail", res.data?.email || formData.email);
        if (typeof res.data?.settings?.darkMode === "boolean") {
          localStorage.setItem("darkMode", JSON.stringify(res.data.settings.darkMode));
          window.dispatchEvent(new Event("dark-mode-sync"));
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || `${isSignUp ? 'Signup' : 'Login'} failed`);
      setIsError(true);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
    // TODO: Implement Google OAuth
  };

  return (
    <div className="auth-wrapper" data-aos="fade-up">
      {/* Beautiful Animated Background */}
      <div className="auth-background">
        <div className="gradient-bg"></div>
        <div className="particles" ref={particlesRef}></div>
        <div className="geometric-shapes" ref={shapesRef}></div>
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo-container">
          <img src={logo} alt="Rise Task Logo" className="auth-logo" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="auth-title">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="auth-subtitle">
          {isSignUp ? "Join us and start organizing your tasks" : "Sign in to continue your journey"}
        </p>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Toggle Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              <FaSignInAlt className="tab-icon" />
              Sign In
            </button>
            <button
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              <FaUserPlus className="tab-icon" />
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field - Only for Sign Up */}
            {isSignUp && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input password-input"
                  placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="auth-submit-btn">
              {isSignUp ? <FaUserPlus className="btn-icon" /> : <FaSignInAlt className="btn-icon" />}
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Response message */}
          {message && (
            <div className={`message ${isError ? "error" : "success"}`}>
              {message}
            </div>
          )}

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Google Sign In Button */}
          <button className="google-signin-btn" onClick={handleGoogleSignIn}>
            <FaGoogle className="btn-icon" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
