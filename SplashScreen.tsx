
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-hgnice-red flex flex-col items-center justify-center z-[100]">
      <div className="w-32 h-32 bg-hgnice-gold rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
        <span className="text-4xl font-bold text-hgnice-red">MC</span>
      </div>
      <h1 className="text-3xl font-bold text-hgnice-gold tracking-widest uppercase">MR CLUB</h1>
      <p className="text-hgnice-gold/60 mt-2 text-sm">Loading Excellence...</p>
    </div>
  );
};

export default SplashScreen;
