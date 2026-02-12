
import React from 'react';
import { Language, Theme } from '../types';
import { translations } from '../constants';
import { Globe, Moon, Sun, ChevronRight, LogOut } from 'lucide-react';

interface SettingsProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ lang, setLang, theme, setTheme }) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const languages: { code: Language; label: string }[] = [
    { code: 'uz', label: "O'zbekcha" },
    { code: 'ru', label: "Русский" },
    { code: 'en', label: "English" },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">{t.settings}</h1>

      <div className="space-y-4">
        <section>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">{t.language}</h3>
          <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`w-full px-4 py-4 flex items-center justify-between transition-colors border-b last:border-0 ${
                  isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-50 hover:bg-gray-50'
                } ${lang === l.code ? 'text-blue-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className={lang === l.code ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="font-medium">{l.label}</span>
                </div>
                {lang === l.code && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">{t.theme}</h3>
          <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            <button
              onClick={toggleTheme}
              className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${
                isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDark ? (
                  <>
                    <Moon size={20} className="text-blue-500" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={20} className="text-orange-500" />
                    <span className="font-medium">Light Mode</span>
                  </>
                )}
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </section>

        <section className="pt-4">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.reload();
            }}
            className={`w-full px-4 py-4 flex items-center gap-3 text-red-500 rounded-3xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors`}
          >
            <LogOut size={20} />
            <span className="font-bold">Chiqish</span>
          </button>
        </section>
      </div>

      <div className="text-center text-[10px] text-gray-500 uppercase tracking-widest pt-8">
        Ruslan Market v1.0.0
      </div>
    </div>
  );
};

export default Settings;
