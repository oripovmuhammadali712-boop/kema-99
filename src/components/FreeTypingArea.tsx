import React, { useRef, useEffect } from 'react';
import { Copy, Download, RotateCcw, Check, RefreshCw, Eye } from 'lucide-react';
import { ThemeConfig, TypingMode } from '../types';

interface FreeTypingAreaProps {
  mode: TypingMode;
  targetText: string;
  typedText: string;
  theme: ThemeConfig;
  isActive: boolean;
  timeLeft: number | null;
  elapsedSeconds: number;
  wordCount: number;
  charCount: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  onClear: () => void;
  onNewWords: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onContainerClick: () => void;
}

export const FreeTypingArea: React.FC<FreeTypingAreaProps> = ({
  mode,
  targetText,
  typedText,
  theme,
  timeLeft,
  elapsedSeconds,
  wordCount,
  charCount,
  wpm,
  cpm,
  accuracy,
  onClear,
  onNewWords,
  inputRef,
  onContainerClick,
}) => {
  const [copied, setCopied] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll when the caret advances to keep it in view
  useEffect(() => {
    if (activeCharRef.current && scrollRef.current) {
      const activeEl = activeCharRef.current;
      const container = scrollRef.current;
      const topOffset = activeEl.offsetTop - container.offsetTop;
      if (topOffset > container.clientHeight * 0.6) {
        container.scrollTo({ top: topOffset - 60, behavior: 'smooth' });
      }
    }
  }, [typedText]);

  const handleCopy = () => {
    const textToCopy = mode === 'free' ? typedText : targetText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToSave = mode === 'free' ? typedText : `${targetText}\n\n---\nYozilgan matn:\n${typedText}`;
    if (!textToSave) return;
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monkeytype-matn-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs < 10 ? '0' : ''}${secs}` : `${secs}s`;
  };

  const currentIndex = typedText.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {/* Live Stats Header Bar (Monkeytype style) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Quick metrics */}
        <div className="flex items-center gap-6 sm:gap-8 font-mono">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: theme.subText }}>
              Tezlik (WPM)
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: theme.accent }}>
              {Math.round(wpm)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: theme.subText }}>
              Belgilar (CPM)
            </span>
            <span className="text-xl sm:text-2xl font-bold" style={{ color: theme.text }}>
              {Math.round(cpm)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: theme.subText }}>
              Aniqlik
            </span>
            <span
              className="text-xl sm:text-2xl font-bold"
              style={{ color: accuracy >= 95 ? theme.accent : accuracy >= 80 ? theme.text : theme.error }}
            >
              {Math.round(accuracy)}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: theme.subText }}>
              {timeLeft !== null ? 'Qolgan Vaqt' : 'Vaqt'}
            </span>
            <span className="text-xl sm:text-2xl font-bold" style={{ color: theme.text }}>
              {timeLeft !== null ? formatTime(timeLeft) : formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {mode !== 'free' && (
            <button
              type="button"
              onClick={onNewWords}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all hover:bg-white/5 active:scale-95 border"
              style={{ borderColor: theme.keyBorder, color: theme.subText }}
              title="Yangi matn namunalari"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yangi matn</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 active:scale-95"
            style={{ color: theme.subText }}
            title="Matnni nusxalash"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Nusxalandi' : 'Nusxa'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 active:scale-95"
            style={{ color: theme.subText }}
            title=".txt sifatida yuklab olish"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Yuklash</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all hover:bg-white/5 active:scale-95"
            style={{ color: theme.subText }}
            title="Qayta boshlash"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Qayta boshlash</span>
          </button>
        </div>
      </div>

      {/* Main Typing Canvas Area */}
      <div
        onClick={onContainerClick}
        className="w-full relative min-h-[170px] sm:min-h-[210px] max-h-[300px] p-5 sm:p-7 rounded-2xl border transition-all cursor-text flex flex-col justify-between overflow-hidden group shadow-inner"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.keyBorder,
        }}
      >
        {/* Invisible focus anchor (does NOT duplicate characters) */}
        <textarea
          ref={inputRef}
          readOnly
          className="absolute inset-0 opacity-0 pointer-events-none z-0 resize-none select-none"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Text Display Scroll Area */}
        <div
          ref={scrollRef}
          className="w-full overflow-y-auto pr-2 font-mono text-xl sm:text-2xl leading-relaxed tracking-wide select-none transition-all"
        >
          {/* Guided Mode (Target text displayed in advance) */}
          {mode !== 'free' && targetText ? (
            <div className="flex flex-wrap gap-x-2 gap-y-2.5 items-center">
              {targetText.split(' ').map((word, wordIdx, wordsArray) => {
                // Calculate starting character index of this word
                let wordStartIdx = 0;
                for (let i = 0; i < wordIdx; i++) {
                  wordStartIdx += wordsArray[i].length + 1; // +1 for the space
                }
                const wordEndIdx = wordStartIdx + word.length;
                const isWordActive = currentIndex >= wordStartIdx && currentIndex <= wordEndIdx;

                return (
                  <span
                    key={wordIdx}
                    className={`inline-flex items-center transition-opacity ${
                      isWordActive ? 'opacity-100' : 'opacity-85'
                    }`}
                  >
                    {word.split('').map((char, charIdx) => {
                      const absoluteCharIdx = wordStartIdx + charIdx;
                      const isTyped = absoluteCharIdx < currentIndex;
                      const isCurrent = absoluteCharIdx === currentIndex;
                      const typedChar = isTyped ? typedText[absoluteCharIdx] : null;
                      const isCorrect = isTyped && typedChar === char;
                      const isWrong = isTyped && typedChar !== char;

                      let charColor = theme.subText;
                      if (isCorrect) {
                        charColor = theme.text;
                      } else if (isWrong) {
                        charColor = theme.error;
                      }

                      return (
                        <span
                          key={charIdx}
                          ref={isCurrent ? activeCharRef : null}
                          className={`relative font-mono transition-colors ${
                            isWrong ? 'underline decoration-wavy decoration-rose-500 font-bold' : ''
                          }`}
                          style={{
                            color: charColor,
                            fontWeight: isCorrect ? '600' : '400',
                          }}
                        >
                          {/* Animated Monkeytype Caret right before active character */}
                          {isCurrent && (
                            <span
                              className="absolute -left-[2px] top-1 bottom-1 w-[2.5px] rounded-full animate-caret-blink z-10"
                              style={{
                                backgroundColor: theme.accent,
                                boxShadow: `0 0 10px ${theme.accent}`,
                              }}
                            />
                          )}
                          {char}
                        </span>
                      );
                    })}

                    {/* Space following the word */}
                    {wordIdx < wordsArray.length - 1 && (() => {
                      const spaceIdx = wordEndIdx;
                      const isTyped = spaceIdx < currentIndex;
                      const isCurrent = spaceIdx === currentIndex;
                      const isWrongSpace = isTyped && typedText[spaceIdx] !== ' ';

                      return (
                        <span
                          key="space"
                          ref={isCurrent ? activeCharRef : null}
                          className="relative inline-block px-1 select-none"
                          style={{
                            color: isWrongSpace ? theme.error : theme.subText,
                          }}
                        >
                          {isCurrent && (
                            <span
                              className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-full animate-caret-blink z-10"
                              style={{
                                backgroundColor: theme.accent,
                                boxShadow: `0 0 10px ${theme.accent}`,
                              }}
                            />
                          )}
                          {isWrongSpace ? (
                            <span className="text-xs opacity-75 underline decoration-wavy">␣</span>
                          ) : (
                            <span className="opacity-0">␣</span>
                          )}
                        </span>
                      );
                    })()}
                  </span>
                );
              })}
            </div>
          ) : (
            /* Free Typing Sandbox Mode */
            <div className="min-h-[100px] break-words whitespace-pre-wrap">
              {typedText.length === 0 ? (
                <div className="flex flex-col gap-2 py-4 select-none opacity-60">
                  <div className="flex items-center gap-2 text-base sm:text-xl font-medium" style={{ color: theme.subText }}>
                    <Eye className="w-5 h-5 text-amber-400" />
                    <span>Istalgan matningizni erkin yozing...</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans" style={{ color: theme.subText }}>
                    Har bir harf bitta-bitta bosiladi va ekrandagi klaviatura bilan sinxronlanadi.
                  </p>
                </div>
              ) : (
                <span style={{ color: theme.text }}>
                  {typedText}
                  <span
                    className="inline-block w-[3px] h-[1.25em] align-middle rounded-full animate-caret-blink ml-0.5"
                    style={{
                      backgroundColor: theme.accent,
                      boxShadow: `0 0 10px ${theme.accent}`,
                    }}
                  />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar: Character & Word Count, Shortcuts */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-4 border-t text-xs font-mono select-none"
          style={{ borderColor: `${theme.keyBorder}60`, color: theme.subText }}
        >
          <div className="flex items-center gap-4">
            <span>
              So&apos;zlar: <b style={{ color: theme.text }}>{wordCount}</b>
            </span>
            <span>
              Belgilar: <b style={{ color: theme.text }}>{charCount}</b>
            </span>
            {mode !== 'free' && targetText && (
              <span className="hidden sm:inline">
                Jami: <b style={{ color: theme.subText }}>{targetText.length}</b> belgi
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {mode !== 'free' && (
              <span className="hidden md:inline" style={{ color: theme.accent }}>
                💡 Keyingi bosiladigan tugma ekrandagi klaviaturada yonadi
              </span>
            )}
            <span className="hidden sm:inline">Qayta boshlash:</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold" style={{ backgroundColor: theme.subBg, color: theme.text }}>
              Esc
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
