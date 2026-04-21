import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBullseye, FaBolt, FaUsers } from "react-icons/fa";
import DotGrid from "./DotGrid";
import "./Hero.css";

const Home = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/home")
      .then((res) => setHomeData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!homeData) return <p className="text-center mt-5">Loading...</p>;

  return (
    // ✅ Hero Section
    <section
      className="text-center py-5 hero-section"
      style={{
        backgroundImage: `url(${homeData.heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="hero-dotgrid-layer" aria-hidden="true">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#6B4528"
          activeColor="#FD7E14"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className="container text-white hero-content">
        {/* Heading */}
        <h1 className="display-4 mb-4">{homeData.heading}</h1>

        {/* Subtext */}
        <p className="lead mb-5">{homeData.subtext}</p>

        {/* Stats */}
        <div className="row mt-4">
          <div className="col-md-4">
            <h3>
              <FaBullseye className="me-2" style={{ color: '#ff5c00' }} />
              {homeData.stats.tasksCompleted}+
            </h3>
            <p>Tasks Completed</p>
          </div>
          <div className="col-md-4">
            <h3>
              <FaBolt className="me-2" style={{ color: '#ff5c00' }} />
              {homeData.stats.productivityBoost}%
            </h3>
            <p>Productivity Boost</p>
          </div>
          <div className="col-md-4">
            <h3>
              <FaUsers className="me-2" style={{ color: '#ff5c00' }} />
              {homeData.stats.happyUsers}+
            </h3>
            <p>Happy Users</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          {homeData.buttons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.link}
              className={`btn btn-lg ${
                btn.type === "filled" ? "btn-orange-filled" : "btn-orange-transition"
              }`}
            >
              {btn.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
