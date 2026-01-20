import React, { useState } from 'react';
import './PartyPage.css';

interface PartyRoom {
  id: number;
  name: string;
  host: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  type: string;
  icon: string;
  members: number;
  maxMembers: number;
  isLive: boolean;
  isHot?: boolean;
  tags: string[];
  coverGradient: string;
}

interface LiveParty {
  id: number;
  title: string;
  host: string;
  avatar: string;
  viewers: number;
  category: string;
  thumbnail: string;
}

const partyRooms: PartyRoom[] = [
  {
    id: 1,
    name: '深夜治愈电台',
    host: { name: '夜猫子主播', avatar: '🦉', isVerified: true },
    type: '电台',
    icon: '📻',
    members: 128,
    maxMembers: 200,
    isLive: true,
    isHot: true,
    tags: ['治愈', '音乐', '深夜'],
    coverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '狼人杀高玩局',
    host: { name: '游戏达人', avatar: '🐺', isVerified: true },
    type: '游戏房',
    icon: '🎮',
    members: 12,
    maxMembers: 12,
    isLive: true,
    isHot: true,
    tags: ['狼人杀', '高玩', '语音'],
    coverGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: '周末K歌派对',
    host: { name: '音乐小精灵', avatar: '🎤' },
    type: 'K歌房',
    icon: '🎵',
    members: 45,
    maxMembers: 100,
    isLive: true,
    tags: ['K歌', '流行', '派对'],
    coverGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: '真心话大冒险',
    host: { name: '派对女王', avatar: '👑' },
    type: '互动',
    icon: '💕',
    members: 23,
    maxMembers: 50,
    isLive: true,
    tags: ['互动', '交友', '刺激'],
    coverGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 5,
    name: '脱口秀之夜',
    host: { name: '搞笑担当', avatar: '🎭' },
    type: '表演',
    icon: '🎪',
    members: 89,
    maxMembers: 150,
    isLive: false,
    tags: ['脱口秀', '搞笑', '表演'],
    coverGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 6,
    name: '读书分享会',
    host: { name: '书虫小姐', avatar: '📚' },
    type: '分享',
    icon: '📖',
    members: 34,
    maxMembers: 80,
    isLive: true,
    tags: ['读书', '分享', '文艺'],
    coverGradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
  }
];

const liveParties: LiveParty[] = [
  { id: 1, title: '新年倒计时派对', host: '官方运营', avatar: '🎊', viewers: 5280, category: '官方', thumbnail: '🎉' },
  { id: 2, title: '电音狂欢夜', host: 'DJ Master', avatar: '🎧', viewers: 3120, category: '音乐', thumbnail: '🎶' },
  { id: 3, title: '相亲大会', host: '红娘姐姐', avatar: '💘', viewers: 2890, category: '交友', thumbnail: '💕' },
];

const PartyPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const filters = ['全部', '🔴直播中', '🎮游戏', '🎵音乐', '💬聊天', '🎭表演'];

  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="party-page">
      {/* Header */}
      <header className="party-header">
        <h1 className="page-title">
          <span className="title-emoji">🎉</span>
          派对广场
        </h1>
        <div className="header-actions">
          <button className="icon-btn">🔍</button>
          <button className="icon-btn">📅</button>
        </div>
      </header>

      {/* Featured Live */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="live-dot"></span>
            热门直播
          </h2>
          <button className="more-btn">更多 →</button>
        </div>
        <div className="live-scroll">
          {liveParties.map((party) => (
            <div key={party.id} className="live-card">
              <div className="live-thumbnail">
                <span className="thumbnail-emoji">{party.thumbnail}</span>
                <div className="live-badge">
                  <span className="live-dot-small"></span>
                  LIVE
                </div>
                <div className="viewer-count">👁 {formatNumber(party.viewers)}</div>
              </div>
              <div className="live-info">
                <span className="live-avatar">{party.avatar}</span>
                <div className="live-details">
                  <h4 className="live-title">{party.title}</h4>
                  <span className="live-host">{party.host}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Create */}
      <section className="quick-create">
        <button className="create-btn primary">
          <span className="btn-icon">🎤</span>
          <div className="btn-text">
            <span className="btn-title">开房间</span>
            <span className="btn-desc">创建你的派对</span>
          </div>
        </button>
        <button className="create-btn secondary">
          <span className="btn-icon">🎯</span>
          <div className="btn-text">
            <span className="btn-title">快速匹配</span>
            <span className="btn-desc">随机加入</span>
          </div>
        </button>
      </section>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Party Rooms Grid */}
      <section className="rooms-section">
        <div className="rooms-grid">
          {partyRooms.map((room) => (
            <div key={room.id} className="room-card" style={{ background: room.coverGradient }}>
              {/* Room Header */}
              <div className="room-header">
                <div className="room-type">
                  <span className="type-icon">{room.icon}</span>
                  <span className="type-name">{room.type}</span>
                </div>
                {room.isLive && (
                  <div className="room-live-badge">
                    <span className="live-pulse"></span>
                    直播中
                  </div>
                )}
                {room.isHot && <span className="hot-badge">🔥</span>}
              </div>

              {/* Room Info */}
              <div className="room-content">
                <h3 className="room-name">{room.name}</h3>
                <div className="room-tags">
                  {room.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="room-tag">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Room Footer */}
              <div className="room-footer">
                <div className="host-info">
                  <span className="host-avatar">{room.host.avatar}</span>
                  <span className="host-name">{room.host.name}</span>
                  {room.host.isVerified && <span className="verified-badge">✓</span>}
                </div>
                <div className="member-count">
                  <span className="member-icon">👥</span>
                  <span className="member-text">{room.members}/{room.maxMembers}</span>
                </div>
              </div>

              {/* Join Button */}
              <button className="join-room-btn">
                {room.members >= room.maxMembers ? '已满员' : '加入房间'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">🎯 热门分类</h2>
        <div className="categories-grid">
          <div className="category-card">
            <span className="category-icon">🎮</span>
            <span className="category-name">游戏房</span>
            <span className="category-count">326个房间</span>
          </div>
          <div className="category-card">
            <span className="category-icon">🎤</span>
            <span className="category-name">K歌房</span>
            <span className="category-count">189个房间</span>
          </div>
          <div className="category-card">
            <span className="category-icon">💬</span>
            <span className="category-name">聊天室</span>
            <span className="category-count">452个房间</span>
          </div>
          <div className="category-card">
            <span className="category-icon">💕</span>
            <span className="category-name">交友房</span>
            <span className="category-count">278个房间</span>
          </div>
        </div>
      </section>

      {/* Create Room FAB */}
      <button className="fab-create">
        <span className="fab-plus">+</span>
      </button>
    </div>
  );
};

export default PartyPage;
