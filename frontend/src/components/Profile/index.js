import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import './index.css';

function Profile() {
  const navigate = useNavigate();

  // Profile data - you can move this to a JSON file or API later
  const profileData = {
    name: "Jojo Ngai",
    email: "j5ngai@uwaterloo.ca", // Update with your actual email
    title: "5th-year Management Engineering Student",
    school: "University of Waterloo",
    location: "Waterloo, ON, Canada",
    bio: "Interested in software, data, machine learning, and AI. Building full-stack applications and exploring the intersection of technology and business.",
    proficientLanguages: [
      "TypeScript",
      "JavaScript",     
      "Python",
      "Java",
      "SQL",
      "GraphQL",
      "HTML/CSS"
    ],
    proficientTechnologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "Firebase",
      "Google Cloud Platform",
      "Vertex AI",
      "Hasura",
      "Railway",
      "Git",
      "Docker"
    ],
    socialLinks: {
      github: "https://github.com/jojongai",
      linkedin: "https://www.linkedin.com/in/joseph-ngai-46a0a3175/"
    },
    resumePath: "/resume/Jojo_Ngai_Resume.pdf" // Path to resume file in public folder
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <div></div>
          <div className="profile-picture" onClick={() => navigate('/')}>
            <img src="/png/profile.png" alt="Profile" className="profile-img" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        </div>

        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-image-container">
              <img 
                src="/png/profile.png" 
                alt={profileData.name} 
                className="profile-large-img"
                onError={(e) => { 
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }} 
              />
              <div className="profile-placeholder" style={{ display: 'none' }}>
                {profileData.name.charAt(0)}
              </div>
            </div>
            <div className="profile-header-info">
              <div className="profile-header-top">
                <div>
                  <p className="profile-type">Profile</p>
                  <h1 className="profile-name">{profileData.name}</h1>
                  <p className="profile-title">{profileData.title}</p>
                  <p className="profile-location">{profileData.school} • {profileData.location}</p>
                </div>
                <a 
                  href={profileData.resumePath} 
                  download 
                  className="profile-header-download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="download" fallback="📥" />
                  <span>Download Resume</span>
                </a>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h2 className="profile-section-title">Contact</h2>
              <div className="profile-contact">
                <a href={`mailto:${profileData.email}`} className="profile-contact-item">
                  <Icon name="email" fallback="✉️" />
                  <span>{profileData.email}</span>
                </a>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">Proficient Languages</h2>
              <div className="profile-tags">
                {profileData.proficientLanguages.map((lang, index) => (
                  <span key={index} className="profile-tag">{lang}</span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">Technologies & Tools</h2>
              <div className="profile-tags">
                {profileData.proficientTechnologies.map((tech, index) => (
                  <span key={index} className="profile-tag">{tech}</span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h2 className="profile-section-title">Connect</h2>
              <div className="profile-social">
                <a 
                  href={profileData.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="profile-social-link"
                >
                  <Icon name="github" fallback="💻" />
                  <span>GitHub</span>
                </a>
                <a 
                  href={profileData.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="profile-social-link"
                >
                  <Icon name="linkedin" fallback="💼" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

