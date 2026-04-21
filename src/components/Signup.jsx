import React, { useEffect, useState, useRef } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FaGoogle, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
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

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://rise-task-server.vercel.app/api/auth/signup", formData);
      setMessage(res.data.message);
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
      setIsError(true);
    }
  };

  // handle Google sign in
  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth integration
    console.log("Google Sign In clicked");
    // window.location.href = "http://localhost:5000/api/auth/google";
  };

  // navigate to login page
  const handleSignInClick = () => {
    navigate("/login");
  };

  return (
    <div className="signup-wrapper" data-aos="fade-up">
      {/* Beautiful Animated Background */}
      <div className="auth-background">
        <div className="gradient-bg"></div>
        <div className="particles" ref={particlesRef}></div>
        <div className="geometric-shapes" ref={shapesRef}></div>
        <div className="auth-overlay"></div>
      </div>
      <div className="signup-container">
        {/* Icon on Top */}
        <div className="signup-icon-container">
          <FaUserPlus size={32} color="#fff" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Join us and start organizing your tasks</p>

        {/* Form Card */}
        <div className="signup-card">
          <form onSubmit={handleSubmit}>
            {/* Name */}
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
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="signup-btn">
              <FaUserPlus className="btn-icon" />
              Sign Up
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

          {/* Sign In Link */}
          <div className="auth-footer">
            <span className="auth-footer-text">Already have an account?</span>
            <button className="signin-link-btn" onClick={handleSignInClick}>
              <FaSignInAlt className="btn-icon" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;