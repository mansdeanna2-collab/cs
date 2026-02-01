import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import './HomePage.css';
import { useApi } from '../hooks';
import { useDebounce } from '../hooks/useDebounce';
import { Video, Category, DisplayVideo, VideoCategory } from '../types';
import { formatPlayCount } from '../utils';
import { Loading, EmptyState, ErrorMessage } from '../components/common';
import { getApiBaseUrl, getApiTimeout } from '../config/eov';

// ==================== 常量定义 (Constants) ====================

/**
 * 默认分类列表 (Default category list)
 */
const DEFAULT_CATEGORIES = ['推荐', '热门'] as const;

/**
 * Banner 项目 (Banner items)
 */
const BANNER_ITEMS = [
  { id: 1, title: '热门推荐', image: '🎬', color: '#FF4757' },
  { id: 2, title: '新片上线', image: '🌟', color: '#FF6B9D' },
  { id: 3, title: '精选合集', image: '💎', color: '#6C63FF' },
] as const;

/**
 * 分类表情映射 (Category emoji mapping)
 */
const CATEGORY_EMOJIS: Record<string, string> = {
  '搞笑': '😂',
  '剧情': '💕',
  '动作': '🥋',
  '动漫': '🎌',
  '科幻': '🚀',
  '恐怖': '👻',
  '纪录片': '📹',
  '音乐': '🎵',
  '默认': '🎬',
};

// ==================== 工具函数 (Utility Functions) ====================

/**
 * 获取分类对应的表情 (Get emoji for category)
 */
const getCategoryEmoji = (category: string): string => {
  return CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS['默认'];
};

/**
 * 将 API 视频转换为显示视频 (Convert API video to display video)
 */
const convertToDisplayVideo = (video: Video): DisplayVideo => ({
  id: video.id,
  title: video.title,
  thumbnail: video.thumbnail || getCategoryEmoji(video.category),
  views: formatPlayCount(video.play_count),
  duration: video.duration || '00:00',
});

/**
 * 将视频按分类分组 (Group videos by category)
 */
const groupVideosByCategory = (videos: Video[]): VideoCategory[] => {
  const grouped = videos.reduce<Record<string, Video[]>>((acc, video) => {
    const category = video.category || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(video);
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, vids], index) => ({
    id: index + 1,
    name,
    videos: vids.map(convertToDisplayVideo),
  }));
};

// ==================== 子组件 (Sub-components) ====================

/**
 * VideoCard - 视频卡片组件 (Video Card Component)
 */
interface VideoCardProps {
  video: DisplayVideo;
  size: 'large' | 'small';
  onClick: (id: number) => void;
}

const VideoCard = memo<VideoCardProps>(({ video, size, onClick }) => (
  <div
    className={`video-card ${size}`}
    onClick={() => onClick(video.id)}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onClick(video.id)}
    aria-label={`播放 ${video.title}`}
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
));

VideoCard.displayName = 'VideoCard';

/**
 * Banner - 轮播组件 (Banner Component)
 */
interface BannerProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const Banner = memo<BannerProps>(({ currentIndex, onIndexChange }) => (
  <section className="banner-section">
    <div className="banner-carousel">
      {BANNER_ITEMS.map((banner, index) => (
        <div
          key={banner.id}
          className={`banner-item ${index === currentIndex ? 'active' : ''}`}
          style={{ background: `linear-gradient(135deg, ${banner.color} 0%, ${banner.color}88 100%)` }}
        >
          <span className="banner-icon">{banner.image}</span>
          <span className="banner-title">{banner.title}</span>
        </div>
      ))}
    </div>
    <div className="banner-dots" role="tablist" aria-label="轮播图指示器">
      {BANNER_ITEMS.map((_, index) => (
        <span
          key={index}
          className={`dot ${index === currentIndex ? 'active' : ''}`}
          onClick={() => onIndexChange(index)}
          role="tab"
          aria-selected={index === currentIndex}
          aria-label={`第 ${index + 1} 张`}
          tabIndex={0}
        />
      ))}
    </div>
  </section>
));

Banner.displayName = 'Banner';

// ==================== 主组件 (Main Component) ====================

/**
 * HomePage - 首页组件 (Home Page Component)
 */
