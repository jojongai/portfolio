import React from 'react';
import Sidebar from '../Sidebar';
import Icon from '../Icon';
import './index.css';

function HobbiesAndInterests() {
  const hobbies = [
    {
      title: 'Photography',
      description: 'Capturing moments and exploring different perspectives through the lens. Love experimenting with different lighting, compositions, and editing techniques.',
      icon: '📷'
    },
    {
      title: 'Reading',
      description: 'Avid reader of technology books, science fiction, and personal development. Always have a book in progress.',
      icon: '📚'
    },
    {
      title: 'Hiking & Nature',
      description: 'Enjoy exploring trails and spending time outdoors. Great way to disconnect and recharge while staying active.',
      icon: '⛰️'
    },
    {
      title: 'Cooking',
      description: 'Love experimenting with new recipes and cuisines. Cooking is both creative and relaxing for me.',
      icon: '👨‍🍳'
    },
    {
      title: 'Gaming',
      description: 'Enjoy strategy games and puzzle games. Appreciate good game design and storytelling in video games.',
      icon: '🎮'
    },
    {
      title: 'Learning New Technologies',
      description: 'Passionate about staying up-to-date with the latest tech trends. Love exploring new frameworks, tools, and programming languages.',
      icon: '💻'
    }
  ];

  return (
    <div className="app">
      <Sidebar />
      <div className="hobbies-content">
        <div className="hobbies-header">
          <div className="hobbies-header-content">
            <div className="hobbies-icon-large">
              <Icon name="target" fallback="🎯" alt="Hobbies and Interests" className="hobbies-header-icon" />
            </div>
            <div className="hobbies-header-details">
              <p className="hobbies-type">Collection</p>
              <h1 className="hobbies-title-large">Hobbies and Interests</h1>
              <p className="hobbies-description">Things I enjoy doing in my free time and activities that keep me inspired and motivated.</p>
            </div>
          </div>
        </div>

        <div className="hobbies-grid">
          {hobbies.map((hobby, index) => {
            const iconMap = {
              '📷': { name: 'photography', fallback: '📷' },
              '📚': { name: 'reading', fallback: '📚' },
              '⛰️': { name: 'hiking', fallback: '⛰️' },
              '👨‍🍳': { name: 'cooking', fallback: '👨‍🍳' },
              '🎮': { name: 'gaming', fallback: '🎮' },
              '💻': { name: 'coding', fallback: '💻' }
            };
            const iconInfo = iconMap[hobby.icon] || { name: `hobby-${index}`, fallback: hobby.icon };
            
            return (
              <div key={index} className="hobby-card">
                <div className="hobby-icon">
                  <Icon {...iconInfo} alt={hobby.title} className="hobby-icon-img" />
                </div>
                <h3 className="hobby-title">{hobby.title}</h3>
                <p className="hobby-description">{hobby.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HobbiesAndInterests;

