import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../Icon';
import './index.css';

function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <Icon name="home" fallback="🏠" alt="Home" />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/playlist/work-experience-playlist-id') ? 'active' : ''}`}
        onClick={() => navigate('/playlist/work-experience-playlist-id')}
      >
        <span className="mobile-nav-icon">💼</span>
        <span>Work</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/playlist/personal-projects-playlist-id') ? 'active' : ''}`}
        onClick={() => navigate('/playlist/personal-projects-playlist-id')}
      >
        <span className="mobile-nav-icon">🚀</span>
        <span>Projects</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/playlist/hobbies-and-interests-playlist-id') ? 'active' : ''}`}
        onClick={() => navigate('/playlist/hobbies-and-interests-playlist-id')}
      >
        <span className="mobile-nav-icon">🎮</span>
        <span>Hobbies</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <span className="mobile-nav-icon">👤</span>
        <span>Profile</span>
      </button>
    </nav>
  );
}

export default MobileNav;

