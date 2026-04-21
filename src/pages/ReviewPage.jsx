import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaCheck,
  FaChartBar,
  FaChevronDown,
  FaComments,
  FaPaperPlane,
  FaFilter,
  FaLayerGroup,
  FaStar,
  FaThumbsUp,
  FaTools,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "../contexts/SnackbarContext";
import "./ReviewPage.css";

const sidebarSections = [
  { id: "all", label: "All Reviews", icon: FaComments },
  { id: "positive", label: "Positive", icon: FaThumbsUp },
  { id: "improvement", label: "Needs Improvement", icon: FaTools },
];

const REVIEW_API_URL = "https://rise-task-server.vercel.app/api/reviews";

const formatReviewDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const normalizeReview = (review) => ({
  id: review._id || review.id,
  name: review.name,
  role: review.role,
  date: review.createdAt ? formatReviewDate(review.createdAt) : review.date,
  rating: Number(review.rating),
  category: review.category || "General",
  comment: review.comment,
});

const ReviewPage = () => {
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const [reviews, setReviews] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
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

  const filteredReviews = useMemo(() => {
    if (activeSection === "positive") {
      return reviews.filter((review) => review.rating >= 4);
    }

    if (activeSection === "improvement") {
      return reviews.filter((review) => review.rating < 4);
    }

    return reviews;
  }, [activeSection, reviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const positive = reviews.filter((review) => review.rating >= 4).length;
    const average =
      total > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
        : "0.0";

    return {
      total,
      positive,
      average,
      satisfaction: total > 0 ? Math.round((positive / total) * 100) : 0,
    };
  }, [reviews]);

  const categoryOptions = ["General", "Planning", "Task Board", "Notifications", "Performance"];

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setReviews([]);
        setIsLoadingReviews(false);
        return;
      }

      try {
        const response = await axios.get(REVIEW_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.success) {
          const incomingReviews = Array.isArray(response.data.data) ? response.data.data : [];
          setReviews(incomingReviews.map(normalizeReview));
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
        showSnackbar("Failed to load reviews.", "error");
        setReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

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

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    const target = document.getElementById(targetId);
    if (!target) return;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <FaStar key={`${rating}-${index}`} className={index < rating ? "review-star-filled" : "review-star-muted"} />
    ));

  const currentSectionLabel =
    sidebarSections.find((section) => section.id === activeSection)?.label || "All Reviews";

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

      const savedReview = normalizeReview(response.data.data);
      setReviews((prev) => [savedReview, ...prev]);
      setActiveSection("all");
      setFormData({
        name: "",
        role: "",
        category: "General",
        rating: 5,
        comment: "",
      });
      showSnackbar(response?.data?.message || "Review submitted successfully.", "success");
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
                <div className="small text-muted">Team feedback overview</div>
              </div>
            </div>

            <ul className="list-unstyled review-menu mb-4">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <li
                    key={section.id}
                    role="button"
                    tabIndex={0}
                    aria-current={isActive ? "true" : undefined}
                    className={`review-menu-item d-flex align-items-center py-2 px-2 ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setActiveSection(section.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveSection(section.id);
                      }
                    }}
                  >
                    <Icon className="me-2" />
                    <span>{section.label}</span>
                  </li>
                );
              })}
            </ul>

            <div className="review-stats-panel">
              <h6 className="mb-3">
                <FaChartBar className="me-2" />
                Quick Snapshot
              </h6>
              <div className="review-stat-row">
                <span>Average Rating</span>
                <strong>{stats.average}/5</strong>
              </div>
              <div className="review-stat-row">
                <span>Total Reviews</span>
                <strong>{stats.total}</strong>
              </div>
              <div className="review-stat-row">
                <span>Satisfaction</span>
                <strong>{stats.satisfaction}%</strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="col-lg-9">
          <div id="all-review" className="card shadow-sm border-0 review-card">
            <div className="card-header review-card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">
                  <FaStar className="me-2" />
                  Task Reviews
                </h5>
                <p className="text-muted small mb-0">Feedback from your latest delivery cycle</p>
              </div>
              <span className="review-filter-badge">
                <FaFilter className="me-2" />
                {currentSectionLabel}
              </span>
            </div>

            <div className="card-body p-4">
              {isLoadingReviews ? (
                <div className="review-empty-state text-center py-5">
                  <FaComments className="mb-2" />
                  <p className="mb-0">Loading reviews...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="review-empty-state text-center py-5">
                  <FaComments className="mb-2" />
                  <p className="mb-0">No reviews in this section yet.</p>
                </div>
              ) : (
                <div className="review-list">
                  {filteredReviews.map((review) => (
                    <article key={review.id} className="review-item">
                      <div className="d-flex justify-content-between align-items-start mb-2 gap-3 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                          <FaUserCircle className="review-user-icon" />
                          <div>
                            <h6 className="mb-0">{review.name}</h6>
                            <p className="small text-muted mb-0">
                              {review.role} | {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="review-stars">{renderStars(review.rating)}</div>
                      </div>

                      <p className="mb-2 review-comment">{review.comment}</p>
                      <span className="review-tag">{review.category}</span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div id="submit-review" className="card shadow-sm border-0 review-submit-card mt-4">
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

export default ReviewPage;
