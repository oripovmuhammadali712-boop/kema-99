import React from 'react';
import {
  Keyboard,
  Clock,
  Volume2,
  Palette,
  Edit3,
  BookOpen,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import { SoundType, ThemeConfig, ThemeId, TimeOption, TypingMode, WordCountOption } from '../types';
import { THEMES } from '../utils/themes';

interface SettingsBarProps {
  mode: TypingMode;
  onModeChange: (mode: TypingMode) => void;
  wordCountOption: WordCountOption;
  onWordCountChange: (count: WordCountOption) => void;
  timeOption: TimeOption;
  onTimeChange: (time: TimeOption) => void;
  soundType: SoundType;
  onSoundChange: (sound: SoundType) => void;
  currentThemeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
  theme: ThemeConfig;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  showFingerGuides: boolean;
  onToggleFingerGuides: () => void;
  onOpenCustomModal: () => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  mode,
  onModeChange,
  wordCountOption,
  onWordCountChange,
  timeOption,
  onTimeChange,
  soundType,
  onSoundChange,
  currentThemeId,
  onThemeChange,
  theme,
  showKeyboard,
  onToggleKeyboard,
  showFingerGuides,
  onToggleFingerGuides,
  onOpenCustomModal,
}) => {
  return (
    <div
      className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all text-xs font-mono select-none shadow-sm"
      style={{
        backgroundColor: theme.subBg,
        borderColor: theme.keyBorder,
      }}
    >
      {/* Left side: Typing Mode Switcher */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center rounded-xl p-1 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder }}>
          <button
            type="button"
            onClick={() => onModeChange('words')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: mode === 'words' ? theme.accent : 'transparent',
              color: mode === 'words' ? theme.accentText : theme.subText,
              fontWeight: mode === 'words' ? '700' : '500',
            }}
            title="Matnni oldindan ko'rsatib mashq qilish"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Matnli mashq</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onModeChange('custom');
              onOpenCustomModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: mode === 'custom' ? theme.accent : 'transparent',
              color: mode === 'custom' ? theme.accentText : theme.subText,
              fontWeight: mode === 'custom' ? '700' : '500',
            }}
            title="O'z matningizni kiritib mashq qilish"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>O&apos;z Matnim</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('free')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: mode === 'free' ? theme.accent : 'transparent',
              color: mode === 'free' ? theme.accentText : theme.subText,
              fontWeight: mode === 'free' ? '700' : '500',
            }}
            title="Bo'sh ekranda erkin yozish"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Erkin Yozish</span>
          </button>
        </div>

        {mode === 'custom' && (
          <button
            type="button"
            onClick={onOpenCustomModal}
            className="px-2.5 py-1.5 rounded-xl border text-[11px] hover:border-amber-400 transition-colors"
            style={{ borderColor: theme.keyBorder, color: theme.accent }}
          >
            Matnni o&apos;zgartirish
          </button>
        )}

        {/* Word count options in words mode */}
        {mode === 'words' && (
          <div className="flex items-center gap-1 rounded-xl p-1 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder }}>
            <span className="text-[10px] px-1" style={{ color: theme.subText }}>so&apos;z:</span>
            {([10, 25, 50, 100] as WordCountOption[]).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onWordCountChange(count)}
                className="px-2 py-0.5 rounded text-[11px] transition-all"
                style={{
                  backgroundColor: wordCountOption === count ? theme.accent : 'transparent',
                  color: wordCountOption === count ? theme.accentText : theme.subText,
                  fontWeight: wordCountOption === count ? '700' : '500',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center: Timer options */}
      <div className="flex items-center gap-1 rounded-xl p-1 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder }}>
        <Clock className="w-3.5 h-3.5 ml-1.5 mr-0.5 opacity-60" style={{ color: theme.subText }} />
        {([15, 30, 60, 0] as TimeOption[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTimeChange(t)}
            className="px-2.5 py-1 rounded-lg transition-all"
            style={{
              backgroundColor: timeOption === t ? theme.accent : 'transparent',
              color: timeOption === t ? theme.accentText : theme.subText,
              fontWeight: timeOption === t ? '700' : '500',
            }}
          >
            {t === 0 ? '∞ Cheksiz' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Right side: Sound, Keyboard toggles, Themes */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Switch Sound button */}
        <div className="flex items-center rounded-xl p-1 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder }}>
          <Volume2 className="w-3.5 h-3.5 ml-1.5 mr-1" style={{ color: soundType !== 'off' ? theme.accent : theme.subText }} />
          {(['thock', 'clicky', 'soft', 'off'] as SoundType[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onSoundChange(st)}
              className="px-2 py-1 rounded-lg capitalize text-[11px] transition-all"
              style={{
                backgroundColor: soundType === st ? theme.accent : 'transparent',
                color: soundType === st ? theme.accentText : theme.subText,
                fontWeight: soundType === st ? '700' : '500',
              }}
              title={`Switch ovozi: ${st}`}
            >
              {st === 'off' ? "O'chiq" : st}
            </button>
          ))}
        </div>

        {/* Keyboard Toggles */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleKeyboard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all"
            style={{
              backgroundColor: showKeyboard ? `${theme.accent}20` : theme.cardBg,
              borderColor: showKeyboard ? theme.accent : theme.keyBorder,
              color: showKeyboard ? theme.accent : theme.subText,
            }}
            title="Ekrandagi klaviaturani ko'rsatish/yashirish"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Klaviatura</span>
          </button>

          {showKeyboard && (
            <button
              type="button"
              onClick={onToggleFingerGuides}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all"
              style={{
                backgroundColor: showFingerGuides ? `${theme.accent}20` : theme.cardBg,
                borderColor: showFingerGuides ? theme.accent : theme.keyBorder,
                color: showFingerGuides ? theme.accent : theme.subText,
              }}
              title="O'n barmoq bilan yozish rangli qo'llanmasi"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Barmoqlar</span>
            </button>
          )}
        </div>

        {/* Theme select */}
        <div className="relative flex items-center">
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border cursor-pointer hover:border-amber-400 transition-colors" style={{ backgroundColor: theme.cardBg, borderColor: theme.keyBorder, color: theme.subText }}>
            <Palette className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <select
              value={currentThemeId}
              onChange={(e) => onThemeChange(e.target.value as ThemeId)}
              className="bg-transparent border-none outline-none text-xs font-mono cursor-pointer"
              style={{ color: theme.text }}
            >
              {Object.values(THEMES).map((thm) => (
                <option key={thm.id} value={thm.id} style={{ backgroundColor: '#1e2124', color: '#ffffff' }}>
                  {thm.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
