import React from 'react';
import './LivePage.css';

interface LiveStream {
  id: number;
  title: string;
  streamer: string;
  avatar: string;
  viewers: string;
  thumbnail: string;
  isLive: boolean;
}

const liveStreams: LiveStream[] = [
  { id: 1, title: '午夜电台直播', streamer: '夜猫主播', avatar: '🦉', viewers: '2.5万', thumbnail: '🎙️', isLive: true },
  { id: 2, title: '热舞派对', streamer: '舞蹈达人', avatar: '💃', viewers: '1.8万', thumbnail: '🎶', isLive: true },
  { id: 3, title: '游戏竞技', streamer: '游戏大神', avatar: '🎮', viewers: '3.2万', thumbnail: '🏆', isLive: true },
  { id: 4, title: '深夜聊天室', streamer: '暖心姐姐', avatar: '💕', viewers: '1.2万', thumbnail: '💬', isLive: true },
  { id: 5, title: '音乐现场', streamer: '吉他手', avatar: '🎸', viewers: '0.8万', thumbnail: '🎵', isLive: true },
  { id: 6, title: '户外探险', streamer: '冒险家', avatar: '🏔️', viewers: '0.5万', thumbnail: '🌄', isLive: true },
];

const LivePage: React.FC = () => {
  return (
    <div className="live-page">
      <header className="page-header">
        <h1 className="page-title">
          <span className="title-icon">📺</span>
          直播
        </h1>
        <div className="header-actions">
          <button className="header-btn">🔍</button>
          <button className="header-btn">📋</button>
        </div>
      </header>

      <section className="live-categories">
        <button className="cat-btn active">全部</button>
        <button className="cat-btn">热门</button>
        <button className="cat-btn">新人</button>
        <button className="cat-btn">才艺</button>
        <button className="cat-btn">游戏</button>
      </section>

      <section className="live-grid">
        {liveStreams.map((stream) => (
          <div key={stream.id} className="live-card">
            <div className="live-thumbnail">
              <span className="thumb-emoji">{stream.thumbnail}</span>
              <div className="live-badge">
                <span className="live-dot"></span>
                LIVE
              </div>
              <div className="viewer-count">👁 {stream.viewers}</div>
            </div>
            <div className="live-info">
              <div className="streamer-avatar">{stream.avatar}</div>
              <div className="streamer-details">
                <h3 className="live-title">{stream.title}</h3>
                <span className="streamer-name">{stream.streamer}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LivePage;
