
import React from 'react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Navbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'activity', label: 'Activity', icon: '🏆' },
    { id: 'promotion', label: 'Invite', icon: '🤝' },
    { id: 'wallet', label: 'Wallet', icon: '👛' },
    { id: 'account', label: 'Mine', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#161616] border-t border-hgnice-gold/10 flex justify-around items-center pt-2 pb-6 px-2 z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 transition-all flex-1 ${
            activeTab === item.id ? 'text-hgnice-gold scale-110' : 'text-neutral-500'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          {activeTab === item.id && <div className="w-1 h-1 bg-hgnice-gold rounded-full mt-0.5"></div>}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
