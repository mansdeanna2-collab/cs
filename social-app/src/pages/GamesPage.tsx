import React from 'react';
import './GamesPage.css';

interface Game {
  id: number;
  name: string;
  icon: string;
  players: string;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
}

const games: Game[] = [
  { id: 1, name: '狼人杀', icon: '🐺', players: '12.5万', category: '推理', isHot: true },
  { id: 2, name: '谁是卧底', icon: '🕵️', players: '8.3万', category: '推理', isHot: true },
  { id: 3, name: '你画我猜', icon: '🎨', players: '6.7万', category: '休闲' },
  { id: 4, name: '真心话大冒险', icon: '💕', players: '5.2万', category: '互动' },
  { id: 5, name: 'K歌之王', icon: '🎤', players: '4.8万', category: '音乐' },
  { id: 6, name: '抽签游戏', icon: '🎯', players: '3.5万', category: '休闲', isNew: true },
  { id: 7, name: '剧本杀', icon: '📜', players: '7.1万', category: '推理' },
  { id: 8, name: '飞行棋', icon: '🎲', players: '2.8万', category: '棋牌' },
];

const GamesPage: React.FC = () => {
  return (
    <div className="games-page">
      <header className="page-header">
        <h1 className="page-title">
          <span className="title-icon">🎮</span>
          游戏
        </h1>
        <div className="header-actions">
          <button className="header-btn">🔍</button>
        </div>
      </header>

      <section className="game-categories">
        <button className="cat-btn active">全部</button>
        <button className="cat-btn">推理</button>
        <button className="cat-btn">休闲</button>
        <button className="cat-btn">互动</button>
        <button className="cat-btn">棋牌</button>
      </section>

      <section className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-icon-wrapper">
              <span className="game-icon">{game.icon}</span>
              {game.isHot && <span className="badge hot">🔥热门</span>}
              {game.isNew && <span className="badge new">新</span>}
            </div>
            <div className="game-info">
              <h3 className="game-name">{game.name}</h3>
              <span className="game-category">{game.category}</span>
              <span className="game-players">👥 {game.players}在玩</span>
            </div>
            <button className="play-btn">开始</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default GamesPage;
