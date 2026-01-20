import React, { useState } from 'react';
import './ProfilePage.css';

interface Achievement {
  id: number;
  icon: string;
  name: string;
  desc: string;
  unlocked: boolean;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

const achievements: Achievement[] = [
  { id: 1, icon: '🏆', name: '狼王', desc: '狼人杀获胜50次', unlocked: true },
  { id: 2, icon: '🎤', name: '金嗓子', desc: 'K歌评分超过90分', unlocked: true },
  { id: 3, icon: '🌟', name: '人气王', desc: '粉丝数达到1000', unlocked: true },
  { id: 4, icon: '💎', name: '土豪', desc: '累计送出10000金币', unlocked: false },
  { id: 5, icon: '🎮', name: '游戏达人', desc: '参与游戏超过100局', unlocked: true },
  { id: 6, icon: '❤️', name: '万人迷', desc: '收到1000个喜欢', unlocked: false },
];

const stats: StatItem[] = [
  { label: '关注', value: '328', icon: '👁' },
  { label: '粉丝', value: '1.2k', icon: '❤️' },
  { label: '获赞', value: '5.8k', icon: '👍' },
  { label: '金币', value: '8,520', icon: '💰' },
];

const menuItems = [
  { icon: '🎁', label: '我的礼物', badge: 12 },
  { icon: '🏅', label: '成就徽章', badge: 0 },
  { icon: '📝', label: '我的动态', badge: 0 },
  { icon: '⭐', label: '收藏内容', badge: 3 },
  { icon: '👥', label: '好友列表', badge: 0 },
  { icon: '🎮', label: '游戏记录', badge: 0 },
  { icon: '💳', label: '钱包充值', badge: 0 },
  { icon: '⚙️', label: '设置', badge: 0 },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const user = {
    name: '游戏小王子',
    avatar: '👨‍🎤',
    level: 42,
    vipLevel: 5,
    signature: '热爱游戏，热爱生活！每天都要开心～ 🎮✨',
    location: '北京',
    age: 25,
    gender: '男',
  };

  return (
    <div className="profile-page">
      {/* Header Background */}
      <div className="profile-bg">
        <div className="bg-gradient"></div>
        <div className="bg-decorations">
          <span className="deco-1">✨</span>
          <span className="deco-2">🌟</span>
          <span className="deco-3">💫</span>
        </div>
      </div>

      {/* Settings Button */}
      <div className="top-actions">
        <button className="top-btn">🔔</button>
        <button className="top-btn">⚙️</button>
      </div>

      {/* Profile Header */}
      <section className="profile-header">
        <div className="avatar-section">
          <div className="main-avatar">
            <span className="avatar-emoji">{user.avatar}</span>
            <span className="level-badge">Lv.{user.level}</span>
          </div>
          <button className="edit-avatar-btn">📷</button>
        </div>

        <div className="user-info">
          <div className="name-row">
            <h1 className="user-name">{user.name}</h1>
            <span className="vip-badge">VIP{user.vipLevel}</span>
            <span className="gender-badge male">♂</span>
          </div>
          <p className="user-signature">{user.signature}</p>
          <div className="user-tags">
            <span className="user-tag">📍 {user.location}</span>
            <span className="user-tag">🎂 {user.age}岁</span>
            <span className="user-tag">🎮 狼人杀玩家</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn primary">✏️ 编辑资料</button>
          <button className="action-btn secondary">🔗 分享主页</button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* VIP Card */}
      <section className="vip-card">
        <div className="vip-info">
          <div className="vip-icon">👑</div>
          <div className="vip-text">
            <span className="vip-title">VIP{user.vipLevel} 会员</span>
            <span className="vip-expires">有效期至 2025.12.31</span>
          </div>
        </div>
        <button className="renew-btn">续费</button>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🏅</span>
            成就徽章
          </h2>
          <button className="see-all">查看全部 →</button>
        </div>
        <div className="achievements-grid">
          {achievements.slice(0, 6).map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-name">{achievement.name}</span>
              {!achievement.unlocked && <span className="lock-overlay">🔒</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <span className="tab-icon">📝</span>
          动态
        </button>
        <button 
          className={`profile-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span className="tab-icon">🎮</span>
          游戏
        </button>
        <button 
          className={`profile-tab ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          <span className="tab-icon">❤️</span>
          喜欢
        </button>
      </div>

      {/* Menu List */}
      <section className="menu-section">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              <div className="menu-left">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </div>
              <div className="menu-right">
                {item.badge > 0 && <span className="menu-badge">{item.badge}</span>}
                <span className="menu-arrow">›</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <h2 className="section-title">
          <span className="title-icon">📊</span>
          最近活动
        </h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">🎮</span>
            <div className="activity-content">
              <span className="activity-title">参与狼人杀游戏</span>
              <span className="activity-time">2小时前</span>
            </div>
            <span className="activity-result win">胜利 +50</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🎤</span>
            <div className="activity-content">
              <span className="activity-title">K歌房演唱《起风了》</span>
              <span className="activity-time">5小时前</span>
            </div>
            <span className="activity-result score">92分</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🎁</span>
            <div className="activity-content">
              <span className="activity-title">收到礼物 火箭 x3</span>
              <span className="activity-time">1天前</span>
            </div>
            <span className="activity-result gift">+300</span>
          </div>
        </div>
      </section>

      {/* Logout */}
      <div className="logout-section">
        <button className="logout-btn">退出登录</button>
      </div>
    </div>
  );
};

export default ProfilePage;
