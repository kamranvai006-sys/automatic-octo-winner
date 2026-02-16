
import React from 'react';
import { User } from '../../types';

interface Props {
  user: User;
  onOpenGame: (game: 'wingo' | 'aviator') => void;
}

const Home: React.FC<Props> = ({ user, onOpenGame }) => {
  return (
    <div className="space-y-4 p-4">
      {/* Premium Slider Mock */}
      <div className="w-full h-40 bg-gradient-to-br from-hgnice-red to-red-900 rounded-2xl border border-hgnice-gold/20 flex items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">🎰</div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-hgnice-gold tracking-tighter italic">BIG WIN EVENT</h2>
          <p className="text-xs text-white/70 uppercase">Weekly Jackpot Up To ৳100,000</p>
        </div>
      </div>

      {/* Marquee Notice */}
      <div className="bg-neutral-800/50 p-2 rounded-lg flex items-center gap-2 border border-neutral-700">
        <span className="text-lg">📢</span>
        <marquee className="text-xs text-neutral-300 font-medium">Welcome to MR CLUB! Get ৳17 Bonus on registration. Contact support for VIP rewards.</marquee>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onOpenGame('wingo')}
          className="group bg-[#1a1a1a] rounded-2xl p-4 border border-hgnice-gold/10 hover:border-hgnice-gold/50 transition-all text-left shadow-lg"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎰</div>
          <h3 className="font-bold text-hgnice-gold">WinGo</h3>
          <p className="text-[10px] text-neutral-500">Color & Number Guess</p>
        </button>
        
        <button 
          onClick={() => onOpenGame('aviator')}
          className="group bg-[#1a1a1a] rounded-2xl p-4 border border-hgnice-gold/10 hover:border-hgnice-gold/50 transition-all text-left shadow-lg"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">✈️</div>
          <h3 className="font-bold text-hgnice-gold">Aviator</h3>
          <p className="text-[10px] text-neutral-500">The Ultimate Crash Game</p>
        </button>

        {['Dragon Tiger', 'Fortune Gems', 'Coming Soon'].map((game, i) => (
          <div 
            key={i}
            className="bg-[#1a1a1a] rounded-2xl p-4 border border-neutral-800 opacity-40 text-left grayscale shadow-lg relative"
          >
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="font-bold text-neutral-400">{game}</h3>
            <p className="text-[10px] text-neutral-600">Releasing Soon...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
