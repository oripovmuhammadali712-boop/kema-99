import React from 'react';
import { Keyboard, HelpCircle, Flame } from 'lucide-react';
import { ThemeConfig } from '../types';

interface HeaderProps {
  theme: ThemeConfig;
  onOpenHelp: () => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({ theme, onOpenHelp, streakCount }) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 px-2 select-none">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{
            backgroundColor: theme.accent,
            color: theme.accentText,
            boxShadow: `0 8px 20px -4px ${theme.accent}60`,
          }}
        >
          <Keyboard className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-mono" style={{ color: theme.text }}>
              monkeytype
            </h1>
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded font-mono"
              style={{ backgroundColor: `${theme.accent}25`, color: theme.accent }}
            >
              klaviatura
            </span>
          </div>
          <p className="text-xs font-mono" style={{ color: theme.subText }}>
            Erkin yozish & Interaktiv klaviatura
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono">
        {streakCount > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder, color: theme.text }}
            title="Ketma-ket to'g'ri so'zlar"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="font-bold">{streakCount}</span>
            <span className="text-[10px] hidden sm:inline" style={{ color: theme.subText }}>streak</span>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors hover:bg-white/5"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder, color: theme.subText }}
          title="Qo'llanma va ma'lumot"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Qo&apos;llanma</span>
        </button>
      </div>
    </header>
  );
};
