/**
 * ErrorMessage - 错误消息组件 (Error Message Component)
 * ====================================================
 * 提供统一的错误消息展示
 * Provides unified error message display
 */

import React, { memo } from 'react';
import { AppError } from '../../types';
import { classNames } from '../../utils';
import { Button } from './Button';
import './ErrorMessage.css';

// ==================== 类型定义 (Type Definitions) ====================

/**
 * 错误消息变体 (Error Message Variants)
 */
export type ErrorVariant = 'inline' | 'block' | 'toast';

/**
 * ErrorMessage Props
 */
export interface ErrorMessageProps {
  /** 错误对象或错误消息 (Error object or message) */
  error: AppError | string | null;
  /** 变体样式 (Variant style) */
  variant?: ErrorVariant;
  /** 重试回调 (Retry callback) */
  onRetry?: () => void;
  /** 关闭回调 (Close callback) */
  onClose?: () => void;
  /** 是否显示详情 (Show details) */
  showDetails?: boolean;
  /** 自定义类名 (Custom class name) */
  className?: string;
}

// ==================== ErrorMessage 组件 (ErrorMessage Component) ====================

/**
 * ErrorMessage 组件 (ErrorMessage Component)
 */
export const ErrorMessage = memo<ErrorMessageProps>(
  ({
    error,
    variant = 'block',
    onRetry,
    onClose,
    showDetails = false,
    className,
  }) => {
    if (!error) return null;

    const errorObj = typeof error === 'string' ? null : error;
    const message = typeof error === 'string' ? error : error.message;

    const containerClasses = classNames(
      'error-message',
      `error-message-${variant}`,
      className
    );

    return (
      <div className={containerClasses}>
        <div className="error-message-content">
          <span className="error-message-icon">⚠️</span>
          <div className="error-message-text">
            <p className="error-message-main">{message}</p>
            {showDetails && errorObj && (
              <p className="error-message-details">
                错误代码 (Error code): {errorObj.code}
                {errorObj.status && ` | HTTP ${errorObj.status}`}
              </p>
            )}
          </div>
          {onClose && (
            <button
              className="error-message-close"
              onClick={onClose}
              aria-label="关闭 / Close"
            >
              ✕
            </button>
          )}
        </div>
        {onRetry && errorObj?.retryable && (
          <div className="error-message-actions">
            <Button variant="secondary" size="sm" onClick={onRetry} leftIcon="🔄">
              重试 / Retry
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

// ==================== EmptyState 组件 (EmptyState Component) ====================

/**
 * EmptyState Props
 */
export interface EmptyStateProps {
  /** 图标 (Icon) */
  icon?: string;
  /** 标题 (Title) */
  title?: string;
  /** 描述 (Description) */
  description?: string;
  /** 操作按钮 (Action button) */
  action?: React.ReactNode;
  /** 自定义类名 (Custom class name) */
  className?: string;
}

/**
 * EmptyState 组件 (EmptyState Component)
 */
export const EmptyState = memo<EmptyStateProps>(
  ({
    icon = '📭',
    title = '暂无内容',
    description,
    action,
    className,
  }) => {
    return (
      <div className={classNames('empty-state', className)}>
        <span className="empty-state-icon">{icon}</span>
        <h3 className="empty-state-title">{title}</h3>
        {description && <p className="empty-state-description">{description}</p>}
        {action && <div className="empty-state-action">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default ErrorMessage;
