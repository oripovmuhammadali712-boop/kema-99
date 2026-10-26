import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';
import { ThemeConfig } from '../types';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (customText: string) => void;
  theme: ThemeConfig;
  currentText: string;
}

const PRESET_SNIPPETS = [
  {
    title: "O'zbekcha maqollar",
    text: "Bilim va aql insonning eng katta boyligidir. Mehnat qilgan rohat ko'rar, dangasa esa armonda qolar.",
  },
  {
    title: "Dasturlash / IT",
    text: "Frontend va backend texnologiyalari zamonaviy dasturiy ta'minotning asosiy poydevori hisoblanadi.",
  },
  {
    title: "Tez yozish qoidasi",
    text: "Klaviaturaga qaramasdan o'nta barmoq bilan yozish usuli sizning ish unumdorligingizni bir necha barobar oshiradi.",
  },
];

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onApply,
  theme,
  currentText,
}) => {
  const [inputText, setInputText] = useState(currentText);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onApply(inputText.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative"
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

        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.accent}25`, color: theme.accent }}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-mono" style={{ color: theme.text }}>
              O&apos;z Matningizni Kiritish
            </h3>
            <p className="text-xs" style={{ color: theme.subText }}>
              Istalgan matn, maqola yoki gapni yozing yoki nusxasini qo&apos;ying
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Shu yerga o'zingiz xohlagan matnni yozing yoki qo'ying..."
            rows={5}
            className="w-full p-3.5 rounded-xl border font-mono text-sm leading-relaxed outline-none resize-none transition-colors"
            style={{
              backgroundColor: theme.subBg,
              borderColor: theme.keyBorder,
              color: theme.text,
            }}
            autoFocus
          />

          {/* Quick presets */}
          <div>
            <div className="text-xs font-mono mb-2" style={{ color: theme.subText }}>
              Yoki tayyor namunalardan birini tanlang:
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_SNIPPETS.map((snippet, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(snippet.text)}
                  className="text-xs px-2.5 py-1 rounded-lg border font-mono transition-all hover:border-amber-400"
                  style={{
                    backgroundColor: theme.subBg,
                    borderColor: theme.keyBorder,
                    color: theme.subText,
                  }}
                >
                  {snippet.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: `${theme.keyBorder}80` }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono transition-colors hover:bg-white/5"
              style={{ color: theme.subText }}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg active:scale-95"
              style={{
                backgroundColor: theme.accent,
                color: theme.accentText,
              }}
            >
              <Check className="w-4 h-4" />
              <span>Matnni o&apos;rnatish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
