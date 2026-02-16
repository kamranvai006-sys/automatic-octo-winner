
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../../firebase';

interface Props {
  setView: (view: any) => void;
}

const Register: React.FC<Props> = ({ setView }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isCaptchaDone, setIsCaptchaDone] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inviteCode) return setError('Mandatory Invitation Code required.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 8) return setError('Min 8 characters (letters + numbers).');
    if (!isCaptchaDone) return setError('Please slide to verify.');

    try {
      // Check if phone already registered (we use phone as pseudo-email for auth)
      const email = `${phone}@mrclub.com`;
      
      // Check invite code validity (mock check for demo, usually fetches from DB)
      if (inviteCode !== 'VIP777' && inviteCode.length < 5) {
        return setError('Invalid Invite Code.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        phone,
        balance: 17, // Welcome Bonus
        inviteCode: Math.random().toString(36).substring(7).toUpperCase(),
        referrerInviteCode: inviteCode,
        vipLevel: 0,
        betVolume: 0,
        isBanned: false,
        createdAt: Date.now()
      };

      await set(ref(db, `users/${user.uid}`), userData);
      // Logic for crediting referrer would go here...

      alert('Registration Successful! ৳17 bonus added.');
      setView('wingo');
    } catch (err: any) {
      setError(err.message.includes('email-already-in-use') ? 'Phone number already registered.' : err.message);
    }
  };

  return (
    <div className="min-h-screen bg-hgnice-red/10 p-6 flex flex-col items-center">
      <div className="w-20 h-20 bg-hgnice-gold rounded-full flex items-center justify-center mb-8 shadow-xl">
        <span className="text-2xl font-bold text-hgnice-red">MC</span>
      </div>
      
      <div className="w-full max-w-sm bg-neutral-900 border border-hgnice-gold/20 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-hgnice-gold mb-6 text-center">REGISTER</h2>
        
        {error && <p className="bg-red-500/20 text-red-500 p-2 rounded text-xs mb-4 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-neutral-400 text-sm">🇧🇩 +880</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 pl-20 pr-4 text-white focus:outline-none focus:border-hgnice-gold transition-colors"
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-hgnice-gold"
              placeholder="Set Password"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3.5 text-neutral-500"
            >
              {showPass ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-hgnice-gold"
            placeholder="Confirm Password"
            required
          />

          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-hgnice-gold"
            placeholder="Invitation Code (Mandatory)"
            required
          />

          {/* Puzzle Captcha Mock */}
          <div className="mt-4">
            <p className="text-xs text-neutral-400 mb-2">Slide to verify</p>
            <div className="w-full h-10 bg-neutral-800 rounded-full relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-hgnice-gold transition-all duration-75"
                style={{ width: `${sliderPos}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSliderPos(val);
                  if (val > 95) setIsCaptchaDone(true);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className={`text-xs ${sliderPos > 50 ? 'text-hgnice-red font-bold' : 'text-neutral-500'}`}>
                  {isCaptchaDone ? 'VERIFIED ✓' : '>> SLIDE >>'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-hgnice-gold text-hgnice-red font-bold py-3 rounded-lg hover:bg-hgnice-gold/90 transition-transform active:scale-95"
          >
            REGISTER
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm mt-6">
          Already have an account? 
          <button onClick={() => setView('login')} className="text-hgnice-gold ml-1 font-semibold">Login</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
