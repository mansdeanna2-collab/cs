import React, { useState, useEffect, useCallback } from 'react';
import './HomePage.css';
import { 
  Video as ApiVideo, 
  Category,
  getVideos, 
  getCategories,
  getVideosByCategory,
  getTopVideos,
  searchVideos,
  updatePlayCount 
} from '../services/api';

// 显示用的视频接口 (Display video interface)
interface DisplayVideo {
  id: number;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
}

// 视频分类接口 (Video category interface)
interface VideoCategory {
  id: number;
  name: string;
  videos: DisplayVideo[];
}

// 默认分类列表 (Default category list)
const defaultCategories = ['推荐', '热门'];

// Banner项目 (Banner items)
const bannerItems = [
  { id: 1, title: '热门推荐', image: '🎬', color: '#FF4757' },
  { id: 2, title: '新片上线', image: '🌟', color: '#FF6B9D' },
  { id: 3, title: '精选合集', image: '💎', color: '#6C63FF' },
];

// 默认缩略图表情映射 (Default thumbnail emoji mapping)
const categoryEmojis: Record<string, string> = {
  '搞笑': '😂',
  '剧情': '💕',
  '动作': '🥋',
  '动漫': '🎌',
  '科幻': '🚀',
  '恐怖': '👻',
  '纪录片': '📹',
  '音乐': '🎵',
  '默认': '🎬'
};

/**
 * 格式化播放次数 (Format play count)
 */
const formatPlayCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
};

/**
 * 获取分类对应的表情 (Get emoji for category)
 */
const getCategoryEmoji = (category: string): string => {
  return categoryEmojis[category] || categoryEmojis['默认'];
};

/**
 * 将API视频转换为显示视频 (Convert API video to display video)
 */
const convertToDisplayVideo = (video: ApiVideo): DisplayVideo => {
  return {
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail || getCategoryEmoji(video.category),
    views: formatPlayCount(video.play_count),
    duration: video.duration || '00:00'
  };
};

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('推荐');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 加载分类数据 (Load category data)
  const loadCategories = useCallback(async () => {
    try {
      const apiCategories = await getCategories();
      if (apiCategories && apiCategories.length > 0) {
        const categoryNames = ['推荐', ...apiCategories.map((c: Category) => c.name)];
        setCategories(categoryNames);
      }
    } catch (err) {
      console.error('加载分类失败 (Failed to load categories):', err);
      // 使用默认分类 (Use default categories)
    }
  }, []);

  // 加载视频数据 (Load video data)
  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let videos: ApiVideo[] = [];
      
      if (activeCategory === '推荐') {
        // 获取推荐视频（所有视频） (Get recommended videos - all videos)
        videos = await getVideos(20, 0);
      } else if (activeCategory === '热门') {
        // 获取热门视频 (Get top videos)
        videos = await getTopVideos(20);
      } else {
        // 按分类获取视频 (Get videos by category)
        videos = await getVideosByCategory(activeCategory, 20, 0);
      }

      // 将视频按分类分组 (Group videos by category)
      const groupedVideos = videos.reduce((acc: Record<string, ApiVideo[]>, video: ApiVideo) => {
        const category = video.category || '其他';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(video);
        return acc;
      }, {});

      // 转换为显示格式 (Convert to display format)
      const displayCategories: VideoCategory[] = Object.entries(groupedVideos).map(([name, vids], index) => ({
        id: index + 1,
        name,
        videos: vids.map(convertToDisplayVideo)
      }));

      setVideoCategories(displayCategories);
    } catch (err) {
      console.error('加载视频失败 (Failed to load videos):', err);
      setError('加载视频失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // 初始化加载 (Initialize loading)
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 当分类变化时重新加载视频 (Reload videos when category changes)
  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // 处理搜索 (Handle search)
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadVideos();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const videos = await searchVideos(searchKeyword.trim(), 20, 0);
      const displayVideos = videos.map(convertToDisplayVideo);
      
      setVideoCategories([{
        id: 1,
        name: `搜索结果: "${searchKeyword}"`,
        videos: displayVideos
      }]);
    } catch (err) {
      console.error('搜索失败 (Search failed):', err);
      setError('搜索失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理刷新 (Handle refresh)
  const handleRefresh = (categoryId: number) => {
    loadVideos();
  };

  // 处理查看更多 (Handle view more)
  const handleViewMore = (categoryId: number) => {
    // TODO: 实现导航到分类详情页 (Implement navigation to category detail page)
    console.log('View more for category:', categoryId);
  };

  // 处理视频点击 (Handle video click)
  const handleVideoClick = async (videoId: number) => {
    // 增加播放次数 (Increment play count)
    await updatePlayCount(videoId);
    // TODO: 实现视频播放功能 (Implement video playback)
    console.log('Playing video:', videoId);
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
          <span className="search-icon" onClick={handleSearch}>🔍</span>
          <input 
            type="text" 
            placeholder="搜索视频..." 
            className="search-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button className="header-btn" onClick={() => loadVideos()}>
          <span>🔄</span>
        </button>
      </header>

      {/* Category Tabs */}
      <nav className="category-nav">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              setSearchKeyword('');
            }}
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

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <span className="loading-text">加载中...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button className="retry-btn" onClick={() => loadVideos()}>
            重试
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && videoCategories.length === 0 && (
        <div className="empty-container">
          <span className="empty-icon">📭</span>
          <span className="empty-text">暂无视频内容</span>
        </div>
      )}

      {/* Video Categories */}
      {!isLoading && !error && videoCategories.map((category) => (
        <section key={category.id} className="video-category">
          <div className="category-header">
            <h2 className="category-title">{category.name}</h2>
          </div>
          
          {category.videos.length > 0 && (
            <div className="video-grid">
              {/* Large Video - First one */}
              <div 
                className="video-card large"
                onClick={() => handleVideoClick(category.videos[0].id)}
              >
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
              {category.videos.length > 1 && (
                <div className="small-videos-grid">
                  {category.videos.slice(1, 5).map((video) => (
                    <div 
                      key={video.id} 
                      className="video-card small"
                      onClick={() => handleVideoClick(video.id)}
                    >
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
              )}
            </div>
          )}

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
