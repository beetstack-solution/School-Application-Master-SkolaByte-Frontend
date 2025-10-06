// src/components/SpinnerLoader.tsx
import React, { useEffect, useState } from 'react';
import '@/assets/css/SpinnerLoader.css';

const SpinnerLoader = ({ duration = 5000 }: { duration?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in animation
    setIsVisible(true);
    
    // Set exit animation after duration
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 1000); // Start exit 1 second before end

    return () => clearTimeout(exitTimer);
  }, [duration]);

  if (isExiting) return null;

  return (
    <div className={`spinner-overlay ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
      <div className="spinner-content">
        <div className="spinner-orbits">
          <div className="orbit outer-orbit"></div>
          <div className="orbit middle-orbit"></div>
          <div className="orbit inner-orbit"></div>
          <div className="central-sphere"></div>
        </div>
        <div className="spinner-text">Preparing your dashboard...</div>
      </div>
    </div>
  );
};

export default SpinnerLoader;