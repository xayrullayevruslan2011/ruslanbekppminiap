import React from 'react';
import { User, Track, Language, Theme } from '../types';
import { translations } from '../constants';
import { Award, TrendingUp, DollarSign, Scale, User as UserIcon, Star, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  user: User;
  tracks: Track[];
  lang: Language;
  theme: Theme;
}

const Profile: React.FC<ProfileProps> = ({ user, tracks, lang, theme }) => {
  const t = translations[lang];

  const userTracks = tracks.filter(tr => tr.userId === user.id);
  const totalWeight = userTracks.reduce((sum, tr) => sum + tr.weight, 0);
  const totalPaid = userTracks.reduce((sum, tr) => sum + tr.price, 0);

  const getTier = (weight: number) => {
    // Loyalty Tiers: 5kg = Do'st, 10kg = Qadirdon, 20kg+ = Hamkor
    if (weight >= 20) return { label: t.loyaltyPartner, color: 'text-[#BF953F]', bg: 'bg-[#BF953F]/10', icon: ShieldCheck, limit: 50 };
    if (weight >= 10) return { label: t.loyaltyDear, color: 'text-orange-400', bg: 'bg-orange-400/10', icon: Star, limit: 20 };
    if (weight >= 5) return { label: t.loyaltyFriend, color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Award, limit: 10 };
    return { label: 'Yangi', color: 'text-gray-400', bg: 'bg-gray-400/10', icon: UserIcon, limit: 5 };
  };

  const tier = getTier(totalWeight);

  const chartData = [
    { name: 'Progress', value: totalWeight },
    { name: 'Remaining', value: Math.max(0.1, tier.limit - totalWeight) },
  ];

  const COLORS = ['#BF953F', 'rgba(255, 255, 255, 0.05)'];

  return (
    <div className="p-6 space-y-10 bg-[#0a0a0a] min-h-screen pb-32 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 gold-bg opacity-20 blur-2xl rounded-full"></div>
          <div className="relative w-32 h-32 rounded-full gold-bg p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
               <UserIcon size={50} className="text-[#BF953F]" />
            </div>
          </div>
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-2 border-[#0a0a0a] flex items-center justify-center shadow-xl ${tier.bg} animate-bounce duration-3000`}>
            <tier.icon size={20} className={tier.color} />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">{user.name}</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">ID: {user.telegramId}</p>
        </div>
        <div className={`inline-block px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl ${tier.bg} ${tier.color} border border-current/20`}>
          {tier.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="premium-card p-6 rounded-[32px] space-y-3 hover:border-[#BF953F]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#BF953F]/10 flex items-center justify-center shadow-inner">
            <Scale size={20} className="text-[#BF953F]" />
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{t.totalWeight}</p>
            <p className="text-2xl font-black text-white">{totalWeight.toFixed(1)} <span className="text-xs text-gray-500">kg</span></p>
          </div>
        </div>
        <div className="premium-card p-6 rounded-[32px] space-y-3 hover:border-green-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center shadow-inner">
            <DollarSign size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{t.totalPaid}</p>
            <p className="text-2xl font-black text-white">{totalPaid.toLocaleString()} <span className="text-[10px] text-gray-500">uzs</span></p>
          </div>
        </div>
      </div>

      <div className="premium-card p-8 rounded-[40px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 scale-150 pointer-events-none group-hover:scale-[1.7] transition-transform duration-1000">
          <TrendingUp size={100} className="text-white" />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Loyalty Progress</h3>
            <p className="text-xl font-black text-white gold-gradient">Statistika</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Star size={18} className="text-[#BF953F]" />
          </div>
        </div>

        <div className="h-48 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-white">{Math.round((totalWeight / tier.limit) * 100)}%</span>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Target</span>
          </div>
        </div>
        
        <div className="mt-8 p-5 rounded-3xl bg-white/5 border border-white/5 text-center shadow-inner">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
            {totalWeight >= 20 
              ? "Siz eng yuqori darajadasiz! Rahmat!" 
              : `Keyingi bosqich uchun yana ${Math.max(0, tier.limit - totalWeight).toFixed(1)} kg yuk kerak.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;