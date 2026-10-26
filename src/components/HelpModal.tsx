import React from 'react';
import { X, Keyboard, Volume2, Sparkles, Fingerprint } from 'lucide-react';
import { ThemeConfig } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 sm:p-7 shadow-2xl relative"
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

        <h3 className="text-xl font-bold font-mono mb-4 flex items-center gap-2" style={{ color: theme.accent }}>
          <Keyboard className="w-5 h-5" />
          <span>Foydalanish Qo&apos;llanmasi</span>
        </h3>

        <div className="flex flex-col gap-4 text-xs sm:text-sm font-sans leading-relaxed" style={{ color: theme.text }}>
          <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold font-mono" style={{ backgroundColor: `${theme.accent}30`, color: theme.accent }}>
              G
            </div>
            <div>
              <p className="font-semibold mb-0.5 font-mono">1. Klaviaturaning sinxronlashishi</p>
              <p style={{ color: theme.subText }}>
                Kompyuteringiz klaviaturasidan <b>G</b> (yoki istalgan boshqa tugma)ni bossangiz, ekrandagi virtual klaviaturada ham xuddi shu <b>G</b> tugmasi bir vaqtning o&apos;zida chuqur bosiladi, yonadi va mexanik switch ovozi yangraydi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${theme.accent}30`, color: theme.accent }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold mb-0.5 font-mono">2. Cheklovlarsiz Erkin Yozish</p>
              <p style={{ color: theme.subText }}>
                Hech qanday majburiy matn yo&apos;q! Siz ekranga o&apos;z fikrlaringizni, istagan gapingizni erkin yoza olasiz. Tizim sizning WPM (tezlik), CPM va aniqligingizni real vaqt rejimida hisoblab boradi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${theme.accent}30`, color: theme.accent }}>
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold mb-0.5 font-mono">3. Mexanik Switch Ovozlar (Web Audio)</p>
              <p style={{ color: theme.subText }}>
                Haqiqiy mexanik klaviatura tuyg&apos;usi: chuqur <b>Thock</b>, jarangdor <b>Clicky</b> (Blue switch) yoki yumshoq rejimni tanlashingiz mumkin.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.subBg, borderColor: theme.keyBorder }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${theme.accent}30`, color: theme.accent }}>
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold mb-0.5 font-mono">4. O&apos;n Barmoq Qo&apos;llanmasi (Touch Typing)</p>
              <p style={{ color: theme.subText }}>
                &quot;Barmoqlar&quot; tugmasini faollashtirsangiz, har bir tugma qaysi barmoq (ko&apos;rsatkich, o&apos;rta, nomsiz, jimjiloq) bilan bosilishi kerakligiga qarab ranglanadi.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            style={{
              backgroundColor: theme.accent,
              color: theme.accentText,
            }}
          >
            Tushunarli, boshlash!
          </button>
        </div>
      </div>
    </div>
  );
};
