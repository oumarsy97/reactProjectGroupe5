import React, { useEffect, useState } from 'react';

const BlinkingLamp = ({ x, y, size, hue }) => (
  <div 
    className="absolute rounded-full animate-synchronized-blink"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: `hsl(${hue}, 100%, 50%)`,
      boxShadow: `0 0 ${size/2}px ${size/4}px hsl(${hue}, 100%, 50%)`
    }}
  />
);

const AnimatedBackground = () => {
  const lamps = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    hue: Math.random() * 60 + 280,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-800">
      {lamps.map((lamp, index) => (
        <BlinkingLamp key={index} {...lamp} />
      ))}
    </div>
  );
};

const LoadingSpinner = ({ isVisible }) => (
  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="w-20 h-20 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const DemoWithLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const spinnerTimer = setTimeout(() => setShowSpinner(true), 500);
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 30000); // 30 seconds to simulate loading
    
    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gray-800 text-white">
      <AnimatedBackground />
      <LoadingSpinner isVisible={showSpinner && isLoading} />
      {!isLoading && (
        <div className="relative z-10 text-3xl font-bold animate-fade-in">
          Content Loaded!
        </div>
      )}
    </div>
  );
};

export default DemoWithLoading;