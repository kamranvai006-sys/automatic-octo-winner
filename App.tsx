
import React, { useState, useEffect } from 'react';
import { auth, getUserData, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import SplashScreen from './components/SplashScreen';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Tabs/Home';
import Activity from './components/Tabs/Activity';
import Promotion from './components/Tabs/Promotion';
import Wallet from './components/Tabs/Wallet';
import Account from './components/Tabs/Account';
import WinGo from './components/Games/WinGo';
import Aviator from './components/Games/Aviator';
import AdminPanel from './components/Admin/AdminPanel';
import Navbar from './components/Navbar';
import { User } from './types';

type MainTab = 'home' | 'activity' | 'promotion' | 'wallet' | 'account';
type SubView = 'wingo' | 'aviator' | 'admin';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [subView, setSubView] = useState<SubView | null>(null);

  useEffect(() => {
    const splashTimer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data?.isBanned) {
            auth.signOut();
            alert("Your account is banned.");
            return;
          }
          setUserData(data);
        });
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for hash changes for Master Admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/master-admin') {
        setSubView('admin');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (loading) return <SplashScreen />;

  if (!fbUser) {
    const isRegister = window.location.hash.includes('register');
    return isRegister ? (
      <Register setView={(v) => (window.location.hash = v === 'login' ? '' : 'register')} />
    ) : (
      <Login setView={(v) => (window.location.hash = v === 'register' ? 'register' : '')} />
    );
  }

  const renderContent = () => {
    if (subView === 'admin') return <AdminPanel onClose={() => setSubView(null)} />;
    if (subView === 'wingo') return <WinGo user={userData!} onBack={() => setSubView(null)} />;
    if (subView === 'aviator') return <Aviator user={userData!} onBack={() => setSubView(null)} />;

    switch (activeTab) {
      case 'home': return <Home user={userData!} onOpenGame={setSubView} />;
      case 'activity': return <Activity user={userData!} />;
      case 'promotion': return <Promotion user={userData!} />;
      case 'wallet': return <Wallet user={userData!} />;
      case 'account': return <Account user={userData!} onOpenAdmin={() => setSubView('admin')} />;
      default: return <Home user={userData!} onOpenGame={setSubView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24">
      <header className="bg-hgnice-red p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg border-b border-hgnice-gold/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-hgnice-gold rounded-full flex items-center justify-center font-bold text-hgnice-red">MC</div>
          <span className="font-bold text-hgnice-gold text-lg tracking-widest">MR CLUB</span>
        </div>
        <div className="bg-black/40 px-3 py-1 rounded-full border border-hgnice-gold/30 flex items-center gap-2">
          <span className="text-hgnice-gold text-sm font-bold">৳</span>
          <span className="font-bold text-white tracking-wide">{userData?.balance?.toFixed(2) || '0.00'}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {renderContent()}
      </main>

      {!subView && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}
      
      <a 
        href="https://t.me/mrclub_support" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 bg-hgnice-gold p-3 rounded-full shadow-2xl animate-bounce z-40"
      >
        <svg className="w-6 h-6 text-hgnice-red" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.31.26 2.56.73 3.7L1.03 21l5.44-1.63C7.59 19.8 8.78 20 10 20c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>
        </svg>
      </a>
    </div>
  );
};

export default App;
