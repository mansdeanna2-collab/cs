/**
 * Loading - 加载状态组件 (Loading State Component)
 * ================================================
 * 提供多种加载状态的展示组件
 * Provides loading state display components
 */

import React, { memo } from 'react';
import { classNames } from '../../utils';
import './Loading.css';

// ==================== 类型定义 (Type Definitions) ====================

/**
 * 加载器尺寸 (Loader Sizes)
 */
export type LoadingSize = 'sm' | 'md' | 'lg';

/**
 * Loading Props
 */
export interface LoadingProps {
  /** 尺寸 (Size) */
  size?: LoadingSize;
  /** 文本 (Text) */
  text?: string;
  /** 是否全屏 (Fullscreen) */
  fullscreen?: boolean;
  /** 是否使用覆盖层 (Use overlay) */
  overlay?: boolean;
  /** 自定义类名 (Custom class name) */
  className?: string;
}

// ==================== Loading 组件 (Loading Component) ====================

/**
 * Loading 组件 (Loading Component)
 */
export const Loading = memo<LoadingProps>(
  ({ size = 'md', text = '加载中...', fullscreen = false, overlay = false, className }) => {
    const containerClasses = classNames(
      'loading-container',
      `loading-${size}`,
      fullscreen && 'loading-fullscreen',
      overlay && 'loading-overlay',
      className
    );

    return (
      <div className={containerClasses}>
        <div className="loading-content">
          <div className="loading-spinner">
            <span className="spinner-icon">⏳</span>
          </div>
          {text && <span className="loading-text">{text}</span>}
        </div>
      </div>
    );
  }
);

Loading.displayName = 'Loading';

// ==================== Skeleton 组件 (Skeleton Component) ====================

/**
 * Skeleton Props
 */
export interface SkeletonProps {
  /** 宽度 (Width) */
  width?: string | number;
  /** 高度 (Height) */
  height?: string | number;
  /** 是否圆形 (Circle) */
  circle?: boolean;
  /** 是否圆角矩形 (Rounded) */
  rounded?: boolean;
  /** 行数 (用于段落) (Lines for paragraph) */
  lines?: number;
  /** 自定义类名 (Custom class name) */
  className?: string;
}

/**
 * Skeleton 组件 (Skeleton Component)
 */
export const Skeleton = memo<SkeletonProps>(
  ({ width, height, circle = false, rounded = true, lines, className }) => {
    if (lines && lines > 1) {
      return (
        <div className="skeleton-paragraph">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={classNames(
                'skeleton',
                rounded && 'skeleton-rounded',
                className
              )}
              style={{
                width: index === lines - 1 ? '60%' : '100%',
                height: height || '12px',
              }}
            />
          ))}
        </div>
      );
    }

    const style: React.CSSProperties = {
      width: circle ? height : width,
      height: height,
    };

    return (
      <div
        className={classNames(
          'skeleton',
          circle && 'skeleton-circle',
          rounded && !circle && 'skeleton-rounded',
          className
        )}
        style={style}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// ==================== LoadingOverlay 组件 (LoadingOverlay Component) ====================

/**
 * LoadingOverlay Props
 */
export interface LoadingOverlayProps {
  /** 是否显示 (Visible) */
  visible: boolean;
  /** 文本 (Text) */
  text?: string;
  /** 子元素 (Children) */
  children: React.ReactNode;
}

/**
 * LoadingOverlay 组件 (LoadingOverlay Component)
 */
export const LoadingOverlay = memo<LoadingOverlayProps>(
  ({ visible, text, children }) => (
    <div className="loading-overlay-wrapper">
      {children}
      {visible && <Loading overlay text={text} />}
    </div>
  )
);

LoadingOverlay.displayName = 'LoadingOverlay';

export default Loading;
