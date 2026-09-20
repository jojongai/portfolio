import React from 'react';
import { useNavigate } from 'react-router-dom';

const GITHUB_URL = 'https://github.com/jojongai';
const LINKEDIN_URL = 'https://www.linkedin.com/in/joseph-ngai-46a0a3175/';

function TopBar() {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="nav-arrows">
          <button className="nav-arrow-btn" onClick={() => navigate(-1)} title="Go back">
            ‹
          </button>
          <button className="nav-arrow-btn" onClick={() => navigate(1)} title="Go forward">
            ›
          </button>
        </div>
      </div>
      <div className="top-bar-right">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="top-bar-link"
        >
          GitHub
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="top-bar-link top-bar-link-solid"
        >
          LinkedIn
        </a>
        <div className="profile-picture" onClick={() => navigate('/profile')}>
          <img
            src="/png/profile.png"
            alt="Profile"
            className="profile-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TopBar;