const HomePage: React.FC = () => {
  // 状态 (State)
  const [activeCategory, setActiveCategory] = useState<string>('推荐');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);
  const [videoCategories, setVideoCategories] = useState<VideoCategory[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 防抖搜索关键词 (Debounced search keyword)
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

  // API Hooks
  const videosApi = useApi<Video[]>();
  const categoriesApi = useApi<Category[]>();

  // 加载分类 (Load categories)
  const loadCategories = useCallback(async () => {
    const data = await categoriesApi.execute('/api/categories', { enableCache: true });
    if (data && data.length > 0) {
      setCategories(['推荐', ...data.map((c) => c.name)]);
    }
  }, [categoriesApi]);

  // 加载视频 (Load videos)
  const loadVideos = useCallback(async () => {
    let endpoint = '/api/videos?limit=20&offset=0';

    if (activeCategory === '热门') {
      endpoint = '/api/videos/top?limit=20';
    } else if (activeCategory !== '推荐') {
      endpoint = `/api/videos/category?category=${encodeURIComponent(activeCategory)}&limit=20&offset=0`;
    }

    const data = await videosApi.execute(endpoint);
    if (data) {
      setVideoCategories(groupVideosByCategory(data));
    }
  }, [activeCategory, videosApi]);

  // 搜索视频 (Search videos)
  const searchVideos = useCallback(async () => {
    if (!debouncedSearchKeyword.trim()) {
      loadVideos();
      return;
    }

    const endpoint = `/api/videos/search?keyword=${encodeURIComponent(debouncedSearchKeyword.trim())}&limit=20&offset=0`;
    const data = await videosApi.execute(endpoint);

    if (data) {
      setVideoCategories([{
        id: 1,
        name: `搜索结果: "${debouncedSearchKeyword}"`,
        videos: data.map(convertToDisplayVideo),
      }]);
    }
  }, [debouncedSearchKeyword, loadVideos, videosApi]);

  // 处理视频点击 (Handle video click)
  const handleVideoClick = useCallback(async (videoId: number) => {
    try {
      const baseUrl = getApiBaseUrl();
      const timeout = getApiTimeout();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      await fetch(`${baseUrl}/api/videos/${videoId}/play`, {
        method: 'POST',
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      console.log('Playing video:', videoId);
    } catch (err) {
      console.error('Failed to update play count:', err);
    }
  }, []);

  // 处理分类切换 (Handle category change)
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setSearchKeyword('');
  }, []);

  // 初始化加载 (Initial load)
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 当分类变化时加载视频 (Load videos when category changes)
  useEffect(() => {
    if (!debouncedSearchKeyword.trim()) {
      loadVideos();
    }
  }, [activeCategory, loadVideos, debouncedSearchKeyword]);

  // 当搜索关键词变化时搜索 (Search when keyword changes)
  useEffect(() => {
    if (debouncedSearchKeyword.trim()) {
      searchVideos();
    }
  }, [debouncedSearchKeyword, searchVideos]);

  // 渲染内容 (Render content)
  const renderContent = useMemo(() => {
    if (videosApi.isLoading) {
      return <Loading text="加载中..." />;
    }

    if (videosApi.error) {
      return (
        <ErrorMessage
          error={videosApi.error}
          onRetry={loadVideos}
          showDetails
        />
      );
    }

    if (videoCategories.length === 0) {
      return <EmptyState icon="📭" title="暂无视频内容" />;
    }

    return videoCategories.map((category) => (
      <section key={category.id} className="video-category">
        <div className="category-header">
          <h2 className="category-title">{category.name}</h2>
        </div>

        {category.videos.length > 0 && (
          <div className="video-grid">
            <VideoCard
              video={category.videos[0]}
              size="large"
              onClick={handleVideoClick}
            />

            {category.videos.length > 1 && (
              <div className="small-videos-grid">
                {category.videos.slice(1, 5).map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    size="small"
                    onClick={handleVideoClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="category-actions">
          <button className="action-btn refresh" onClick={loadVideos}>
            <span className="btn-icon">🔄</span>
            <span>换一换</span>
          </button>
          <button className="action-btn view-more">
            <span>查看更多</span>
            <span className="btn-icon">›</span>
          </button>
        </div>
      </section>
    ));
  }, [videosApi.isLoading, videosApi.error, videoCategories, handleVideoClick, loadVideos]);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="video-header">
        <div className="app-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">影视</span>
        </div>
        <div className="search-bar">
          <span className="search-icon" role="button" aria-label="搜索">🔍</span>
          <input
            type="text"
            placeholder="搜索视频..."
            className="search-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            aria-label="搜索视频"
          />
        </div>
        <button
          className="header-btn"
          onClick={loadVideos}
          aria-label="刷新"
        >
          <span>🔄</span>
        </button>
      </header>

      {/* Category Tabs */}
      <nav className="category-nav" role="tablist" aria-label="视频分类">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
            role="tab"
            aria-selected={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Banner */}
      <Banner currentIndex={currentBanner} onIndexChange={setCurrentBanner} />

      {/* Content */}
      {renderContent}
    </div>
  );
};

export default HomePage;
