import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaChartLine,
  FaCogs,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaShieldAlt,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { useSnackbar } from "../contexts/SnackbarContext";
import "./ProfilePage.css";

const profileSections = [
  { id: "overview", label: "Overview", icon: FaUser },
  { id: "account", label: "Account", icon: FaCogs },
  { id: "security", label: "Security", icon: FaShieldAlt },
];

const getUserEmail = () => {
  if (typeof window === "undefined") return "user@gmail.com";

  const storedEmail = localStorage.getItem("userEmail");
  if (storedEmail) return storedEmail;

  const token = localStorage.getItem("token");
  if (!token) return "user@gmail.com";

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "user@gmail.com";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return decoded?.email || decoded?.user?.email || "user@gmail.com";
  } catch (error) {
    return "user@gmail.com";
  }
};

const PROFILE_API_URL = "https://rise-task-server.vercel.app/api/profile";

const ProfilePage = () => {
  const { showSnackbar } = useSnackbar();
  const [activeSection, setActiveSection] = useState("overview");

  const userEmail = useMemo(() => getUserEmail(), []);
  const defaultName = userEmail.includes("@") ? userEmail.split("@")[0] : "Profile User";

  const [profile, setProfile] = useState({
    fullName: defaultName,
    email: userEmail,
    role: "Task Manager",
    phone: "+1 000 000 0000",
    location: "New York, USA",
    bio: "I use RiseTask daily to organize my goals and improve team productivity.",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsProfileLoading(false);
        return;
      }

      try {
        const response = await axios.get(PROFILE_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.profile) {
          setProfile((prev) => ({ ...prev, ...response.data.profile }));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        showSnackbar("Could not load saved profile. Showing local values.", "warning");
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, [showSnackbar]);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Please sign in again.", "warning");
      return;
    }

    if (!profile.fullName?.trim() || !profile.email?.trim()) {
      showSnackbar("Full name and email are required.", "warning");
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await axios.put(PROFILE_API_URL, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedProfile = response?.data?.profile;
      if (updatedProfile) {
        setProfile((prev) => ({ ...prev, ...updatedProfile }));
        localStorage.setItem("userEmail", updatedProfile.email);
      }

      showSnackbar(response?.data?.message || "Profile details saved successfully.", "success");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to save profile. Please try again.";
      showSnackbar(message, "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      showSnackbar("Please fill all password fields.", "warning");
      return;
    }
    if (security.newPassword.length < 6) {
      showSnackbar("New password must be at least 6 characters.", "warning");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      showSnackbar("New password and confirm password do not match.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Please sign in again.", "warning");
      return;
    }

    setIsSavingSecurity(true);
    try {
      const response = await axios.put(
        `${PROFILE_API_URL}/password`,
        {
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordVisibility({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });

      showSnackbar(response?.data?.message || "Password updated successfully.", "success");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update password. Please try again.";
      showSnackbar(message, "error");
    } finally {
      setIsSavingSecurity(false);
    }
  };

  return (
    <div className="container mt-4 profile-page">
      <div className="row g-4">
        <div className="col-lg-3">
          <aside className="profile-sidebar p-3">
            <div className="profile-head text-center">
              <FaUserCircle className="profile-avatar-icon mb-2" />
              <h5 className="mb-0 text-capitalize">{profile.fullName}</h5>
              <p className="text-muted small mb-0">{profile.email}</p>
            </div>

            <ul className="list-unstyled profile-menu mt-4 mb-0">
              {profileSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <li
                    key={section.id}
                    role="button"
                    tabIndex={0}
                    aria-current={isActive ? "true" : undefined}
                    className={`profile-menu-item d-flex align-items-center py-2 px-2 ${
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
          </aside>
        </div>

        <div className="col-lg-9">
          <div className="card shadow-sm border-0 profile-card">
            <div className="card-header profile-card-header">
              <h5 className="mb-1">My Profile</h5>
              <p className="text-muted small mb-0">Manage your personal account settings</p>
            </div>

            <div className="card-body p-4">
              {isProfileLoading ? (
                <div className="alert alert-info py-2">Loading saved profile...</div>
              ) : null}

              {activeSection === "overview" ? (
                <div className="profile-overview">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="overview-item">
                        <FaEnvelope className="me-2" />
                        <span>{profile.email}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="overview-item">
                        <FaPhone className="me-2" />
                        <span>{profile.phone}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="overview-item">
                        <FaMapMarkerAlt className="me-2" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="overview-item">
                        <FaUser className="me-2" />
                        <span>{profile.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-bio-box mb-4">
                    <h6>Bio</h6>
                    <p className="mb-0">{profile.bio}</p>
                  </div>

                  <div className="profile-stats-grid">
                    <div className="profile-stat-tile">
                      <FaChartLine className="mb-2" />
                      <h6 className="mb-1">96%</h6>
                      <p className="mb-0 small text-muted">Task completion</p>
                    </div>
                    <div className="profile-stat-tile">
                      <FaChartLine className="mb-2" />
                      <h6 className="mb-1">34</h6>
                      <p className="mb-0 small text-muted">Tasks this month</p>
                    </div>
                    <div className="profile-stat-tile">
                      <FaChartLine className="mb-2" />
                      <h6 className="mb-1">12</h6>
                      <p className="mb-0 small text-muted">Team updates</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeSection === "account" ? (
                <div className="profile-account-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control profile-input"
                        value={profile.fullName}
                        onChange={(event) => handleProfileChange("fullName", event.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control profile-input"
                        value={profile.email}
                        onChange={(event) => handleProfileChange("email", event.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-control profile-input"
                        value={profile.role}
                        onChange={(event) => handleProfileChange("role", event.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control profile-input"
                        value={profile.phone}
                        onChange={(event) => handleProfileChange("phone", event.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control profile-input"
                        value={profile.location}
                        onChange={(event) => handleProfileChange("location", event.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Bio</label>
                      <textarea
                        rows={4}
                        className="form-control profile-input"
                        value={profile.bio}
                        onChange={(event) => handleProfileChange("bio", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn profile-save-btn"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                    >
                      <FaSave className="me-2" />
                      {isSavingProfile ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </div>
              ) : null}

              {activeSection === "security" ? (
                <div className="profile-security-form">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Current Password</label>
                      <div className="profile-password-wrapper">
                        <input
                          type={passwordVisibility.currentPassword ? "text" : "password"}
                          className="form-control profile-input profile-password-input"
                          value={security.currentPassword}
                          onChange={(event) => handleSecurityChange("currentPassword", event.target.value)}
                        />
                        <button
                          type="button"
                          className="profile-password-toggle"
                          onClick={() => togglePasswordVisibility("currentPassword")}
                          aria-label={passwordVisibility.currentPassword ? "Hide current password" : "Show current password"}
                        >
                          {passwordVisibility.currentPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">New Password</label>
                      <div className="profile-password-wrapper">
                        <input
                          type={passwordVisibility.newPassword ? "text" : "password"}
                          className="form-control profile-input profile-password-input"
                          value={security.newPassword}
                          onChange={(event) => handleSecurityChange("newPassword", event.target.value)}
                        />
                        <button
                          type="button"
                          className="profile-password-toggle"
                          onClick={() => togglePasswordVisibility("newPassword")}
                          aria-label={passwordVisibility.newPassword ? "Hide new password" : "Show new password"}
                        >
                          {passwordVisibility.newPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm Password</label>
                      <div className="profile-password-wrapper">
                        <input
                          type={passwordVisibility.confirmPassword ? "text" : "password"}
                          className="form-control profile-input profile-password-input"
                          value={security.confirmPassword}
                          onChange={(event) => handleSecurityChange("confirmPassword", event.target.value)}
                        />
                        <button
                          type="button"
                          className="profile-password-toggle"
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                          aria-label={passwordVisibility.confirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {passwordVisibility.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn profile-save-btn"
                      onClick={handleSaveSecurity}
                      disabled={isSavingSecurity}
                    >
                      <FaShieldAlt className="me-2" />
                      {isSavingSecurity ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
