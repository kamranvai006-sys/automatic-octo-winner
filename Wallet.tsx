
import React, { useState } from 'react';
import { User } from '../../types';
import { db } from '../../firebase';
import { ref, push, set } from 'firebase/database';

interface Props {
  user: User;
}

const Wallet: React.FC<Props> = ({ user }) => {
  const [mode, setMode] = useState<'main' | 'deposit' | 'withdraw'>('main');
  const [depositAmount, setDepositAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [step, setStep] = useState(1);

  const handleDeposit = async () => {
    if (!trxId) return alert("Please enter TrxID");
    const depRef = ref(db, 'deposits');
    const newDepRef = push(depRef);
    await set(newDepRef, {
      id: newDepRef.key,
      userId: user.uid,
      phone: user.phone,
      amount: parseFloat(depositAmount),
      trxId: trxId,
      status: 'pending',
      timestamp: Date.now()
    });
    alert("Deposit request submitted! Please wait for approval.");
    setMode('main');
    setStep(1);
    setTrxId('');
    setDepositAmount('');
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 100) return alert("Min withdrawal ৳100");
    if (user.balance < amt) return alert("Insufficient balance");
    
    // Security check: Total Bet must be >= Total Deposit
    const totalDeposited = user.totalDeposited || 0;
    const betVolume = user.betVolume || 0;
    if (betVolume < totalDeposited) {
      return alert(`Verification failed. Your betting volume (৳${betVolume}) must be greater than or equal to your total deposits (৳${totalDeposited}). Play more to unlock withdrawal.`);
    }

    const withdrawRef = ref(db, 'withdrawals');
    const newWithRef = push(withdrawRef);
    await set(newWithRef, {
      id: newWithRef.key,
      userId: user.uid,
      phone: user.phone,
      amount: amt,
      status: 'pending',
      timestamp: Date.now()
    });
    alert("Withdrawal request submitted.");
    setMode('main');
    setWithdrawAmount('');
  };

  if (mode === 'deposit') {
    return (
      <div className="p-4 space-y-6">
        <button onClick={() => {setMode('main'); setStep(1);}} className="text-hgnice-gold font-bold">← BACK</button>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Deposit Fund</h2>
        
        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400">Select or Enter Amount</p>
            <div className="grid grid-cols-3 gap-2">
              {[200, 500, 1000, 2000, 5000, 10000].map(a => (
                <button key={a} onClick={() => setDepositAmount(a.toString())} className={`py-3 rounded-lg border ${depositAmount === a.toString() ? 'border-hgnice-gold bg-hgnice-gold/10 text-hgnice-gold' : 'border-neutral-700 text-neutral-400'}`}>৳{a}</button>
              ))}
            </div>
            <input 
              type="number" 
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl p-4 text-white focus:outline-none focus:border-hgnice-gold"
            />
            <button 
              disabled={!depositAmount}
              onClick={() => setStep(2)}
              className="w-full bg-hgnice-gold text-hgnice-red font-black py-4 rounded-xl disabled:opacity-50"
            >
              NEXT STEP
            </button>
          </div>
        ) : (
          <div className="space-y-6 bg-[#1a1a1a] p-6 rounded-3xl border border-neutral-800">
            <div className="space-y-1">
              <p className="text-[10px] text-neutral-500 uppercase">Payment Target (Bkash/Nagad)</p>
              <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-hgnice-gold/20">
                <span className="text-hgnice-gold font-bold text-lg">01964273220</span>
                <button onClick={() => navigator.clipboard.writeText('01964273220')} className="text-[10px] text-neutral-400 border border-neutral-700 px-2 py-1 rounded">COPY</button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-neutral-500 uppercase">Amount to pay</p>
              <p className="text-2xl font-black text-white">৳{depositAmount}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-neutral-400">Enter Transaction ID (TrxID)</p>
              <input 
                type="text" 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="8 to 10 characters TrxID"
                className="w-full bg-black border border-neutral-700 rounded-xl p-4 text-white focus:outline-none focus:border-hgnice-gold"
              />
            </div>

            <button 
              onClick={handleDeposit}
              className="w-full bg-hgnice-gold text-hgnice-red font-black py-4 rounded-xl shadow-lg"
            >
              CONFIRM DEPOSIT
            </button>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'withdraw') {
    return (
      <div className="p-4 space-y-6">
        <button onClick={() => setMode('main')} className="text-hgnice-gold font-bold">← BACK</button>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Withdraw Funds</h2>
        
        <div className="bg-hgnice-red/10 p-4 rounded-xl border border-hgnice-red/30 space-y-2">
          <p className="text-[10px] text-hgnice-gold font-bold uppercase">Withdrawal Rules</p>
          <ul className="text-[10px] text-neutral-400 list-disc pl-4">
            <li>Minimum withdrawal: ৳100</li>
            <li>Processing time: 10 mins to 24 hours</li>
            <li>Bet Volume must be ≥ Total Deposit</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
             <p className="text-[10px] text-neutral-500">Withdraw Amount</p>
             <input 
                type="number" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Minimum ৳100"
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-xl p-4 text-white focus:outline-none"
             />
          </div>
          <button 
            onClick={handleWithdraw}
            className="w-full bg-hgnice-gold text-hgnice-red font-black py-4 rounded-xl shadow-lg"
          >
            WITHDRAW NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-hgnice-red p-8 rounded-3xl border border-hgnice-gold/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-4xl opacity-10">👛</div>
        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Total Balance</p>
        <div className="flex items-baseline gap-1">
          <span className="text-hgnice-gold font-black text-lg">৳</span>
          <span className="text-4xl font-black text-white">{user.balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setMode('deposit')}
          className="bg-hgnice-gold text-hgnice-red font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          DEPOSIT
        </button>
        <button 
          onClick={() => setMode('withdraw')}
          className="bg-neutral-800 text-hgnice-gold font-black py-4 rounded-2xl border border-hgnice-gold/20 shadow-lg active:scale-95 transition-transform"
        >
          WITHDRAW
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <span className="text-xs font-bold text-neutral-400 uppercase">Recent Transactions</span>
          <button className="text-[10px] text-hgnice-gold underline">View All</button>
        </div>
        <div className="p-8 text-center space-y-2 opacity-50">
          <p className="text-4xl">📄</p>
          <p className="text-xs text-neutral-500">No transaction data yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
