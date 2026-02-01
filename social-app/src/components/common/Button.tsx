/**
 * Button - 通用按钮组件 (Common Button Component)
 * ================================================
 * 提供多种变体的可复用按钮组件
 * Provides reusable button component with multiple variants
 */

import React, { memo, forwardRef, ButtonHTMLAttributes } from 'react';
import { classNames } from '../../utils';
import './Button.css';

// ==================== 类型定义 (Type Definitions) ====================

/**
 * 按钮变体 (Button Variants)
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

/**
 * 按钮尺寸 (Button Sizes)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button Props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 变体样式 (Variant style) */
  variant?: ButtonVariant;
  /** 尺寸 (Size) */
  size?: ButtonSize;
  /** 是否充满宽度 (Full width) */
  fullWidth?: boolean;
  /** 是否加载中 (Loading state) */
  loading?: boolean;
  /** 左侧图标 (Left icon) */
  leftIcon?: React.ReactNode;
  /** 右侧图标 (Right icon) */
  rightIcon?: React.ReactNode;
  /** 是否只显示图标 (Icon only) */
  iconOnly?: boolean;
}

// ==================== Button 组件 (Button Component) ====================

/**
 * Button 组件 (Button Component)
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        loading = false,
        leftIcon,
        rightIcon,
        iconOnly = false,
        className,
        disabled,
        children,
        ...props
      },
      ref
    ) => {
      const buttonClasses = classNames(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full-width',
        loading && 'btn-loading',
        iconOnly && 'btn-icon-only',
        className
      );

      return (
        <button
          ref={ref}
          className={buttonClasses}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <span className="btn-spinner">⏳</span>
          ) : (
            <>
              {leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
              {!iconOnly && children && <span className="btn-text">{children}</span>}
              {rightIcon && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
            </>
          )}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

export default Button;
