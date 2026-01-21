import React, { useState, useEffect } from 'react';
import './StatusBar.css';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [batteryLevel] = useState<number>(85);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-time">{time}</span>
      </div>
      <div className="status-center">
        <div className="notch"></div>
      </div>
      <div className="status-right">
        <span className="status-signal">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.5"/>
            <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
            <rect x="9" y="2" width="3" height="10" rx="0.5"/>
            <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
          </svg>
        </span>
        <span className="status-wifi">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
            <path d="M8 6c2.2 0 4.2.9 5.7 2.3l-1.4 1.4C11.1 8.6 9.6 8 8 8s-3.1.6-4.3 1.7L2.3 8.3C3.8 6.9 5.8 6 8 6z"/>
            <path d="M8 2c3.5 0 6.6 1.4 8.9 3.6l-1.4 1.4C13.5 5.1 10.9 4 8 4S2.5 5.1.5 7L-.9 5.6C1.4 3.4 4.5 2 8 2z"/>
          </svg>
        </span>
        <span className="status-battery">
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeWidth="1"/>
            <rect x="23" y="3.5" width="2" height="5" rx="0.5" fill="currentColor"/>
            <rect x="2" y="2" width={`${batteryLevel * 0.17}`} height="8" rx="1" fill="currentColor"/>
          </svg>
          <span className="battery-text">{batteryLevel}%</span>
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
