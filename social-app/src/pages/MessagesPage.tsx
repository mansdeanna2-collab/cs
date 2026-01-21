import React, { useState } from 'react';
import './MessagesPage.css';

interface Message {
  id: number;
  type: 'chat' | 'system' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline?: boolean;
  isVip?: boolean;
  isMuted?: boolean;
}

interface SystemNotification {
  id: number;
  icon: string;
  title: string;
  desc: string;
  time: string;
  hasNew: boolean;
}

const messages: Message[] = [
  {
    id: 1,
    type: 'chat',
    name: '小明星✨',
    avatar: '👦',
    lastMessage: '今晚继续狼人杀吗？我已经准备好当狼王了！',
    time: '刚刚',
    unread: 5,
    isOnline: true,
    isVip: true
  },
  {
    id: 2,
    type: 'group',
    name: '狼人杀高玩群',
    avatar: '🐺',
    lastMessage: '[游戏达人]: 开房间了，速来！',
    time: '5分钟前',
    unread: 28
  },
  {
    id: 3,
    type: 'chat',
    name: '音乐小精灵',
    avatar: '👧',
    lastMessage: '语音：00:32',
    time: '10分钟前',
    unread: 0,
    isOnline: true
  },
  {
    id: 4,
    type: 'group',
    name: '周末K歌群',
    avatar: '🎤',
    lastMessage: '[派对女王]: 今晚8点老地方见！',
    time: '30分钟前',
    unread: 12,
    isMuted: true
  },
  {
    id: 5,
    type: 'chat',
    name: '游戏达人',
    avatar: '🧑',
    lastMessage: '那局谁是卧底玩得真刺激！',
    time: '1小时前',
    unread: 0,
    isVip: true
  },
  {
    id: 6,
    type: 'chat',
    name: '夜猫子',
    avatar: '🦉',
    lastMessage: '明天凌晨还有电台节目，记得来',
    time: '2小时前',
    unread: 2
  },
  {
    id: 7,
    type: 'group',
    name: '真心话大冒险群',
    avatar: '💕',
    lastMessage: '有新朋友加入群聊',
    time: '3小时前',
    unread: 0
  },
  {
    id: 8,
    type: 'chat',
    name: '可爱小猫',
    avatar: '🐱',
    lastMessage: '谢谢你的礼物~',
    time: '昨天',
    unread: 0,
    isOnline: false
  }
];

const systemNotifications: SystemNotification[] = [
  { id: 1, icon: '🔔', title: '系统通知', desc: '您的VIP会员即将到期...', time: '10分钟前', hasNew: true },
  { id: 2, icon: '❤️', title: '互动消息', desc: '小明星✨ 点赞了你的动态', time: '30分钟前', hasNew: true },
  { id: 3, icon: '👋', title: '新朋友', desc: '有3位用户想认识你', time: '1小时前', hasNew: true },
  { id: 4, icon: '🎁', title: '礼物消息', desc: '收到新的礼物奖励', time: '2小时前', hasNew: false },
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [searchFocused, setSearchFocused] = useState(false);

  const totalUnread = messages.reduce((sum, msg) => sum + msg.unread, 0);

  return (
    <div className="messages-page">
      {/* Header */}
      <header className="messages-header">
        <h1 className="page-title">
          <span className="title-emoji">💬</span>
          消息中心
          {totalUnread > 0 && <span className="total-badge">{totalUnread}</span>}
        </h1>
        <div className="header-actions">
          <button className="header-btn">✏️</button>
          <button className="header-btn">⚙️</button>
        </div>
      </header>

      {/* Search Bar */}
      <div className={`search-bar ${searchFocused ? 'focused' : ''}`}>
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="搜索联系人或群聊" 
          className="search-input editable-field"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Tabs */}
      <div className="message-tabs">
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          聊天
          {totalUnread > 0 && <span className="tab-badge">{totalUnread}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          通知
          <span className="tab-badge">4</span>
        </button>
      </div>

      {/* System Notifications Panel */}
      {activeTab === 'messages' && (
        <div className="system-panel">
          {systemNotifications.slice(0, 4).map((notif) => (
            <div key={notif.id} className="system-item">
              <div className="system-icon">
                {notif.icon}
                {notif.hasNew && <span className="new-dot"></span>}
              </div>
              <span className="system-title">{notif.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages List */}
      {activeTab === 'messages' && (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-item">
              <div className="avatar-wrapper">
                <div className={`message-avatar ${msg.type}`}>
                  <span className="avatar-emoji">{msg.avatar}</span>
                  {msg.isOnline && <span className="online-dot"></span>}
                </div>
                {msg.isVip && <span className="vip-corner">V</span>}
              </div>

              <div className="message-content">
                <div className="message-header">
                  <div className="name-row">
                    <span className="message-name">{msg.name}</span>
                    {msg.type === 'group' && <span className="group-tag">群聊</span>}
                    {msg.isMuted && <span className="muted-icon">🔕</span>}
                  </div>
                  <span className="message-time">{msg.time}</span>
                </div>
                <div className="message-preview">
                  <p className="preview-text">{msg.lastMessage}</p>
                  {msg.unread > 0 && !msg.isMuted && (
                    <span className="unread-badge">
                      {msg.unread > 99 ? '99+' : msg.unread}
                    </span>
                  )}
                  {msg.unread > 0 && msg.isMuted && (
                    <span className="muted-badge"></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notifications List */}
      {activeTab === 'notifications' && (
        <div className="notifications-list">
          {systemNotifications.map((notif) => (
            <div key={notif.id} className={`notification-item ${notif.hasNew ? 'new' : ''}`}>
              <div className="notif-icon-wrapper">
                <span className="notif-icon">{notif.icon}</span>
              </div>
              <div className="notif-content">
                <div className="notif-header">
                  <span className="notif-title">{notif.title}</span>
                  <span className="notif-time">{notif.time}</span>
                </div>
                <p className="notif-desc">{notif.desc}</p>
              </div>
              {notif.hasNew && <span className="notif-dot"></span>}
            </div>
          ))}

          <div className="notification-actions">
            <button className="notif-action-btn">
              <span className="action-emoji">🗑️</span>
              清空全部
            </button>
            <button className="notif-action-btn">
              <span className="action-emoji">✓</span>
              全部已读
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-contacts">
        <h3 className="section-title">💫 常用联系人</h3>
        <div className="contacts-scroll">
          <div className="contact-item add-new">
            <span className="add-icon">+</span>
            <span className="contact-name">添加</span>
          </div>
          {messages.filter(m => m.type === 'chat').slice(0, 5).map((contact) => (
            <div key={contact.id} className="contact-item">
              <div className="contact-avatar">
                <span>{contact.avatar}</span>
                {contact.isOnline && <span className="contact-online"></span>}
              </div>
              <span className="contact-name">{contact.name.slice(0, 4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
