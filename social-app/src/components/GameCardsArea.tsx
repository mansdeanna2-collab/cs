import React from 'react';
import './GameCardsArea.css';

interface GameCard {
  id: number;
  name: string;
  character: string;
  gradient: string;
  darkText?: boolean;
  badge?: {
    text: string;
    type: 'hot' | 'new' | 'special';
  };
  promo?: string;
  countdown?: string;
}

const gameCards: GameCard[] = [
  {
    id: 1,
    name: '疯狂狼人',
    character: '🐺',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
    badge: { text: '热门', type: 'hot' }
  },
  {
    id: 2,
    name: '开心卧底',
    character: '🕵️',
    gradient: 'linear-gradient(135deg, #E9D5FF 0%, #F5D0FE 100%)',
    darkText: true,
    badge: { text: '热门', type: 'hot' }
  },
  {
    id: 3,
    name: '抢唱合唱',
    character: '🎤',
    gradient: 'linear-gradient(135deg, #F472B6 0%, #C084FC 100%)'
  },
  {
    id: 4,
    name: '疯狂派对',
    character: '🚀',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    badge: { text: '鹅鸭模式', type: 'special' }
  },
  {
    id: 5,
    name: '快乐画猜',
    character: '🎨',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    badge: { text: '热门', type: 'hot' }
  },
  {
    id: 6,
    name: '拆弹猫',
    character: '🦄',
    gradient: 'linear-gradient(135deg, #6B21A8 0%, #581C87 100%)'
  },
  {
    id: 7,
    name: '黑白棋派对',
    character: '⚫',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
  },
  {
    id: 8,
    name: '你演我猜',
    character: '💃',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    badge: { text: '热门', type: 'hot' },
    promo: '新春三折礼包'
  },
  {
    id: 9,
    name: '梦幻岛',
    character: '🌴',
    gradient: 'linear-gradient(135deg, #F9A8D4 0%, #F472B6 100%)',
    darkText: true
  },
  {
    id: 10,
    name: '爪力全开',
    character: '🐱',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
    badge: { text: 'NEW', type: 'new' },
    countdown: '剩2天'
  }
];

const GameCardsArea: React.FC = () => {
  return (
    <section className="game-cards-area">
      {/* Top Banner Card - Enhanced Pig Card Game Scene */}
      <div className="banner-card">
        <div className="banner-background">
          {/* Hanging flags/bunting */}
          <div className="banner-bunting">
            <div className="bunting-flag flag-red"></div>
            <div className="bunting-flag flag-yellow"></div>
            <div className="bunting-flag flag-blue"></div>
            <div className="bunting-flag flag-green"></div>
            <div className="bunting-flag flag-red"></div>
            <div className="bunting-flag flag-yellow"></div>
            <div className="bunting-flag flag-blue"></div>
          </div>
          {/* Light bulbs at top */}
          <div className="banner-light-string">
            <span className="banner-bulb"></span>
            <span className="banner-bulb"></span>
            <span className="banner-bulb"></span>
            <span className="banner-bulb"></span>
            <span className="banner-bulb"></span>
          </div>
          {/* Card table scene */}
          <div className="card-table-scene">
            <div className="poker-table"></div>
            <div className="scattered-cards">
              <div className="playing-card card-1"></div>
              <div className="playing-card card-2"></div>
              <div className="playing-card card-3"></div>
            </div>
          </div>
          {/* Pig characters */}
          <div className="pig-characters">
            <div className="pig-char tiger">
              <div className="char-body">🐯</div>
            </div>
            <div className="pig-char pink-pig">
              <div className="char-body">🐷</div>
            </div>
            <div className="pig-char white-pig">
              <div className="char-body">🐽</div>
            </div>
            <div className="pig-char brown-pig">
              <div className="char-body">🐖</div>
            </div>
            <div className="pig-char boss-pig">
              <div className="char-body">🦔</div>
              <div className="sunglasses">🕶️</div>
            </div>
          </div>
        </div>
        <div className="banner-content">
          <h2 className="banner-title">猪哥别骗我</h2>
          <div className="banner-subtitle">
            <span className="subtitle-text">猪哥强势回归 会骗你就来</span>
            <span className="subtitle-arrow">›</span>
          </div>
        </div>
      </div>

      {/* Game Cards Grid - 2 columns, 10 cards */}
      <div className="game-cards-grid">
        {gameCards.map((game) => (
          <div 
            key={game.id} 
            className="game-card-item"
            style={{ background: game.gradient }}
          >
            {/* Badge */}
            {game.badge && (
              <span className={`card-badge ${game.badge.type}`}>
                {game.badge.text}
              </span>
            )}
            
            {/* Countdown */}
            {game.countdown && (
              <span className="card-countdown">{game.countdown}</span>
            )}

            {/* Game Title */}
            <h3 className={`card-title ${game.darkText ? 'dark-text' : ''}`}>
              {game.name}
            </h3>

            {/* Character */}
            <div className="card-character">
              <span className="character-emoji">{game.character}</span>
            </div>

            {/* Promo Badge */}
            {game.promo && (
              <span className="card-promo">{game.promo}</span>
            )}

            {/* Decorative elements */}
            <div className="card-decorations">
              <span className="deco-star">✨</span>
              <span className="deco-sparkle">⭐</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameCardsArea;
