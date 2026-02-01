import React from 'react';
import './DarkWebPage.css';

const DarkWebPage: React.FC = () => {
  return (
    <div className="darkweb-page">
      <header className="page-header">
        <h1 className="page-title">
          <span className="title-icon">🌐</span>
          暗网
        </h1>
      </header>
      
      <div className="content-placeholder">
        <span className="placeholder-icon">🔒</span>
        <h2>私密内容</h2>
        <p>登录后查看更多精彩内容</p>
        <button className="login-btn">立即登录</button>
      </div>
    </div>
  );
};

export default DarkWebPage;
