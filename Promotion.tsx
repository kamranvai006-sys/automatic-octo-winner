
import React from 'react';
import { User } from '../../types';

interface Props {
  user: User;
}

const Promotion: React.FC<Props> = ({ user }) => {
  const inviteLink = `${window.location.origin}/#register?code=${user.inviteCode}`;

  const commissionLevels = [
    { lvl: 1, rate: '0.6%' },
    { lvl: 2, rate: '0.18%' },
    { lvl: 3, rate: '0.05%' },
    { lvl: 4, rate: '0.01%' },
    { lvl: 5, rate: '0.01%' },
    { lvl: 6, rate: '0.01%' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-hgnice-red rounded-3xl p-6 text-center space-y-4 border-2 border-hgnice-gold/30">
        <h2 className="text-2xl font-bold text-hgnice-gold">Invite Your Friends</h2>
        <p className="text-xs text-neutral-300">Share your referral link and earn commissions up to 6 levels!</p>
        
        <div className="bg-neutral-900/50 p-4 rounded-xl border border-hgnice-gold/20">
          <p className="text-xs text-neutral-400 mb-2">My Invite Code</p>
          <p className="text-2xl font-black text-hgnice-gold tracking-widest">{user.inviteCode}</p>
        </div>

        <button 
          onClick={handleCopy}
          className="w-full bg-hgnice-gold text-hgnice-red font-bold py-3 rounded-xl shadow-xl active:scale-95"
        >
          COPY INVITE LINK
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
          <p className="text-xs text-neutral-400">Direct Referrals</p>
          <p className="text-xl font-bold text-white">0</p>
        </div>
        <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
          <p className="text-xs text-neutral-400">Total Team Size</p>
          <p className="text-xl font-bold text-white">0</p>
        </div>
      </div>

      {/* Salary Section */}
      <div className="bg-neutral-800 p-6 rounded-3xl border border-hgnice-gold/20 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-hgnice-gold/10 rounded-full flex items-center justify-center text-3xl">💰</div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white">Claim ৳550 Daily Salary</h3>
          <p className="text-[10px] text-neutral-400">Condition: 5 direct referrals deposit ৳100+ & bet ৳500+ daily.</p>
        </div>
        <button 
          className="w-full bg-hgnice-gold/20 border border-hgnice-gold/50 text-hgnice-gold font-bold py-2 rounded-xl opacity-50 cursor-not-allowed"
          disabled
        >
          CLAIM NOW
        </button>
      </div>

      {/* Commission Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-hgnice-gold text-sm px-2">6-Level Commission Breakdown</h3>
        <div className="grid grid-cols-1 gap-2">
          {commissionLevels.map(l => (
            <div key={l.lvl} className="bg-neutral-800 p-3 rounded-xl flex justify-between items-center border border-neutral-700/50">
              <span className="text-xs font-semibold text-neutral-300">Level {l.lvl} Commission</span>
              <span className="text-hgnice-gold font-bold">{l.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotion;
