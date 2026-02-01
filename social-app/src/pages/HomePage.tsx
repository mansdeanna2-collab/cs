import React, { useState } from 'react';
import './HomePage.css';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
}

interface VideoCategory {
  id: number;
  name: string;
  videos: Video[];
}

const categories = ['推荐', '国产', '日本', '动漫', '福利'];

const bannerItems = [
  { id: 1, title: '热门推荐', image: '🎬', color: '#FF4757' },
  { id: 2, title: '新片上线', image: '🌟', color: '#FF6B9D' },
  { id: 3, title: '精选合集', image: '💎', color: '#6C63FF' },
];

const videoCategories: VideoCategory[] = [
  {
    id: 1,
    name: '搞笑',
    videos: [
      { id: 1, title: '爆笑喜剧精选合集', thumbnail: '😂', views: '128万', duration: '15:32' },
      { id: 2, title: '沙雕日常第一季', thumbnail: '🤣', views: '89万', duration: '08:45' },
      { id: 3, title: '搞笑配音系列', thumbnail: '😆', views: '56万', duration: '12:20' },
      { id: 4, title: '整蛊大合集', thumbnail: '🤭', views: '42万', duration: '18:55' },
      { id: 5, title: '神级吐槽精选', thumbnail: '😏', views: '35万', duration: '10:15' },
    ],
  },
  {
    id: 2,
    name: '剧情',
    videos: [
      { id: 6, title: '都市爱情故事', thumbnail: '💕', views: '256万', duration: '45:30' },
      { id: 7, title: '悬疑推理剧场', thumbnail: '🔍', views: '198万', duration: '38:20' },
      { id: 8, title: '青春校园系列', thumbnail: '🎓', views: '145万', duration: '28:45' },
      { id: 9, title: '家庭温情剧', thumbnail: '👨‍👩‍👧', views: '112万', duration: '52:10' },
      { id: 10, title: '职场励志故事', thumbnail: '💼', views: '87万', duration: '35:25' },
    ],
  },
  {
    id: 3,
    name: '动作',
    videos: [
      { id: 11, title: '武打精彩片段', thumbnail: '🥋', views: '312万', duration: '22:15' },
      { id: 12, title: '追车戏合集', thumbnail: '🚗', views: '245万', duration: '18:30' },
      { id: 13, title: '格斗比赛集锦', thumbnail: '🥊', views: '189万', duration: '25:40' },
      { id: 14, title: '特技表演精选', thumbnail: '🎪', views: '156万', duration: '15:55' },
      { id: 15, title: '战争场面剪辑', thumbnail: '⚔️', views: '123万', duration: '32:10' },
    ],
  },
];

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('推荐');
  const [currentBanner, setCurrentBanner] = useState(0);

  const handleRefresh = (categoryId: number) => {
    // Placeholder for refresh functionality
    console.log('Refreshing category:', categoryId);
  };

  const handleViewMore = (categoryId: number) => {
    // Placeholder for view more functionality
    console.log('View more for category:', categoryId);
  };

  return (
    <div className="home-page">
      {/* Header with App Name and Search */}
      <header className="video-header">
        <div className="app-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">影视</span>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="搜索视频..." 
            className="search-input"
          />
        </div>
        <button className="header-btn">
          <span>📋</span>
        </button>
      </header>

      {/* Category Tabs */}
      <nav className="category-nav">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Banner Carousel */}
      <section className="banner-section">
        <div className="banner-carousel">
          {bannerItems.map((banner, index) => (
            <div 
              key={banner.id}
              className={`banner-item ${index === currentBanner ? 'active' : ''}`}
              style={{ background: `linear-gradient(135deg, ${banner.color} 0%, ${banner.color}88 100%)` }}
            >
              <span className="banner-icon">{banner.image}</span>
              <span className="banner-title">{banner.title}</span>
            </div>
          ))}
        </div>
        <div className="banner-dots">
          {bannerItems.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === currentBanner ? 'active' : ''}`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Video Categories */}
      {videoCategories.map((category) => (
        <section key={category.id} className="video-category">
          <div className="category-header">
            <h2 className="category-title">{category.name}</h2>
          </div>
          
          <div className="video-grid">
            {/* Large Video - First one */}
            <div className="video-card large">
              <div className="video-thumbnail">
                <span className="thumb-emoji">{category.videos[0].thumbnail}</span>
                <span className="video-duration">{category.videos[0].duration}</span>
                <div className="play-overlay">
                  <span className="play-icon">▶</span>
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{category.videos[0].title}</h3>
                <span className="video-views">{category.videos[0].views}次播放</span>
              </div>
            </div>
            
            {/* Small Videos - 2x2 Grid */}
            <div className="small-videos-grid">
              {category.videos.slice(1, 5).map((video) => (
                <div key={video.id} className="video-card small">
                  <div className="video-thumbnail">
                    <span className="thumb-emoji">{video.thumbnail}</span>
                    <span className="video-duration">{video.duration}</span>
                    <div className="play-overlay">
                      <span className="play-icon">▶</span>
                    </div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <span className="video-views">{video.views}次播放</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="category-actions">
            <button className="action-btn refresh" onClick={() => handleRefresh(category.id)}>
              <span className="btn-icon">🔄</span>
              <span>换一换</span>
            </button>
            <button className="action-btn view-more" onClick={() => handleViewMore(category.id)}>
              <span>查看更多</span>
              <span className="btn-icon">›</span>
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;
