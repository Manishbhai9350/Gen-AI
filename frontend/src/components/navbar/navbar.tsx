import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./scss/navbar.scss";

interface NavbarProps {
  context?: "default" | "interview";
  onExportPdf?: () => void;
  onReadAnalysis?: () => void;
  userName?: string;
  userInitials?: string;
}

const Navbar = ({
  context = "default",
  onExportPdf,
  onReadAnalysis,
  userName = "User",
  userInitials,
}: NavbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const initials = userInitials
    ?? userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    // hook into your auth logout here
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left — Logo */}
      <Link to="/dashboard" className="navbar__logo">
        <div className="navbar__logo-icon">
          <img src="/images/logo.png" alt="Jobsync" />
        </div>
        <span className="navbar__logo-text">Jobsync</span>
      </Link>

      {/* Center — Interview actions (only in interview context) */}
      {context === "interview" && (
        <div className="navbar__actions">
          <button
            className="navbar__action-btn navbar__action-btn--ghost"
            onClick={onReadAnalysis}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
            Read Analysis
          </button>
          <button
            className="navbar__action-btn navbar__action-btn--accent"
            onClick={onExportPdf}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
        </div>
      )}

      {/* Right — User profile */}
      <div className="navbar__right">
        <div
          className={`navbar__profile ${profileOpen ? "navbar__profile--open" : ""}`}
          onClick={() => setProfileOpen((v) => !v)}
        >
          <div className="navbar__avatar">
            <span>{initials}</span>
          </div>
          <span className="navbar__username">{userName}</span>
          <svg
            className="navbar__chevron"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {profileOpen && (
          <>
            <div className="navbar__overlay" onClick={() => setProfileOpen(false)} />
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <div className="navbar__avatar navbar__avatar--lg">
                  <span>{initials}</span>
                </div>
                <div>
                  <p className="navbar__dropdown-name">{userName}</p>
                  <p className="navbar__dropdown-role">Free Plan</p>
                </div>
              </div>
              <div className="navbar__dropdown-divider" />
              <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Dashboard
              </Link>
              <Link to="/settings" className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Settings
              </Link>
              <div className="navbar__dropdown-divider" />
              <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;