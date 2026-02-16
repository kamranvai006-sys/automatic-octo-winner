
import React, { useState } from 'react';
import { User } from '../../types';

interface Props {
  user: User;
}

const Activity: React.FC<Props> = ({ user }) => {
  const [giftCode, setGiftCode] = useState('');

  return (
    <div className="p-4 space-y-6">
      <div className="bg-hgnice-red rounded-3xl p-6 border-2 border-hgnice-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-hgnice-gold/5 rounded-full blur-3xl"></div>
        <h2 className="text-2xl font-bold text-hgnice-gold mb-1">Activity Rewards</h2>
        <p className="text-xs text-white/60 mb-6 uppercase tracking-widest">Complete missions to earn cash</p>

        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-2xl border border-hgnice-gold/10 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">Daily Salary</p>
              <p className="text-[10px] text-neutral-400">৳550 Daily for active promoters</p>
            </div>
            <button className="bg-hgnice-gold text-hgnice-red font-bold px-4 py-1.5 rounded-full text-xs opacity-50 cursor-not-allowed">
              CLAIM
            </button>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-hgnice-gold/10 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">First Deposit Bonus</p>
              <p className="text-[10px] text-neutral-400">Get 10% extra on first deposit</p>
            </div>
            <button className="bg-hgnice-gold text-hgnice-red font-bold px-4 py-1.5 rounded-full text-xs">
              GO
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <h3 className="text-hgnice-gold font-bold mb-4 flex items-center gap-2">
          <span>🎁</span> Gift Code Redeem
        </h3>
        <div className="space-y-4">
          <input 
            type="text"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
            placeholder="Please enter the gift code"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-hgnice-gold"
          />
          <button className="w-full bg-hgnice-gold text-hgnice-red font-black py-4 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest">
            REDEEM NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Activity;
