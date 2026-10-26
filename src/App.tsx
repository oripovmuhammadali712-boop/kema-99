/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { SettingsBar } from './components/SettingsBar';
import { FreeTypingArea } from './components/FreeTypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { CustomTextModal } from './components/CustomTextModal';
import { TypingResultsModal } from './components/TypingResultsModal';
import { HelpModal } from './components/HelpModal';
import {
  KeyDefinition,
  SoundType,
  ThemeConfig,
  ThemeId,
  TimeOption,
  TypingMode,
  TypingStats,
  WordCountOption,
} from './types';
import { THEMES } from './utils/themes';
import { soundEngine } from './utils/soundEngine';
import { getRandomWords } from './utils/words';

export default function App() {
  // Theme state
  const [themeId, setThemeId] = useState<ThemeId>('serika-dark');
  const theme: ThemeConfig = THEMES[themeId] || THEMES['serika-dark'];

  // Typing Modes & Controls
  // By default, 'words' mode is active to show text beforehand ("nima yozishini oldindan ko'rsatsin")
  const [mode, setMode] = useState<TypingMode>('words');
  const [wordCountOption, setWordCountOption] = useState<WordCountOption>(25);
  const [timeOption, setTimeOption] = useState<TimeOption>(0); // 0 = Cheksiz / Free flow
  const [soundType, setSoundType] = useState<SoundType>('thock');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);
  const [showFingerGuides, setShowFingerGuides] = useState<boolean>(false);

  // Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Keyboard live tracking state (Physical key down/up synchronization)
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [shiftActive, setShiftActive] = useState<boolean>(false);
  const [keyHitCounts, setKeyHitCounts] = useState<Record<string, number>>({});

  // Target text (shown in advance) & Typed user text
  const [targetText, setTargetText] = useState<string>(() => getRandomWords(25));
  const [text, setText] = useState<string>('');
  const [customTargetText, setCustomTargetText] = useState<string>('');

  // Performance metrics
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Keystrokes statistics
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number; rawWpm: number }[]>([]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine active target string
  const activeTargetText = mode === 'custom' ? customTargetText : mode === 'words' ? targetText : '';

  // Determine next target key to highlight on the virtual keyboard
  const nextTargetKey =
    mode !== 'free' && activeTargetText && text.length < activeTargetText.length
      ? activeTargetText[text.length]
      : null;

  // Synchronize sound engine selection
  useEffect(() => {
    soundEngine.setSoundType(soundType);
  }, [soundType]);

  // Keep focus on input area
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Compute live metrics
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const effectiveMinutes = Math.max(elapsedSeconds / 60, 0.0167); // minimum 1 second equivalent
  const liveWpm = Math.max(0, (charCount / 5) / effectiveMinutes);
  const liveRawWpm = Math.max(0, (totalKeystrokes / 5) / effectiveMinutes);
  const liveCpm = Math.max(0, charCount / effectiveMinutes);
  const liveAccuracy =
    totalKeystrokes > 0
      ? Math.max(0, Math.min(100, (correctKeystrokes / totalKeystrokes) * 100))
      : 100;

  // Restart / Reset typing session
  const resetSession = useCallback(
    (regenerateWords: boolean = false) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setText('');
      setIsStarted(false);
      setIsFinished(false);
      setElapsedSeconds(0);
      setTimeLeft(timeOption > 0 ? timeOption : null);
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
      setErrorKeystrokes(0);
      setStreakCount(0);
      setWpmHistory([]);
      setLastPressedKey(null);

      if (regenerateWords && mode === 'words') {
        setTargetText(getRandomWords(wordCountOption));
      }

      focusInput();
    },
    [timeOption, mode, wordCountOption, focusInput]
  );

  // Handle word count change
  const handleWordCountChange = (count: WordCountOption) => {
    setWordCountOption(count);
    setTargetText(getRandomWords(count));
    resetSession(false);
  };

  // Handle timer option change
  const handleTimeChange = (newTime: TimeOption) => {
    setTimeOption(newTime);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(newTime > 0 ? newTime : null);
    setIsStarted(false);
    setElapsedSeconds(0);
  };

  // Start timer on first keystroke
  const startTimerIfNeeded = useCallback(() => {
    if (!isStarted && !isFinished) {
      setIsStarted(true);
      if (timeOption > 0) {
        setTimeLeft(timeOption);
      }
    }
  }, [isStarted, isFinished, timeOption]);

  // Timer tick interval
  useEffect(() => {
    if (!isStarted || isFinished) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        const currentMins = Math.max(next / 60, 0.0167);
        const currentWpm = (charCount / 5) / currentMins;
        const currentRawWpm = (totalKeystrokes / 5) / currentMins;
        setWpmHistory((hist) => [
          ...hist,
          { time: next, wpm: Math.round(currentWpm), rawWpm: Math.round(currentRawWpm) },
        ]);
        return next;
      });

      if (timeOption > 0) {
        setTimeLeft((prev) => {
          if (prev === null) return timeOption;
          if (prev <= 1) {
            // Test finished!
            setIsFinished(true);
            setIsResultsModalOpen(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isFinished, timeOption, charCount, totalKeystrokes]);

  // Handle physical keyboard keydown event with strict single-key registration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside the modal inputs
      if (isCustomModalOpen || isHelpModalOpen) return;

      const code = e.code;
      const key = e.key;

      // Update active pressed key set immediately for instant virtual keyboard visual response
      setActiveCodes((prev) => {
        const next = new Set(prev);
        next.add(code);
        next.add(key);
        return next;
      });

      setLastPressedKey(key.length === 1 ? key.toUpperCase() : key);

      // Update modifier states
      setCapsLockActive(e.getModifierState('CapsLock'));
      setShiftActive(e.shiftKey);

      // Track key hit frequency
      setKeyHitCounts((prev) => ({
        ...prev,
        [code]: (prev[code] || 0) + 1,
        [key.toLowerCase()]: (prev[key.toLowerCase()] || 0) + 1,
      }));

      // Play switch audio
      const isSpaceOrEnter = code === 'Space' || code === 'Enter';
      soundEngine.play(isSpaceOrEnter);

      // Handle shortcuts
      if (key === 'Escape') {
        resetSession(true);
        return;
      }
      if (key === 'Tab') {
        e.preventDefault();
        resetSession(true);
        return;
      }

      // Ignore isolated modifier keys for typing text
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(key)) {
        return;
      }

      // Start timer on first user keypress
      startTimerIfNeeded();

      if (isFinished) return;

      // Prevent key repeat when holding down to enforce single key presses ("bitta dan bosilsin")
      if (e.repeat && key !== 'Backspace') {
        e.preventDefault();
        return;
      }

      // Handle Backspace (single character removal)
      if (key === 'Backspace') {
        e.preventDefault();
        setText((prev) => {
          if (prev.length === 0) return '';
          if (e.ctrlKey || e.altKey) {
            const words = prev.trimEnd().split(/\s+/);
            words.pop();
            return words.join(' ') + (words.length > 0 ? ' ' : '');
          }
          return prev.slice(0, -1);
        });
        setStreakCount(0);
        return;
      }

      // Handle Enter
      if (key === 'Enter') {
        e.preventDefault();
        if (mode === 'free') {
          setText((prev) => prev + '\n');
          setTotalKeystrokes((k) => k + 1);
          setCorrectKeystrokes((c) => c + 1);
        } else if (activeTargetText) {
          const currentIndex = text.length;
          const expectedChar = activeTargetText[currentIndex];
          if (expectedChar === '\n' || expectedChar === ' ') {
            setText((prev) => prev + expectedChar);
            setTotalKeystrokes((k) => k + 1);
            setCorrectKeystrokes((c) => c + 1);
            if (currentIndex + 1 >= activeTargetText.length) {
              setIsFinished(true);
              setIsResultsModalOpen(true);
            }
          }
        }
        return;
      }

      // Handle single character input (letters, numbers, space, punctuation)
      if (key.length === 1) {
        // ALWAYS prevent browser default insertion to guarantee exactly 1 character is added
        // and avoid double-character insertion!
        e.preventDefault();

        // Guided modes: 'words' or 'custom' (text displayed in advance)
        if (mode !== 'free' && activeTargetText) {
          const currentIndex = text.length;
          if (currentIndex >= activeTargetText.length) return;

          const expectedChar = activeTargetText[currentIndex];

          setTotalKeystrokes((k) => k + 1);
          if (key === expectedChar) {
            setCorrectKeystrokes((c) => c + 1);
            setStreakCount((s) => s + 1);
          } else {
            setErrorKeystrokes((er) => er + 1);
            setStreakCount(0);
          }

          setText((prev) => prev + key);

          // Check if completion reached
          if (currentIndex + 1 >= activeTargetText.length) {
            setIsFinished(true);
            setIsResultsModalOpen(true);
          }
        } else {
          // Free sandbox mode
          setText((prev) => prev + key);
          setTotalKeystrokes((k) => k + 1);
          setCorrectKeystrokes((c) => c + 1);
          setStreakCount((s) => s + 1);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const key = e.key;

      setActiveCodes((prev) => {
        const next = new Set(prev);
        next.delete(code);
        next.delete(key);
        return next;
      });

      setCapsLockActive(e.getModifierState('CapsLock'));
      setShiftActive(e.shiftKey);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    isCustomModalOpen,
    isHelpModalOpen,
    isFinished,
    mode,
    activeTargetText,
    text,
    resetSession,
    startTimerIfNeeded,
  ]);

  // Handle clicking keys on the on-screen virtual keyboard with mouse/touch
  const handleVirtualKeyPress = (keyDef: KeyDefinition) => {
    setActiveCodes((prev) => new Set(prev).add(keyDef.code));
    setTimeout(() => {
      setActiveCodes((prev) => {
        const next = new Set(prev);
        next.delete(keyDef.code);
        return next;
      });
    }, 120);

    setLastPressedKey(keyDef.label);
    startTimerIfNeeded();

    const isSpaceOrEnter = keyDef.code === 'Space' || keyDef.code === 'Enter';
    soundEngine.play(isSpaceOrEnter);

    if (keyDef.code === 'CapsLock') {
      setCapsLockActive((prev) => !prev);
      return;
    }
    if (keyDef.code === 'ShiftLeft' || keyDef.code === 'ShiftRight') {
      setShiftActive((prev) => !prev);
      return;
    }
    if (keyDef.code === 'Backspace') {
      setText((prev) => prev.slice(0, -1));
      return;
    }
    if (keyDef.code === 'Enter') {
      if (mode === 'free') {
        setText((prev) => prev + '\n');
        setTotalKeystrokes((k) => k + 1);
        setCorrectKeystrokes((c) => c + 1);
      }
      return;
    }

    let charToInsert = keyDef.key;
    if (keyDef.code === 'Space') {
      charToInsert = ' ';
    } else if (shiftActive || capsLockActive) {
      charToInsert = keyDef.shiftKey || keyDef.key.toUpperCase();
    } else {
      charToInsert = keyDef.key.toLowerCase();
    }

    if (charToInsert) {
      if (mode !== 'free' && activeTargetText) {
        const currentIndex = text.length;
        if (currentIndex >= activeTargetText.length) return;

        const expectedChar = activeTargetText[currentIndex];
        setTotalKeystrokes((k) => k + 1);
        if (charToInsert === expectedChar) {
          setCorrectKeystrokes((c) => c + 1);
          setStreakCount((s) => s + 1);
        } else {
          setErrorKeystrokes((er) => er + 1);
          setStreakCount(0);
        }

        setText((prev) => prev + charToInsert);

        if (currentIndex + 1 >= activeTargetText.length) {
          setIsFinished(true);
          setIsResultsModalOpen(true);
        }
      } else {
        setText((prev) => prev + charToInsert);
        setTotalKeystrokes((k) => k + 1);
        setCorrectKeystrokes((c) => c + 1);
        setStreakCount((s) => s + 1);
      }
    }
  };

  // Compile final stats for modal
  const finalStats: TypingStats = {
    wpm: liveWpm,
    rawWpm: liveRawWpm,
    cpm: liveCpm,
    accuracy: liveAccuracy,
    totalKeystrokes,
    correctKeystrokes,
    errorKeystrokes,
    wordCount,
    charCount,
    elapsedSeconds: Math.max(1, elapsedSeconds),
    wpmHistory,
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-3 sm:p-6 transition-colors duration-300 font-mono relative overflow-x-hidden selection:bg-amber-400 selection:text-black"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
      onClick={focusInput}
    >
      {/* Background ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ backgroundColor: theme.accent }}
      />

      {/* Main Container */}
      <div className="w-full flex flex-col gap-5 sm:gap-6 z-10">
        {/* Top Header */}
        <Header
          theme={theme}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          streakCount={streakCount}
        />

        {/* Monkeytype Settings Bar */}
        <SettingsBar
          mode={mode}
          onModeChange={(m) => {
            setMode(m);
            resetSession(true);
          }}
          wordCountOption={wordCountOption}
          onWordCountChange={handleWordCountChange}
          timeOption={timeOption}
          onTimeChange={handleTimeChange}
          soundType={soundType}
          onSoundChange={setSoundType}
          currentThemeId={themeId}
          onThemeChange={setThemeId}
          theme={theme}
          showKeyboard={showKeyboard}
          onToggleKeyboard={() => setShowKeyboard((prev) => !prev)}
          showFingerGuides={showFingerGuides}
          onToggleFingerGuides={() => setShowFingerGuides((prev) => !prev)}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />

        {/* Target Text & Typing Canvas Area */}
        <FreeTypingArea
          mode={mode}
          targetText={activeTargetText}
          typedText={text}
          theme={theme}
          isActive={isStarted && !isFinished}
          timeLeft={timeLeft}
          elapsedSeconds={elapsedSeconds}
          wordCount={wordCount}
          charCount={charCount}
          wpm={liveWpm}
          cpm={liveCpm}
          accuracy={liveAccuracy}
          onClear={() => resetSession(false)}
          onNewWords={() => resetSession(true)}
          inputRef={inputRef}
          onContainerClick={focusInput}
        />

        {/* Interactive Virtual Keyboard */}
        {showKeyboard && (
          <div className="w-full animate-fade-in">
            <VirtualKeyboard
              activeCodes={activeCodes}
              lastPressedKey={lastPressedKey}
              nextTargetKey={nextTargetKey}
              theme={theme}
              showFingerGuides={showFingerGuides}
              capsLockActive={capsLockActive}
              shiftActive={shiftActive}
              keyHitCounts={keyHitCounts}
              onVirtualKeyPress={handleVirtualKeyPress}
            />
          </div>
        )}
      </div>

      {/* Footer Info & Shortcuts */}
      <footer
        className="w-full max-w-4xl mx-auto py-4 mt-6 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none"
        style={{ borderColor: `${theme.keyBorder}60`, color: theme.subText }}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: theme.cardBg, color: theme.text }}>
              G
            </kbd>
            <span>tugmasini bosing: ekrandagi <b>G</b> tugmasi bir vaqtda bosiladi</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>
            Qayta boshlash: <kbd className="px-1 py-0.5 rounded text-[10px] uppercase" style={{ backgroundColor: theme.cardBg, color: theme.text }}>Tab</kbd> yoki <kbd className="px-1 py-0.5 rounded text-[10px] uppercase" style={{ backgroundColor: theme.cardBg, color: theme.text }}>Esc</kbd>
          </span>
          <span>
            Switch: <b style={{ color: theme.accent }}>{soundType.toUpperCase()}</b>
          </span>
        </div>
      </footer>

      {/* Modals */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApply={(newText) => {
          setCustomTargetText(newText);
          setMode('custom');
          resetSession(false);
        }}
        theme={theme}
        currentText={customTargetText}
      />

      <TypingResultsModal
        isOpen={isResultsModalOpen}
        onClose={() => setIsResultsModalOpen(false)}
        onRestart={() => resetSession(true)}
        stats={finalStats}
        theme={theme}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
