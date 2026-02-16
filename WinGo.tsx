
import React, { useState, useEffect } from 'react';
import { User, WinGoResult } from '../../types';
import { db } from '../../firebase';
import { ref, update, onValue } from 'firebase/database';

interface Props {
  user: User;
  onBack: () => void;
}

const WinGo: React.FC<Props> = ({ user, onBack }) => {
  const [timerType, setTimerType] = useState<'30s' | '1m' | '3m' | '5m'>('1m');
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState<WinGoResult[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<string | number | null>(null);

  useEffect(() => {
    const durationMap = { '30s': 30, '1m': 60, '3m': 180, '5m': 300 };
    const duration = durationMap[timerType];

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = duration - (now % duration);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timerType]);

  const isLocked = timeLeft <= 5;

  const placeBet = async () => {
    if (isLocked) return alert("Betting closed for this period!");
    if (selectedBet === null) return alert("Please select a bet!");
    if (user.balance < betAmount) return alert("Insufficient balance!");

    const newBalance = user.balance - betAmount;
    await update(ref(db, `users/${user.uid}`), {
      balance: newBalance,
      betVolume: (user.betVolume || 0) + betAmount
    });

    alert(`Bet placed: ৳${betAmount} on ${selectedBet}`);
    setSelectedBet(null);
  };

  return (
    <div className="p-4 space-y-6">
      <button onClick={onBack} className="text-hgnice-gold font-bold">← BACK</button>
      
      {/* Timer Selection */}
      <div className="grid grid-cols-4 gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
        {(['30s', '1m', '3m', '5m'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimerType(t)}
            className={`py-2 rounded-lg text-xs font-black transition-all ${
              timerType === t ? 'bg-hgnice-gold text-hgnice-red shadow-lg' : 'text-neutral-500 hover:bg-neutral-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-hgnice-gold/10 flex justify-between items-center shadow-xl">
        <div className="space-y-1">
          <p className="text-[10px] text-neutral-500 uppercase font-black">Period Number</p>
          <p className="text-xl font-black text-hgnice-gold tracking-widest">
            {Math.floor(Date.now() / (timerType === '30s' ? 30000 : timerType === '1m' ? 60000 : timerType === '3m' ? 180000 : 300000))}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] text-neutral-500 uppercase font-black">Time Left</p>
          <p className={`text-4xl font-mono font-black ${isLocked ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Betting Board */}
      <div className={`space-y-6 transition-all ${isLocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setSelectedBet('Green')} className={`py-3 rounded-xl font-black shadow-lg ${selectedBet === 'Green' ? 'bg-green-600 scale-95 ring-2 ring-white' : 'bg-green-600/20 text-green-500 border border-green-600/30'}`}>GREEN</button>
          <button onClick={() => setSelectedBet('Violet')} className={`py-3 rounded-xl font-black shadow-lg ${selectedBet === 'Violet' ? 'bg-purple-600 scale-95 ring-2 ring-white' : 'bg-purple-600/20 text-purple-500 border border-purple-600/30'}`}>VIOLET</button>
          <button onClick={() => setSelectedBet('Red')} className={`py-3 rounded-xl font-black shadow-lg ${selectedBet === 'Red' ? 'bg-red-600 scale-95 ring-2 ring-white' : 'bg-red-600/20 text-red-500 border border-red-600/30'}`}>RED</button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({length: 10}).map((_, n) => (
            <button
              key={n}
              onClick={() => setSelectedBet(n)}
              className={`h-12 rounded-xl font-black text-lg transition-all border ${
                selectedBet === n ? 'bg-hgnice-gold text-hgnice-red scale-90 border-white' : 'bg-neutral-800 text-white border-neutral-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setSelectedBet('Big')} className={`py-4 rounded-2xl font-black text-xl shadow-lg ${selectedBet === 'Big' ? 'bg-orange-600 ring-2 ring-white' : 'bg-orange-600/20 text-orange-500 border border-orange-600/30'}`}>BIG</button>
          <button onClick={() => setSelectedBet('Small')} className={`py-4 rounded-2xl font-black text-xl shadow-lg ${selectedBet === 'Small' ? 'bg-blue-600 ring-2 ring-white' : 'bg-blue-600/20 text-blue-500 border border-blue-600/30'}`}>SMALL</button>
        </div>

        <div className="bg-[#222] p-4 rounded-2xl flex items-center justify-between border border-neutral-800">
          <div className="flex gap-1">
            {[10, 100, 1000, 5000].map(amt => (
              <button 
                key={amt} 
                onClick={() => setBetAmount(amt)}
                className={`w-10 h-10 rounded-lg text-[10px] font-black border transition-all ${betAmount === amt ? 'bg-hgnice-gold text-hgnice-red border-white' : 'bg-neutral-800 text-neutral-500 border-neutral-700'}`}
              >
                {amt}
              </button>
            ))}
          </div>
          <button 
            onClick={placeBet}
            className="bg-hgnice-gold text-hgnice-red font-black px-8 py-3 rounded-xl shadow-2xl active:scale-95 transition-transform"
          >
            BET NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinGo;
