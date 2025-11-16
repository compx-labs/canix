import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [loadingProgress, setLoadingProgress] = useState<number>(1);
  const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);

  const loadingMessages = [
    "Scanning DeFi protocols...",
    "Analyzing yield opportunities...",
    "Calculating APYs across Algorand...",
    "Fetching TVL data...",
    "Preparing your dashboard..."
  ];

  useEffect(() => {
    // Progress bar animation (5 segments over 5 seconds)
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 5) {
          return 5;
        }
        return prev + 1;
      });
    }, 1000);

    // Text cycling animation (change every 1.5 seconds)
    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % 5);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-graphite flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        {/* Logo */}
        <img 
          src="/logo-long.png" 
          alt="Canix" 
          className="h-44 mx-auto mb-8"
        />
        
        {/* 5-Segment Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((segment) => (
            <div
              key={segment}
              className={`flex-1 h-2 transition-all duration-500 ${
                loadingProgress >= segment
                  ? 'bg-crimson shadow-glow'
                  : 'bg-graphite-100'
              }`}
            />
          ))}
        </div>
        
        {/* Cycling Text */}
        <p className="text-silver/80 text-sm font-mono animate-pulse">
          {loadingMessages[loadingTextIndex]}
        </p>
      </div>
    </div>
  );
}

