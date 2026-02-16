
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';

interface Props {
  user: User;
}

const Aviator: React.FC<Props> = ({ user }) => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [bet1, setBet1] = useState({ active: false, amount: 10, autoCash: 2.0 });
  const [bet2, setBet2] = useState({ active: false, amount: 10, autoCash: 5.0 });
  const [history, setHistory] = useState<number[]>([]);
  const [resultMsg, setResultMsg] = useState<{ type: 'win' | 'loss', text: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let interval: any;
    if (isFlying) {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const next = prev + 0.01 + (prev * 0.005);
          // Check random crash logic
          if (Math.random() < (next > 2 ? 0.05 : 0.01)) {
            handleCrash(next);
            return next;
          }
          return next;
        });
      }, 100);
    } else {
      // Start new round after delay if not currently flying
      const startTimer = setTimeout(() => {
        setCrashed(false);
        setMultiplier(1.00);
        setIsFlying(true);
        setResultMsg(null);
      }, crashed ? 4000 : 0);
      return () => clearTimeout(startTimer);
    }
    return () => clearInterval(interval);
  }, [isFlying, crashed]);

  const handleCrash = (final: number) => {
    setIsFlying(false);
    setCrashed(true);
    setHistory(prev => [parseFloat(final.toFixed(2)), ...prev].slice(0, 10));
    
    if (bet1.active || bet2.active) {
       setResultMsg({ type: 'loss', text: 'FLEW AWAY!' });
    }
    
    setBet1(prev => ({ ...prev, active: false }));
    setBet2(prev => ({ ...prev, active: false }));
  };

  const cashout = (betNum: 1 | 2) => {
    if (!isFlying) return;
    const bet = betNum === 1 ? bet1 : bet2;
    if (!bet.active) return;

    const win = bet.amount * multiplier;
    setResultMsg({ type: 'win', text: `You Won ৳${win.toFixed(2)}` });
    
    if (betNum === 1) setBet1(prev => ({ ...prev, active: false }));
    else setBet2(prev => ({ ...prev, active: false }));
    
    // In real app, update DB balance here
  };

  return (
    <div className="p-4 space-y-4">
      {/* History Ribbon */}
      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
        {history.map((h, i) => (
          <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold border ${h > 2 ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-blue-500 text-blue-400 bg-blue-500/10'}`}>
            {h.toFixed(2)}x
          </span>
        ))}
        {history.length === 0 && <span className="text-neutral-500 text-xs italic">Waiting for results...</span>}
      </div>

      {/* Main Game Area */}
      <div className="relative h-64 bg-black/80 rounded-2xl border border-hgnice-gold/20 overflow-hidden">
        {/* Sky Background Grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
          {Array.from({length: 100}).map((_, i) => <div key={i} className="border border-white/10"></div>)}
        </div>

        {/* Multiplier Display */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h2 className={`text-6xl font-black transition-all ${crashed ? 'text-red-500' : 'text-white'}`}>
            {multiplier.toFixed(2)}x
          </h2>
        </div>

        {/* Plane Animation */}
        {isFlying && (
          <div 
            className="aviator-plane absolute bottom-10 left-10 text-4xl z-20"
            style={{ transform: `translate(${Math.min(multiplier * 20, 200)}px, -${Math.min(multiplier * 15, 120)}px) rotate(-15deg)` }}
          >
            ✈️
            <div className="absolute top-1/2 left-0 w-24 h-1 bg-red-500 blur-md -z-10 animate-pulse transform -translate-x-full"></div>
          </div>
        )}

        {/* Result Message */}
        {resultMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/90 px-6 py-2 rounded-full border-2 border-hgnice-gold shadow-2xl animate-bounce">
            <span className={`font-bold ${resultMsg.type === 'win' ? 'text-green-500' : 'text-red-500'}`}>
              {resultMsg.text}
            </span>
          </div>
        )}

        {crashed && !resultMsg && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
             <p className="text-red-500 font-bold text-2xl uppercase tracking-tighter italic">FLEW AWAY!</p>
             <p className="text-neutral-400 text-xs">Waiting for next round...</p>
          </div>
        )}
      </div>

      {/* Double Betting Boxes */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map(num => {
          const b = num === 1 ? bet1 : bet2;
          const setB = num === 1 ? setBet1 : setBet2;
          return (
            <div key={num} className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button onClick={() => setB(p => ({ ...p, amount: Math.max(10, p.amount - 10) }))} className="w-6 h-6 bg-neutral-700 rounded-full text-xs font-bold">-</button>
                  <span className="text-sm font-bold w-12 text-center">৳{b.amount}</span>
                  <button onClick={() => setB(p => ({ ...p, amount: p.amount + 10 }))} className="w-6 h-6 bg-neutral-700 rounded-full text-xs font-bold">+</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>Auto Cashout</span>
                <input 
                  type="number" 
                  value={b.autoCash}
                  onChange={(e) => setB(p => ({ ...p, autoCash: parseFloat(e.target.value) }))}
                  className="w-12 bg-neutral-900 border border-neutral-700 rounded px-1 text-white focus:outline-none"
                />
              </div>

              {b.active ? (
                <button 
                  onClick={() => cashout(num as 1 | 2)}
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg animate-pulse"
                >
                  <p className="text-xs">CASHOUT</p>
                  <p>৳{(b.amount * multiplier).toFixed(2)}</p>
                </button>
              ) : (
                <button 
                  onClick={() => setB(p => ({ ...p, active: true }))}
                  disabled={!isFlying && !crashed}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50"
                >
                  BET
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Aviator;
