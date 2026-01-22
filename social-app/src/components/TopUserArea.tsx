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
      {/* Festival Decorations - Vector style */}
      <div className="festival-decorations">
        <div className="decoration-lights">
          {/* Hanging light bulbs with lines */}
          <div className="hanging-light" style={{ left: '20px' }}>
            <div className="light-wire"></div>
            <div className="light-bulb"></div>
          </div>
          <div className="sparkle-star" style={{ left: '50px' }}></div>
          <div className="ribbon-bow" style={{ left: '90px' }}></div>
          <div className="sparkle-star small" style={{ left: '140px' }}></div>
          <div className="hanging-light" style={{ left: '200px' }}>
            <div className="light-wire"></div>
            <div className="light-bulb"></div>
          </div>
          <div className="vine-decoration" style={{ left: '250px' }}></div>
          <div className="sparkle-star double" style={{ left: '300px' }}></div>
          <div className="ribbon-bow small" style={{ left: '350px' }}></div>
          <div className="hanging-light" style={{ right: '20px' }}>
            <div className="light-wire"></div>
            <div className="light-bulb"></div>
          </div>
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
              <div className="arch-lights-row">
                <span className="arch-bulb"></span>
                <span className="arch-bulb"></span>
                <span className="arch-bulb"></span>
                <span className="arch-bulb"></span>
                <span className="arch-bulb"></span>
              </div>
            </div>
            <div className="mascot-figure">
              <div className="mascot-hat">
                <div className="hat-candle-holder">
                  <div className="candle-flame"></div>
                  <div className="candle-body"></div>
                </div>
                <span className="hat-number">12</span>
              </div>
              <div className="mascot-body">
                <div className="mascot-face-area">
                  <div className="mascot-blush left"></div>
                  <div className="mascot-eyes-container">
                    <span className="mascot-eye left">︶</span>
                    <span className="mascot-eye right">︶</span>
                  </div>
                  <div className="mascot-blush right"></div>
                  <div className="mascot-smile"></div>
                </div>
                <div className="mascot-arm wave">
                  <div className="arm-shape"></div>
                </div>
              </div>
            </div>
            {/* Interaction Elements */}
            <div className="floating-heart heart-1"></div>
            <div className="floating-heart heart-2"></div>
            <div className="chat-bubble">
              <span className="bubble-dots">...</span>
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
