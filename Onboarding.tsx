import React, { useState } from 'react';
import { User, Language, Theme } from '../types';
import { translations, BOT_TOKEN, ADMIN_ID, BOT_ADMIN_ID } from '../constants';
import { User as UserIcon, Phone, ArrowRight, Package, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';

interface OnboardingProps {
  onLogin: (user: User) => void;
  lang: Language;
  theme: Theme;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin, lang, theme }) => {
  const [name, setName] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const t = translations[lang];

  const handleStart = async () => {
    if (!name || !telegramId || !phone) return;

    setIsLoading(true);
    setNotifyStatus('sending');
    const isAdmin = telegramId === ADMIN_ID;

    // Telegram Botga xabar yuborish (Haqiqiy admin IDga)
    const message = `🚀 ${isAdmin ? 'ADMIN (7777)' : 'Yangi foydalanuvchi'} kirdi:\nIsm: ${name}\nKiritilgan ID: ${telegramId}\nTel: ${phone}`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: BOT_ADMIN_ID,
          text: message
        })
      });

      if (response.ok) {
        setNotifyStatus('sent');
      } else {
        console.error("Bot error:", await response.text());
        setNotifyStatus('error');
      }
    } catch (e) {
      console.warn("Notification fetch failed:", e);
      setNotifyStatus('error');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      telegramId,
      phone,
      name,
      role: isAdmin ? 'admin' : 'user',
      totalKg: 0,
      totalSpent: 0,
      createdAt: Date.now()
    };

    // Premium loading delay
    setTimeout(() => {
      onLogin(newUser);
    }, 2800);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 gold-bg opacity-30 blur-3xl animate-pulse"></div>
          <div className="w-24 h-24 gold-bg rounded-[32px] flex items-center justify-center relative shadow-2xl overflow-hidden">
            <div className="absolute inset-0 gold-shimmer opacity-30"></div>
            <Loader2 size={40} className="text-black animate-spin" strokeWidth={3} />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black gold-gradient tracking-[0.2em] uppercase">Ruslan Market</h2>
          <div className="flex flex-col gap-2 items-center">
            {notifyStatus === 'sending' && <p className="text-[10px] font-bold text-white uppercase tracking-[0.4em] opacity-50">Botga ulanmoqda...</p>}
            {notifyStatus === 'sent' && <p className="text-[10px] font-bold text-green-500 uppercase tracking-[0.4em]">Xabar botga yuborildi!</p>}
            {notifyStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={14} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Bot ID xato yoki bot bloklangan!</p>
              </div>
            )}
            <div className="h-0.5 w-32 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full gold-bg w-1/2 animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#BF953F] opacity-10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#AA771C] opacity-10 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-sm space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 gold-bg rounded-[32px] opacity-20 blur-xl animate-pulse"></div>
            <div className="relative w-full h-full gold-bg rounded-[32px] flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 gold-shimmer opacity-40"></div>
              <Package size={48} className="text-black" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight gold-gradient uppercase">
              Ruslan Market
            </h1>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
              Premium Logistics Solutions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="group relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <UserIcon className="text-gray-500 group-focus-within:text-[#BF953F] transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Ismingiz"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white placeholder:text-gray-600 font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="group relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-gray-500 group-focus-within:text-[#BF953F] font-black text-xs transition-colors">ID</span>
            </div>
            <input
              type="text"
              placeholder={t.enterId}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white placeholder:text-gray-600 font-bold"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
            />
            {telegramId === ADMIN_ID && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ShieldCheck size={20} className="text-[#BF953F]" />
              </div>
            )}
          </div>

          <div className="group relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Phone className="text-gray-500 group-focus-within:text-[#BF953F] transition-colors" size={20} />
            </div>
            <input
              type="tel"
              placeholder={t.enterPhone}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white placeholder:text-gray-600 font-bold"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!name || !telegramId || !phone}
          className="w-full gold-bg hover:opacity-90 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:active:scale-100 shadow-xl shadow-gold-500/20 uppercase tracking-widest text-xs"
        >
          {t.start} <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;