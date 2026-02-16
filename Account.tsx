
import React, { useState } from 'react';
import { User } from '../../types';
import { auth, db } from '../../firebase';
import { ref, update } from 'firebase/database';

interface Props {
  user: User;
  setView: (view: any) => void;
}

const Account: React.FC<Props> = ({ user, setView }) => {
  const [giftCode, setGiftCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const vipProgress = Math.min(100, (user.betVolume / 5000) * 100);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      auth.signOut();
    }
  };

  const handleRedeem = async () => {
    if (!giftCode) return;
    setRedeeming(true);
    // Simulate API delay
    setTimeout(() => {
      alert("Invalid or expired gift code.");
      setRedeeming(false);
      setGiftCode('');
    }, 1000);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4 bg-hgnice-red p-6 rounded-3xl shadow-xl border border-hgnice-gold/20">
        <div className="w-16 h-16 bg-hgnice-gold rounded-full flex items-center justify-center text-3xl border-4 border-hgnice-red shadow-inner font-bold text-hgnice-red">
          {user.phone.slice(-2)}
        </div>
        <div>
          <p className="font-bold text-white text-lg">{user.phone}</p>
          <div className="bg-hgnice-gold text-hgnice-red px-2 py-0.5 rounded text-[10px] font-bold inline-block">
            VIP {user.vipLevel}
          </div>
          <p className="text-[10px] text-hgnice-gold/70 mt-1">UID: {user.uid.slice(0, 8)}</p>
        </div>
      </div>

      <div className="bg-neutral-800 p-6 rounded-3xl border border-hgnice-gold/20 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white">VIP Level Status</h3>
          <span className="text-xs text-neutral-400">{user.betVolume} / 5000</span>
        </div>
        <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-700">
          <div 
            className="h-full bg-gradient-to-r from-yellow-600 to-hgnice-gold transition-all duration-1000"
            style={{ width: `${vipProgress}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-neutral-500 text-center">Bet ৳{Math.max(0, 5000 - user.betVolume)} more to reach VIP 1</p>
      </div>

      {/* Gift Code - Strictly below VIP Section */}
      <div className="bg-neutral-800 p-6 rounded-3xl border border-neutral-700 space-y-3">
        <h3 className="font-bold text-sm text-neutral-300">Redeem Gift Code</h3>
        <div className="flex gap-2">
          <input 
            type="text"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
            placeholder="Enter Code"
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 text-white focus:outline-none focus:border-hgnice-gold"
          />
          <button 
            onClick={handleRedeem}
            disabled={redeeming}
            className="bg-hgnice-gold text-hgnice-red font-bold px-4 py-2 rounded-xl active:scale-95 disabled:opacity-50"
          >
            {redeeming ? '...' : 'REDEEM'}
          </button>
        </div>
      </div>

      {/* Action List */}
      <div className="bg-neutral-800 rounded-3xl overflow-hidden border border-neutral-700">
        {[
          { label: 'Wallet', icon: '💳' },
          { label: 'Betting Records', icon: '📝' },
          { label: 'Withdraw History', icon: '🕒' },
          { label: 'Security Center', icon: '🔒' },
          { label: 'About Us', icon: 'ℹ️' },
        ].map((item, idx) => (
          <button key={idx} className="w-full p-4 flex items-center justify-between hover:bg-neutral-700/50 transition-colors border-b border-neutral-700 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-neutral-500">›</span>
          </button>
        ))}
      </div>

      {user.isAdmin && (
        <button 
          onClick={() => setView('admin')}
          className="w-full bg-purple-600/20 text-purple-400 font-bold py-3 rounded-2xl border border-purple-600/50"
        >
          OPEN ADMIN PANEL
        </button>
      )}

      <button 
        onClick={handleLogout}
        className="w-full bg-red-600/10 text-red-500 font-bold py-3 rounded-2xl border border-red-600/30 active:scale-95"
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Account;
