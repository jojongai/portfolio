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
        <Icon name="work" fallback="💼" alt="Work" />
        <span>Work</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/playlist/personal-projects-playlist-id') ? 'active' : ''}`}
        onClick={() => navigate('/playlist/personal-projects-playlist-id')}
      >
        <Icon name="projects" fallback="🚀" alt="Projects" />
        <span>Projects</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/playlist/hobbies-and-interests-playlist-id') ? 'active' : ''}`}
        onClick={() => navigate('/playlist/hobbies-and-interests-playlist-id')}
      >
        <Icon name="hobbies" fallback="🎮" alt="Hobbies" />
        <span>Hobbies</span>
      </button>

      <button
        className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <Icon name="profile" fallback="👤" alt="Profile" />
        <span>Profile</span>
      </button>
    </nav>
  );
}

export default MobileNav;

