import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaChevronDown,
  FaComments,
  FaLayerGroup,
  FaList,
  FaPaperPlane,
  FaStar,
} from "react-icons/fa";
import axios from "axios";
import { useSnackbar } from "../contexts/SnackbarContext";
import "./ReviewPage.css";

const REVIEW_API_URL = "https://rise-task-server.vercel.app/api/reviews";
const categoryOptions = ["General", "Planning", "Task Board", "Notifications", "Performance"];

const SubmitReviewPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const categoryMenuRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    category: "General",
    rating: 5,
    comment: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategorySelect = (value) => {
    handleInputChange("category", value);
    setIsCategoryMenuOpen(false);
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.role.trim()) nextErrors.role = "Role is required";
    if (!formData.comment.trim()) {
      nextErrors.comment = "Review comment is required";
    } else if (formData.comment.trim().length < 15) {
      nextErrors.comment = "Comment should be at least 15 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showSnackbar("Please complete all required fields.", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Please sign in again.", "warning");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        rating: Number(formData.rating),
        category: formData.category,
        comment: formData.comment.trim(),
      };

      const response = await axios.post(REVIEW_API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to submit review");
      }

      setFormData({
        name: "",
        role: "",
        category: "General",
        rating: 5,
        comment: "",
      });
      showSnackbar(response?.data?.message || "Review submitted successfully.", "success");
      navigate("/review/all");
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Failed to submit review";
      showSnackbar(message, "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container mt-4 review-page">
      <div className="row g-4">
        <div className="col-lg-3">
          <aside className="review-sidebar p-3">
            <div className="review-sidebar-header d-flex align-items-center mb-3">
              <div className="review-sidebar-icon me-2">
                <FaComments />
              </div>
              <div>
                <div className="fw-bold">Review Center</div>
                <div className="small text-muted">Share your feedback</div>
              </div>
            </div>

            <div className="list-unstyled review-menu mb-3">
              <Link
                to="/review/all"
                className="review-menu-item d-flex align-items-center py-2 px-2"
                style={{ textDecoration: "none" }}
              >
                <FaList className="me-2" />
                <span>All Reviews</span>
              </Link>
              <div className="review-menu-item d-flex align-items-center py-2 px-2 active">
                <FaPaperPlane className="me-2" />
                <span>Submit Review</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="col-lg-9">
          <div className="card shadow-sm border-0 review-submit-card">
            <div className="card-header review-card-header">
              <h5 className="mb-1">
                <FaPaperPlane className="me-2" />
                Submit Your Review
              </h5>
              <p className="text-muted small mb-0">
                Share your feedback so the team can improve the product experience.
              </p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit} className="review-submit-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="reviewName" className="form-label">
                      Name
                    </label>
                    <input
                      id="reviewName"
                      type="text"
                      className="form-control review-input"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(event) => handleInputChange("name", event.target.value)}
                    />
                    {errors.name ? <small className="text-danger d-block mt-1">{errors.name}</small> : null}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="reviewRole" className="form-label">
                      Role
                    </label>
                    <input
                      id="reviewRole"
                      type="text"
                      className="form-control review-input"
                      placeholder="e.g. Designer, Developer"
                      value={formData.role}
                      onChange={(event) => handleInputChange("role", event.target.value)}
                    />
                    {errors.role ? <small className="text-danger d-block mt-1">{errors.role}</small> : null}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="reviewCategory" className="form-label">
                      Category
                    </label>
                    <div className="review-category-dropdown" ref={categoryMenuRef}>
                      <button
                        id="reviewCategory"
                        type="button"
                        className={`review-category-trigger review-input ${
                          isCategoryMenuOpen ? "open" : ""
                        }`}
                        aria-haspopup="listbox"
                        aria-expanded={isCategoryMenuOpen}
                        aria-controls="reviewCategoryMenu"
                        onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                      >
                        <span className="review-category-icon" aria-hidden="true">
                          <FaLayerGroup />
                        </span>
                        <span className="review-category-label">{formData.category}</span>
                        <FaChevronDown
                          className={`review-category-chevron ${isCategoryMenuOpen ? "open" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      <ul
                        id="reviewCategoryMenu"
                        className={`review-category-menu ${isCategoryMenuOpen ? "show" : ""}`}
                        role="listbox"
                        aria-label="Category options"
                      >
                        {categoryOptions.map((option) => {
                          const isSelected = formData.category === option;
                          return (
                            <li key={option} role="none">
                              <button
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`review-category-item ${isSelected ? "active" : ""}`}
                                onClick={() => handleCategorySelect(option)}
                              >
                                <span>{option}</span>
                                {isSelected ? <FaCheck className="review-category-check" /> : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label d-block">Rating</label>
                    <div className="review-rating-picker">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`rating-star-btn ${Number(formData.rating) >= value ? "active" : ""}`}
                          onClick={() => handleInputChange("rating", value)}
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        >
                          <FaStar />
                        </button>
                      ))}
                      <span className="rating-value ms-2">{formData.rating}/5</span>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="reviewComment" className="form-label">
                      Review Comment
                    </label>
                    <textarea
                      id="reviewComment"
                      className="form-control review-input"
                      rows={4}
                      placeholder="Write your feedback..."
                      value={formData.comment}
                      onChange={(event) => handleInputChange("comment", event.target.value)}
                    />
                    {errors.comment ? (
                      <small className="text-danger d-block mt-1">{errors.comment}</small>
                    ) : (
                      <small className="text-muted d-block mt-1">Minimum 15 characters</small>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button type="submit" className="btn review-submit-btn" disabled={isSubmittingReview}>
                    <FaPaperPlane className="me-2" />
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
