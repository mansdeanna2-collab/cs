import React, { useState } from 'react';
import './HomePage.css';
import TopUserArea from '../components/TopUserArea';
import GameCardsArea from '../components/GameCardsArea';

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

  return (
    <div className="home-page">
      {/* Top User Area */}
      <TopUserArea />

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

      {/* Game Cards Area - New Design */}
      <GameCardsArea />

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
