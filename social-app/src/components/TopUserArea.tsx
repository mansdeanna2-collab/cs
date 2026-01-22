import React from 'react';
import './TopUserArea.css';

interface TopUserAreaProps {
  user?: {
    name: string;
    avatar: string;
    coins: number;
  };
}

const TopUserArea: React.FC<TopUserAreaProps> = ({ 
  user = {
    name: '光怪陆离',
    avatar: '🐘',
    coins: 1280
  }
}) => {
  return (
    <div className="top-user-area">
      {/* Festival Decorations */}
      <div className="festival-decorations">
        <div className="decoration-lights">
          <span className="light light-1">💡</span>
          <span className="light light-2">✨</span>
          <span className="light light-3">💡</span>
          <span className="light light-4">⭐</span>
          <span className="light light-5">💡</span>
          <span className="ribbon ribbon-1">🎀</span>
          <span className="ribbon ribbon-2">🎗️</span>
          <span className="star star-1">⭐</span>
          <span className="star star-2">🌟</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="top-user-content">
        {/* Left: User Info Group */}
        <div className="user-info-group">
          {/* Avatar */}
          <div className="avatar-container">
            <div className="avatar-wrapper">
              <span className="avatar-image">{user.avatar}</span>
            </div>
            <span className="avatar-crown">👑</span>
          </div>

          {/* User Details */}
          <div className="user-details-section">
            <span className="username">{user.name}</span>
            {/* Currency Display */}
            <div className="currency-display">
              <span className="currency-icon">🏆</span>
              <span className="currency-value">{user.coins}</span>
              <button className="recharge-btn" aria-label="充值">+</button>
            </div>
          </div>
        </div>

        {/* Center: Mascot */}
        <div className="mascot-container">
          <div className="mascot-stage">
            <div className="stage-arch">
              <div className="arch-lights">
                <span className="arch-light">💡</span>
                <span className="arch-light">💡</span>
                <span className="arch-light">💡</span>
              </div>
            </div>
            <div className="mascot-figure">
              <div className="mascot-hat">
                <span className="hat-candle">🕯️</span>
                <span className="hat-number">12</span>
              </div>
              <div className="mascot-body">
                <div className="mascot-face-area">
                  <span className="mascot-eyes">◠‿◠</span>
                </div>
                <span className="mascot-wave">👋</span>
              </div>
            </div>
            {/* Interaction Elements */}
            <span className="mascot-heart heart-1">❤️</span>
            <span className="mascot-heart heart-2">💕</span>
            <span className="mascot-bubble">💬</span>
          </div>
        </div>

        {/* Right: Activity Button */}
        <div className="activity-entrance">
          <button className="activity-btn">
            <span className="activity-icon">🎁</span>
            <span className="activity-text">活动</span>
            <span className="activity-glow"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUserArea;
