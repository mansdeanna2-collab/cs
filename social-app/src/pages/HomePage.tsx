import React, { useState } from 'react';
import './HomePage.css';

interface Game {
  id: number;
  name: string;
  icon: string;
  players: number;
  category: string;
  gradient: string;
  isHot?: boolean;
  isNew?: boolean;
}

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    level: number;
    isVip?: boolean;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  time: string;
  isLiked?: boolean;
}

const games: Game[] = [
  { id: 1, name: '狼人杀', icon: '🐺', players: 12580, category: '桌游', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', isHot: true },
  { id: 2, name: '你画我猜', icon: '🎨', players: 8920, category: '休闲', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', isNew: true },
  { id: 3, name: '谁是卧底', icon: '🕵️', players: 6540, category: '益智', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, name: 'UNO', icon: '🃏', players: 5230, category: '桌游', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 5, name: '真心话大冒险', icon: '💕', players: 9870, category: '互动', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', isHot: true },
  { id: 6, name: 'K歌房', icon: '🎤', players: 15320, category: '音乐', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', isNew: true },
];

const posts: Post[] = [
  {
    id: 1,
    user: { name: '小明星✨', avatar: '👦', level: 28, isVip: true },
    content: '今晚狼人杀超刺激！连续三把都是狼人，每次都被投出去😂 有没有带带我的大佬！',
    images: ['🎮', '🐺', '😈'],
    likes: 256,
    comments: 48,
    time: '10分钟前',
    isLiked: true
  },
  {
    id: 2,
    user: { name: '音乐小精灵', avatar: '👧', level: 35 },
    content: '刚刚在K歌房唱了一首《起风了》，被大家夸唱得好听，开心！今晚继续开麦，欢迎来玩~',
    likes: 189,
    comments: 32,
    time: '25分钟前'
  },
  {
    id: 3,
    user: { name: '游戏达人', avatar: '🧑', level: 42, isVip: true },
    content: '新版本你画我猜太好玩了！终于有人能猜出我画的"抽象派"作品了哈哈哈',
    images: ['🎨', '✏️'],
    likes: 342,
    comments: 67,
    time: '1小时前',
    isLiked: false
  },
  {
    id: 4,
    user: { name: '派对女王', avatar: '👩', level: 55 },
    content: '周末派对预告：本周六晚8点，大型相亲派对等你来！已有200+小伙伴报名，不见不散！🎉',
    likes: 528,
    comments: 156,
    time: '2小时前'
  },
  {
    id: 5,
    user: { name: '夜猫子', avatar: '🦉', level: 18 },
    content: '凌晨3点还在玩谁是卧底，我是真的上头了...明天还要早起，但是停不下来啊！',
    likes: 95,
    comments: 23,
    time: '3小时前'
  }
];

const HomePage: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set([1]));
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', '🔥热门', '🎮桌游', '🎵音乐', '💕互动', '🧠益智'];

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-left">
          <span className="logo">🎮</span>
          <h1 className="app-title">趣玩社区</h1>
        </div>
        <div className="header-right">
          <button className="header-btn search-btn">🔍</button>
          <button className="header-btn notification-btn">
            🔔
            <span className="notification-dot"></span>
          </button>
        </div>
      </header>

      {/* Server Broadcast Announcement */}
      <section className="broadcast-section">
        <div className="broadcast-bar">
          <div className="broadcast-icon">
            <span className="megaphone">📢</span>
          </div>
          <div className="broadcast-content">
            <div className="broadcast-marquee">
              <span className="broadcast-text">
                🎉 新年派对狂欢季火热进行中！参与游戏赢取海量金币奖励 · 
                🏆 排行榜已更新，快来查看你的排名 · 
                💎 VIP专属福利限时领取中 · 
                🎮 新游戏"你画我猜"已上线
              </span>
            </div>
          </div>
          <button className="broadcast-close">×</button>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="action-item">
          <span className="action-icon">🎯</span>
          <span className="action-text">快速匹配</span>
        </div>
        <div className="action-item">
          <span className="action-icon">🏆</span>
          <span className="action-text">排行榜</span>
        </div>
        <div className="action-item">
          <span className="action-icon">🎁</span>
          <span className="action-text">每日签到</span>
        </div>
        <div className="action-item">
          <span className="action-icon">💎</span>
          <span className="action-text">VIP特权</span>
        </div>
      </section>

      {/* Games Section */}
      <section className="games-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🎮</span>
            热门游戏
          </h2>
          <button className="see-all-btn">查看全部 →</button>
        </div>
        
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card" style={{ background: game.gradient }}>
              {game.isHot && <span className="game-badge hot">🔥 热门</span>}
              {game.isNew && <span className="game-badge new">✨ 新游</span>}
              <span className="game-icon">{game.icon}</span>
              <h3 className="game-name">{game.name}</h3>
              <div className="game-info">
                <span className="game-players">👥 {formatNumber(game.players)}人在玩</span>
              </div>
              <button className="play-btn">开始游戏</button>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider">
        <span className="divider-line"></span>
        <span className="divider-text">📢 社区动态</span>
        <span className="divider-line"></span>
      </div>

      {/* Feed Section */}
      <section className="feed-section">
        {posts.map((post) => (
          <article key={post.id} className="post-card fade-in">
            <div className="post-header">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="avatar-emoji">{post.user.avatar}</span>
                  {post.user.isVip && <span className="vip-badge">V</span>}
                </div>
                <div className="user-details">
                  <div className="user-name-row">
                    <span className="user-name">{post.user.name}</span>
                    {post.user.isVip && <span className="vip-tag">VIP</span>}
                  </div>
                  <div className="user-meta">
                    <span className="user-level">Lv.{post.user.level}</span>
                    <span className="post-time">· {post.time}</span>
                  </div>
                </div>
              </div>
              <button className="post-menu-btn">⋯</button>
            </div>

            <p className="post-content">{post.content}</p>

            {post.images && (
              <div className="post-images">
                {post.images.map((img, idx) => (
                  <div key={idx} className="image-placeholder">
                    <span className="placeholder-emoji">{img}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="post-actions">
              <button 
                className={`action-btn like-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <span className="action-icon-text">{likedPosts.has(post.id) ? '❤️' : '🤍'}</span>
                <span className="action-count">
                  {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
                </span>
              </button>
              <button className="action-btn comment-btn">
                <span className="action-icon-text">💬</span>
                <span className="action-count">{post.comments}</span>
              </button>
              <button className="action-btn share-btn">
                <span className="action-icon-text">↗️</span>
                <span className="action-count">分享</span>
              </button>
            </div>
          </article>
        ))}

        <div className="load-more">
          <button className="load-more-btn">加载更多动态...</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
