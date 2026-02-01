/**
 * Card - 通用卡片组件 (Common Card Component)
 * ==========================================
 * 提供多种变体的可复用卡片组件
 * Provides reusable card component with multiple variants
 */

import React, { memo, forwardRef, HTMLAttributes } from 'react';
import { classNames } from '../../utils';
import './Card.css';

// ==================== 类型定义 (Type Definitions) ====================

/**
 * 卡片变体 (Card Variants)
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

/**
 * Card Props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 变体样式 (Variant style) */
  variant?: CardVariant;
  /** 是否可点击 (Clickable) */
  clickable?: boolean;
  /** 是否无内边距 (No padding) */
  noPadding?: boolean;
  /** 头部内容 (Header content) */
  header?: React.ReactNode;
  /** 尾部内容 (Footer content) */
  footer?: React.ReactNode;
}

// ==================== Card 组件 (Card Component) ====================

/**
 * Card 组件 (Card Component)
 */
export const Card = memo(
  forwardRef<HTMLDivElement, CardProps>(
    (
      {
        variant = 'default',
        clickable = false,
        noPadding = false,
        header,
        footer,
        className,
        children,
        ...props
      },
      ref
    ) => {
      const cardClasses = classNames(
        'card',
        `card-${variant}`,
        clickable && 'card-clickable',
        noPadding && 'card-no-padding',
        className
      );

      return (
        <div ref={ref} className={cardClasses} {...props}>
          {header && <div className="card-header">{header}</div>}
          <div className="card-body">{children}</div>
          {footer && <div className="card-footer">{footer}</div>}
        </div>
      );
    }
  )
);

Card.displayName = 'Card';

// ==================== CardHeader 组件 (CardHeader Component) ====================

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = memo(
  forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ title, subtitle, action, className, children, ...props }, ref) => (
      <div ref={ref} className={classNames('card-header', className)} {...props}>
        {children || (
          <>
            <div className="card-header-content">
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
            {action && <div className="card-header-action">{action}</div>}
          </>
        )}
      </div>
    )
  )
);

CardHeader.displayName = 'CardHeader';

// ==================== CardBody 组件 (CardBody Component) ====================

export const CardBody = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
      <div ref={ref} className={classNames('card-body', className)} {...props}>
        {children}
      </div>
    )
  )
);

CardBody.displayName = 'CardBody';

// ==================== CardFooter 组件 (CardFooter Component) ====================

export const CardFooter = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
      <div ref={ref} className={classNames('card-footer', className)} {...props}>
        {children}
      </div>
    )
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
