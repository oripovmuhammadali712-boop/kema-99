import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Award, Zap, Crosshair, X } from 'lucide-react';
import { ThemeConfig, TypingStats } from '../types';

interface TypingResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  stats: TypingStats;
  theme: ThemeConfig;
}

export const TypingResultsModal: React.FC<TypingResultsModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  stats,
  theme,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: [theme.accent, '#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, theme.accent]);

  if (!isOpen) return null;

  // Simple SVG sparkline path
  const points = stats.wpmHistory;
  const maxWpm = Math.max(...points.map((p) => p.wpm), 40);
  const minWpm = Math.min(...points.map((p) => p.wpm), 0);
  const range = maxWpm - minWpm || 1;

  const svgWidth = 460;
  const svgHeight = 120;

  const pathD = points.length > 1
    ? points
        .map((pt, i) => {
          const x = (i / (points.length - 1)) * svgWidth;
          const y = svgHeight - ((pt.wpm - minWpm) / range) * (svgHeight - 20) - 10;
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ')
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.keyBorder,
          color: theme.text,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: theme.subText }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
          >
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl font-mono tracking-tight" style={{ color: theme.text }}>
              Sinov Yakunlandi!
            </h3>
            <p className="text-xs font-mono" style={{ color: theme.subText }}>
              Sizning yozish tezligingiz va aniqlik natijalaringiz
            </p>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div
            className="flex flex-col p-3 sm:p-4 rounded-xl border"
            style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}
          >
            <div className="flex items-center gap-1.5 text-xs font-mono mb-1" style={{ color: theme.subText }}>
              <Zap className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span>WPM</span>
            </div>
            <div className="text-3xl font-extrabold font-mono" style={{ color: theme.accent }}>
              {Math.round(stats.wpm)}
            </div>
            <span className="text-[10px] font-mono mt-0.5" style={{ color: theme.subText }}>
              daqiqa boshiga so&apos;z
            </span>
          </div>

          <div
            className="flex flex-col p-3 sm:p-4 rounded-xl border"
            style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}
          >
            <div className="flex items-center gap-1.5 text-xs font-mono mb-1" style={{ color: theme.subText }}>
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aniqlik</span>
            </div>
            <div className="text-3xl font-extrabold font-mono" style={{ color: stats.accuracy >= 95 ? '#10b981' : theme.text }}>
              {Math.round(stats.accuracy)}%
            </div>
            <span className="text-[10px] font-mono mt-0.5" style={{ color: theme.subText }}>
              to&apos;g&apos;ri bosishlar
            </span>
          </div>

          <div
            className="flex flex-col p-3 sm:p-4 rounded-xl border"
            style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}
          >
            <div className="flex items-center gap-1.5 text-xs font-mono mb-1" style={{ color: theme.subText }}>
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>CPM</span>
            </div>
            <div className="text-3xl font-extrabold font-mono" style={{ color: theme.text }}>
              {Math.round(stats.cpm)}
            </div>
            <span className="text-[10px] font-mono mt-0.5" style={{ color: theme.subText }}>
              daqiqa boshiga belgi
            </span>
          </div>

          <div
            className="flex flex-col p-3 sm:p-4 rounded-xl border"
            style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}
          >
            <div className="text-xs font-mono mb-1" style={{ color: theme.subText }}>
              Vaqt
            </div>
            <div className="text-3xl font-extrabold font-mono" style={{ color: theme.text }}>
              {stats.elapsedSeconds}s
            </div>
            <span className="text-[10px] font-mono mt-0.5" style={{ color: theme.subText }}>
              jami davomiylik
            </span>
          </div>
        </div>

        {/* Graph representation */}
        {points.length > 2 && (
          <div
            className="p-4 rounded-xl border mb-6"
            style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2" style={{ color: theme.subText }}>
              <span>Tezlik grafigi (WPM dinamikasi)</span>
              <span style={{ color: theme.accent }}>Maks: {Math.round(maxWpm)} WPM</span>
            </div>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.accent} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {pathD && (
                <>
                  <path d={`${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`} fill="url(#wpmGradient)" />
                  <path d={pathD} fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </svg>
          </div>
        )}

        {/* Keystrokes detail */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border mb-6 font-mono text-xs" style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}>
          <div className="flex items-center gap-2">
            <span style={{ color: theme.subText }}>Bosilgan tugmalar:</span>
            <span className="font-bold" style={{ color: theme.text }}>
              {stats.totalKeystrokes}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">
              To&apos;g&apos;ri: <b>{stats.correctKeystrokes}</b>
            </span>
            <span className="text-rose-400">
              Xato: <b>{stats.errorKeystrokes}</b>
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono transition-colors hover:bg-white/5"
            style={{ color: theme.subText }}
          >
            Yopish
          </button>
          <button
            type="button"
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg active:scale-95"
            style={{
              backgroundColor: theme.accent,
              color: theme.accentText,
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qayta urinish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
