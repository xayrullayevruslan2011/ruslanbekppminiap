import React, { useState } from 'react';
import { User, Track, Language, Theme, TrackStatus } from '../types';
import { translations, BOT_TOKEN, BOT_ADMIN_ID, CARD_NUMBER, CARD_HOLDER } from '../constants';
import { Package, Plus, Search, AlertCircle, Clock, Copy, CheckCircle2 } from 'lucide-react';

interface TrackersProps {
  user: User;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  lang: Language;
  theme: Theme;
}

const getStatusLabel = (status: TrackStatus, lang: Language): string => {
  const labels: Record<TrackStatus, Record<Language, string>> = {
    courier: { uz: "Kuryer olib keldi", ru: "Курьер привез", en: "Courier picked up" },
    weight_pending: { uz: "Saralanmoqda (Kg kutilmoqda)", ru: "Сортировка (Ждем кг)", en: "Sorting (Pending weight)" },
    china_warehouse: { uz: "Xitoy omboridan yuborildi", ru: "Отправлено из Китая", en: "Shipped from China" },
    sorting: { uz: "Saralanmoqda", ru: "Сортировка", en: "Sorting" },
    shipped: { uz: "Sizga yuborildi", ru: "Отправлено вам", en: "Sent to you" },
    delivered: { uz: "Yetkazildi", ru: "Доставлено", en: "Delivered" }
  };
  return labels[status][lang];
};

const calculateStatusByDays = (track: Track): TrackStatus => {
  if (track.status === 'delivered') return 'delivered';
  
  const diffDays = Math.floor((Date.now() - track.createdAt) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 3) return 'courier';
  if (diffDays < 6) return 'weight_pending';
  if (diffDays < 13) return 'china_warehouse'; // +7 kun
  if (diffDays < 18) return 'sorting';         // +5 kun
  return 'shipped';                            // +3 kun (18+ kun)
};

const Trackers: React.FC<TrackersProps> = ({ user, tracks, setTracks, lang, theme }) => {
  const [newTrack, setNewTrack] = useState('');
  const [error, setError] = useState('');
  const [selectedTrackForPayment, setSelectedTrackForPayment] = useState<Track | null>(null);
  const t = translations[lang];

  const addTrack = () => {
    if (!newTrack || newTrack.length < 5) {
      setError(t.invalidTrack);
      return;
    }

    const track: Track = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      trackNumber: newTrack,
      weight: 0,
      price: 0,
      status: 'courier',
      paymentStatus: 'not_assigned',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setTracks(prev => [track, ...prev]);
    setNewTrack('');
    setError('');

    // Adminni xabardor qilish
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: BOT_ADMIN_ID,
        text: `📦 Yangi trek qo'shildi!\n👤 User: ${user.name}\n🔢 Trek: ${track.trackNumber}\n🆔 ID: ${user.telegramId}`
      })
    }).catch(e => console.warn(e));
  };

  const userTracks = tracks.filter(tr => tr.userId === user.id);

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0a] min-h-screen pb-32">
      <header>
        <p className="text-[10px] font-bold text-[#BF953F] uppercase tracking-[0.3em]">Ruslan Market</p>
        <h1 className="text-3xl font-black text-white">{t.trackers}</h1>
      </header>

      <div className="premium-card p-6 rounded-[32px] space-y-4">
        <div className="relative group">
          <input
            type="text"
            placeholder={t.trackPlaceholder}
            className="w-full pl-6 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 text-white font-bold"
            value={newTrack}
            onChange={(e) => { setNewTrack(e.target.value); setError(''); }}
          />
        </div>
        {error && <p className="text-red-500 text-[10px] font-bold uppercase px-2">{error}</p>}
        <button
          onClick={addTrack}
          className="w-full gold-bg text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
          <Plus size={20} strokeWidth={3} /> {t.addTrack}
        </button>
      </div>

      <div className="space-y-4">
        {userTracks.map((track) => {
          const currentStatus = calculateStatusByDays(track);
          const diffDays = Math.floor((Date.now() - track.createdAt) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={track.id} className="premium-card p-6 rounded-[32px] group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Package size={24} className="text-[#BF953F]" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">{track.trackNumber}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{diffDays} kun bo'ldi</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#BF953F]">{track.weight > 0 ? `${track.weight} kg` : '-- kg'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full gold-bg transition-all duration-1000"
                    style={{ width: `${
                      currentStatus === 'courier' ? 20 :
                      currentStatus === 'weight_pending' ? 40 :
                      currentStatus === 'china_warehouse' ? 60 :
                      currentStatus === 'sorting' ? 80 : 100
                    }%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-[#BF953F] uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BF953F] animate-pulse"></span>
                    {getStatusLabel(currentStatus, lang)}
                  </p>
                  
                  {track.paymentStatus === 'pending' && (
                    <button 
                      onClick={() => setSelectedTrackForPayment(track)}
                      className="px-4 py-1.5 gold-bg rounded-lg text-black text-[10px] font-black uppercase"
                    >
                      {t.pay}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTrackForPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-sm premium-card p-8 rounded-[40px] space-y-6">
            <h2 className="text-xl font-black text-white gold-gradient uppercase text-center">{t.paymentDetails}</h2>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase">Karta raqami</p>
                <p className="text-lg font-black text-white">{CARD_NUMBER}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase">Summa</p>
                <p className="text-xl font-black text-[#BF953F]">{selectedTrackForPayment.price.toLocaleString()} UZS</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTrackForPayment(null)}
              className="w-full gold-bg text-black font-black py-4 rounded-2xl uppercase text-xs"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trackers;