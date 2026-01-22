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
    <div className="top-user-area simplified">
      {/* Main Content - Simplified Layout */}
      <div className="top-user-content simplified">
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

        {/* Right: Activity Button */}
        <div className="activity-entrance">
          <button className="activity-btn">
            <span className="activity-icon">🎁</span>
            <span className="activity-text">活动</span>
            <span className="activity-glow"></span>
            <span className="activity-star"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUserArea;
