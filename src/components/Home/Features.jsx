import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fa";
import axios from "axios";

export default function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 loading state add
  const navigate = useNavigate();

useEffect(() => {
  axios
    .get("https://rise-task-server.vercel.app/api/features")
    .then((res) => {
      if (res.data.features && res.data.features.length > 0) {
        setFeatures(res.data.features[0].features);
      } else {
        setFeatures([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching features:", err);
      setLoading(false);
    });
}, []);


  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <section id="features" className="py-5">
      <div className="container">
        <h2 className="text-center mb-5">Why Choose RiseTask?</h2>
        <div className="row">
          {features.map((feature, index) => {
            const Icon = Icons[feature.icon];
            return (
              <div
                key={index}
                className="col-md-3 mb-4"
              >
                <div className="card h-100 text-center border-0 card-hover">
                  <div className="card-body p-4">
                    <div
                      className="mb-3"
                      style={{ fontSize: "3rem", color: "#ff5c00" }}
                    >
                      {Icon && <Icon />}
                    </div>
                    <h5 className="card-title" style={{ color: "#ff5c00" }}>
                      {feature.title}
                    </h5>
                    <p className="card-text text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
