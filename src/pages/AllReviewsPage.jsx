import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaComments,
  FaFilter,
  FaPaperPlane,
  FaStar,
  FaThumbsUp,
  FaTools,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import { useSnackbar } from "../contexts/SnackbarContext";
import "./ReviewPage.css";

const sidebarSections = [
  { id: "all", label: "All Reviews", icon: FaComments },
  { id: "positive", label: "Positive", icon: FaThumbsUp },
  { id: "improvement", label: "Needs Improvement", icon: FaTools },
];

const REVIEW_API_URL = "hhttps://rise-task-server.vercel.app/api/reviews";

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

const AllReviewsPage = () => {
  const { showSnackbar } = useSnackbar();
  const [reviews, setReviews] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

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
      average,
      satisfaction: total > 0 ? Math.round((positive / total) * 100) : 0,
    };
  }, [reviews]);

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
  }, [showSnackbar]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <FaStar key={`${rating}-${index}`} className={index < rating ? "review-star-filled" : "review-star-muted"} />
    ));

  const currentSectionLabel =
    sidebarSections.find((section) => section.id === activeSection)?.label || "All Reviews";

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

            <div className="d-grid mb-3">
              <Link to="/review/submit" className="btn review-submit-btn">
                <FaPaperPlane className="me-2" />
                Submit Review
              </Link>
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
          <div className="card shadow-sm border-0 review-card">
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
        </div>
      </div>
    </div>
  );
};

export default AllReviewsPage;
