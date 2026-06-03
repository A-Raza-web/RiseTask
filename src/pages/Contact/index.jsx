// src/components/Contact.jsx
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setShowSuccess(true); // Show popup
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page-wrapper d-flex justify-content-center align-items-center">
      <div className="w-100 contact-page-container" data-aos="fade-up">
        {/* Success Message */}
        {showSuccess && (
          <div className="alert text-center contact-success-alert" role="alert">
             Message sent successfully!
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2 contact-icon-badge"
          >
            <FaEnvelope style={{ color: "#fff", fontSize: "1.8rem" }} />
          </div>
          <h3 className="fw-bold contact-title">
            Contact Us
          </h3>
          <p className="text-muted contact-subtitle">We'd love to hear from you!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 shadow rounded contact-form-card">
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold contact-form-label">
              <FaUser className="me-2 text-warning" /> Your Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control contact-form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold contact-form-label">
              <FaEnvelope className="me-2 text-warning" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control contact-form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Message */}
          <div className="mb-3">
            <label className="form-label fw-semibold contact-form-label">
              <FaPaperPlane className="me-2 text-warning" /> Your Message
            </label>
            <textarea
              name="message"
              className="form-control contact-form-control"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="btn text-white px-4 py-2 contact-submit-btn"
            >
              <FaPaperPlane className="me-2" /> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
