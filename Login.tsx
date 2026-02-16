
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

interface Props {
  setView: (view: any) => void;
}

const Login: React.FC<Props> = ({ setView }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const email = `${phone}@mrclub.com`;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setView('wingo');
    } catch (err: any) {
      setError('Invalid phone or password.');
    }
  };

  return (
    <div className="min-h-screen bg-hgnice-red/10 p-6 flex flex-col items-center">
      <div className="w-20 h-20 bg-hgnice-gold rounded-full flex items-center justify-center mb-8 shadow-xl">
        <span className="text-2xl font-bold text-hgnice-red">MC</span>
      </div>
      
      <div className="w-full max-w-sm bg-neutral-900 border border-hgnice-gold/20 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-hgnice-gold mb-6 text-center">LOGIN</h2>
        {error && <p className="bg-red-500/20 text-red-500 p-2 rounded text-xs mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-neutral-400 text-sm">🇧🇩 +880</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 pl-20 pr-4 text-white focus:outline-none focus:border-hgnice-gold"
              placeholder="Phone Number"
              required
            />
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-hgnice-gold"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="w-full bg-hgnice-gold text-hgnice-red font-bold py-3 rounded-lg hover:bg-hgnice-gold/90"
          >
            LOGIN
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm mt-6">
          New to MR CLUB? 
          <button onClick={() => setView('register')} className="text-hgnice-gold ml-1 font-semibold">Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
