
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, onValue, update, remove, get } from 'firebase/database';
import { User, Transaction } from '../../types';

interface Props {
  onClose: () => void;
}

const AdminPanel: React.FC<Props> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authenticated) return;
    
    onValue(ref(db, 'users'), (snap) => {
      const data = snap.val();
      if (data) setUsers(Object.values(data));
    });

    onValue(ref(db, 'deposits'), (snap) => {
      const data = snap.val();
      if (data) setDeposits(Object.values(data));
    });

    onValue(ref(db, 'withdrawals'), (snap) => {
      const data = snap.val();
      if (data) setWithdrawals(Object.values(data));
    });
  }, [authenticated]);

  const verifyPin = () => {
    if (pin === 'admin9900') setAuthenticated(true);
    else alert("Incorrect Admin Password.");
  };

  const approveDeposit = async (dep: Transaction) => {
    if (!window.confirm(`Approve ৳${dep.amount} for ${dep.phone}?`)) return;
    
    // Get user to update balance
    const userRef = ref(db, `users/${dep.userId}`);
    const snap = await get(userRef);
    if (snap.exists()) {
      const user = snap.val();
      await update(userRef, { 
        balance: user.balance + dep.amount,
        totalDeposited: (user.totalDeposited || 0) + dep.amount
      });
      await update(ref(db, `deposits/${dep.id}`), { status: 'approved' });
      alert("Deposit Approved!");
    }
  };

  const rejectTransaction = async (type: 'deposits' | 'withdrawals', id: string) => {
    if (window.confirm("Reject this request?")) {
      await update(ref(db, `${type}/${id}`), { status: 'rejected' });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-purple-500 uppercase tracking-widest">Master Auth</h2>
        <input 
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full max-w-xs bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white text-center text-2xl tracking-widest"
          placeholder="****"
        />
        <button onClick={verifyPin} className="w-full max-w-xs bg-purple-600 py-4 rounded-xl font-bold text-white shadow-lg">ENTER MASTER PANEL</button>
        <button onClick={onClose} className="text-neutral-500 text-sm">Cancel</button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 bg-neutral-950 min-h-screen text-white pb-32">
      <div className="flex justify-between items-center bg-purple-900/20 p-4 rounded-2xl border border-purple-500/20">
        <div>
          <h1 className="text-xl font-black text-purple-400">MASTER ADMIN</h1>
          <p className="text-[10px] text-neutral-500 uppercase">System Target: 01964273220</p>
        </div>
        <button onClick={onClose} className="text-xs bg-white/10 px-3 py-1 rounded-full">EXIT</button>
      </div>

      {/* Pending Deposits */}
      <section className="space-y-4">
        <h2 className="font-black text-xs text-green-500 uppercase border-b border-green-500/20 pb-2">Pending Deposits ({deposits.filter(d => d.status === 'pending').length})</h2>
        <div className="space-y-3">
          {deposits.filter(d => d.status === 'pending').map(d => (
            <div key={d.id} className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-black text-green-500">৳{d.amount}</p>
                  <p className="text-xs text-neutral-400 font-mono">{d.phone}</p>
                  <p className="text-[10px] text-purple-400 font-bold uppercase mt-1">TrxID: {d.trxId}</p>
                </div>
                <p className="text-[10px] text-neutral-600">{new Date(d.timestamp).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => approveDeposit(d)} className="bg-green-600 py-2 rounded-lg text-xs font-bold uppercase">Approve</button>
                <button onClick={() => rejectTransaction('deposits', d.id)} className="bg-red-600/20 text-red-500 py-2 rounded-lg text-xs font-bold uppercase border border-red-600/30">Reject</button>
              </div>
            </div>
          ))}
          {deposits.filter(d => d.status === 'pending').length === 0 && <p className="text-center text-xs text-neutral-600 py-4 italic">No pending deposits.</p>}
        </div>
      </section>

      {/* Pending Withdrawals */}
      <section className="space-y-4">
        <h2 className="font-black text-xs text-orange-500 uppercase border-b border-orange-500/20 pb-2">Pending Withdrawals ({withdrawals.filter(w => w.status === 'pending').length})</h2>
        <div className="space-y-3">
          {withdrawals.filter(w => w.status === 'pending').map(w => (
            <div key={w.id} className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-black text-orange-500">৳{w.amount}</p>
                  <p className="text-xs text-neutral-400 font-mono">{w.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-orange-600 py-2 rounded-lg text-xs font-bold uppercase">Mark Paid</button>
                <button onClick={() => rejectTransaction('withdrawals', w.id)} className="bg-red-600/20 text-red-500 py-2 rounded-lg text-xs font-bold uppercase border border-red-600/30">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Rigging */}
      <section className="bg-purple-900/10 p-6 rounded-3xl border border-purple-500/20">
        <h3 className="text-xs font-black text-purple-400 uppercase mb-4 tracking-tighter">Manual Result Rigging (NEXT PERIOD)</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({length: 10}).map((_, n) => (
            <button key={n} onClick={() => alert(`Rigged for NEXT: ${n}`)} className="bg-neutral-800 border border-neutral-700 py-3 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-colors">{n}</button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
