import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-shapes">
        <div className="shape circle">
          <svg viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" />
          </svg>
        </div>
        <div className="shape triangle">
          <svg viewBox="0 0 40 40">
            <polygon points="20,4 36,36 4,36" />
          </svg>
        </div>
        <div className="shape square">
          <svg viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" />
          </svg>
        </div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;
