
import React from 'react';
import { User, Track, Language, Theme } from '../types';
import { translations } from '../constants';
import { Package, Truck, Clock, CheckCircle2, User as UserIcon, TrendingUp } from 'lucide-react';

interface HomeProps {
  user: User;
  tracks: Track[];
  lang: Language;
  theme: Theme;
}

const Home: React.FC<HomeProps> = ({ user, tracks, lang, theme }) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  const userTracks = tracks.filter(tr => tr.userId === user.id);
  const activeTracks = userTracks.filter(tr => tr.status !== 'delivered');
  const deliveredTracks = userTracks.filter(tr => tr.status === 'delivered');

  const stats = [
    { label: t.trackers, value: userTracks.length, icon: Package, color: 'text-[#BF953F]', bg: 'bg-[#BF953F]/10' },
    { label: 'Yo\'lda', value: activeTracks.length, icon: Truck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Yetkazildi', value: deliveredTracks.length, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#0a0a0a] min-h-screen">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{t.welcome}</p>
          <h1 className="text-3xl font-black gold-gradient">{user.name.split(' ')[0]}</h1>
        </div>
        <div className="relative">
          <div className="absolute inset-0 gold-bg opacity-20 blur-lg rounded-2xl"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <UserIcon size={28} className="text-[#BF953F]" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <div className="premium-card p-6 rounded-[32px] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={80} className="text-white" />
          </div>
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-bold text-[#BF953F] uppercase tracking-[0.3em]">Status Summary</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-white">{activeTracks.length}</span>
              <span className="text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest">Active Packages</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full gold-bg w-2/3 shadow-[0_0_15px_rgba(191,149,63,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="premium-card p-4 rounded-[24px] flex flex-col items-center text-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={stat.color} size={22} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xl font-black">{stat.value}</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Haridlar tarixi</h3>
          <button className="text-[10px] font-bold text-[#BF953F] uppercase tracking-widest hover:underline">Barchasi</button>
        </div>
        
        {activeTracks.length > 0 ? (
          <div className="space-y-4">
            {activeTracks.slice(0, 3).map((track) => (
              <div key={track.id} className="premium-card p-5 rounded-[24px] flex items-center justify-between group hover:border-[#BF953F]/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock size={24} className="text-[#BF953F]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight text-white">{track.trackNumber}</p>
                    <p className="text-[10px] text-[#BF953F] font-bold uppercase tracking-widest mt-0.5">{track.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{track.weight > 0 ? `${track.weight} kg` : '--'}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-1">Weight</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="premium-card p-12 rounded-[32px] flex flex-col items-center justify-center text-center border-dashed border-white/10 opacity-60">
            <Package size={48} className="mb-4 text-gray-700" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Hozircha faol yuklar yo'q</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
