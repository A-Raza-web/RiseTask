import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import "./Testimonial.css";

const getCardsPerView = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1200) return 2;
  return 3;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    axios
      .get("https://rise-task-server.vercel.app/api/testimonials")
      .then((res) => setTestimonials(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching testimonials:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxSlide = Math.max(0, testimonials.length - cardsPerView);

  useEffect(() => {
    if (currentSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    }
  }, [currentSlide, maxSlide]);

  useEffect(() => {
    if (maxSlide === 0) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [maxSlide]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  return (
    <section className="py-5 testimonial-section">
      <div className="container">
        <h2 className="text-center mb-5" data-aos="fade-up">
          What Our Users Say
        </h2>

        {isLoading ? (
          <div className="testimonial-empty">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="testimonial-empty">No testimonials yet.</div>
        ) : (
          <>
            <div
              className="testimonial-slider"
              style={{ "--cards-per-view": cardsPerView }}
              data-aos="fade-up"
            >
              <button
                type="button"
                className="testimonial-nav-btn"
                onClick={handlePrev}
                aria-label="Previous testimonials"
                disabled={maxSlide === 0}
              >
                <FaChevronLeft />
              </button>

              <div className="testimonial-viewport">
                <div
                  className="testimonial-track"
                  style={{ transform: `translateX(-${(currentSlide * 100) / cardsPerView}%)` }}
                >
                  {testimonials.map((t, index) => {
                    const safeRating = Math.max(1, Math.min(5, Number(t.rating) || 5));
                    const cardKey = t._id || `${t.source || "testimonial"}-${index}`;

                    return (
                      <article className="testimonial-slide" key={cardKey}>
                        <div className="card h-100 border-0 card-hover testimonial-card">
                          <div className="card-body text-center p-4">
                            <div className="mb-4">
                              {t.image ? (
                                <img
                                  src={t.image}
                                  alt={t.name}
                                  className="rounded-circle testimonial-avatar"
                                />
                              ) : (
                                <FaUserCircle className="testimonial-avatar-fallback" aria-label="User Avatar" />
                              )}
                            </div>
                            <div className="mb-2 testimonial-stars">
                              {Array.from({ length: safeRating }).map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </div>
                            <p className="card-text mb-4">
                              <FaQuoteLeft className="me-2 text-muted" />
                              {t.message}
                            </p>
                            <footer className="blockquote-footer">
                              <strong>{t.name}</strong>
                              <br />
                              <small className="text-muted">{t.role}</small>
                            </footer>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                className="testimonial-nav-btn"
                onClick={handleNext}
                aria-label="Next testimonials"
                disabled={maxSlide === 0}
              >
                <FaChevronRight />
              </button>
            </div>

            {maxSlide > 0 ? (
              <div className="testimonial-dots">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    type="button"
                    key={`testimonial-dot-${index}`}
                    className={`testimonial-dot ${index === currentSlide ? "active" : ""}`}
                    aria-label={`Go to testimonial slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
