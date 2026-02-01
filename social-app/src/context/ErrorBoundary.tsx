/**
 * ErrorBoundary - 错误边界组件 (Error Boundary Component)
 * =======================================================
 * 捕获子组件树中的JavaScript错误，显示降级UI
 * Catches JavaScript errors in child component tree, displays fallback UI
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import './ErrorBoundary.css';

// ==================== 类型定义 (Type Definitions) ====================

/**
 * 错误信息接口 (Error Info Interface)
 */
export interface ErrorDetails {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: number;
}

/**
 * ErrorBoundary Props
 */
export interface ErrorBoundaryProps {
  /** 子组件 (Children) */
  children: ReactNode;
  /** 自定义降级UI (Custom fallback UI) */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** 错误发生时的回调 (Callback when error occurs) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 是否显示详细错误信息 (Show detailed error info) */
  showDetails?: boolean;
}

/**
 * ErrorBoundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// ==================== ErrorBoundary 组件 (ErrorBoundary Component) ====================

/**
 * ErrorBoundary - 错误边界组件 (Error Boundary Component)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // 调用错误回调 (Call error callback)
    this.props.onError?.(error, errorInfo);

    // 记录错误到控制台 (Log error to console)
    console.error('[ErrorBoundary] 捕获到错误 (Caught error):', error);
    console.error('[ErrorBoundary] 组件堆栈 (Component stack):', errorInfo.componentStack);
  }

  /**
   * 重置错误状态 (Reset error state)
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = false } = this.props;

    if (hasError && error) {
      // 使用自定义降级UI (Use custom fallback UI)
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.handleReset);
        }
        return fallback;
      }

      // 默认错误UI (Default error UI)
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <span className="error-boundary-icon">😵</span>
            <h2 className="error-boundary-title">出错了 / Something went wrong</h2>
            <p className="error-boundary-message">
              应用遇到了一个问题。请尝试刷新页面。
              <br />
              The application encountered a problem. Please try refreshing the page.
            </p>

            {showDetails && (
              <details className="error-boundary-details">
                <summary>查看详情 / View details</summary>
                <div className="error-boundary-stack">
                  <p><strong>错误 / Error:</strong> {error.message}</p>
                  {errorInfo && (
                    <pre>{errorInfo.componentStack}</pre>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                className="error-boundary-btn primary"
                onClick={this.handleReset}
              >
                🔄 重试 / Retry
              </button>
              <button
                className="error-boundary-btn secondary"
                onClick={() => window.location.reload()}
              >
                🔃 刷新页面 / Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// ==================== 函数式包装器 (Functional Wrapper) ====================

/**
 * withErrorBoundary - 高阶组件，为组件添加错误边界 (HOC to add error boundary to component)
 * @param WrappedComponent - 要包装的组件 (Component to wrap)
 * @param errorBoundaryProps - ErrorBoundary 属性 (ErrorBoundary props)
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundary;
}

export default ErrorBoundary;
