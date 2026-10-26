import React from 'react';
import { KeyDefinition, ThemeConfig } from '../types';
import { FINGER_COLORS, KEYBOARD_ROWS } from '../utils/keyboardLayout';

interface VirtualKeyboardProps {
  activeCodes: Set<string>;
  lastPressedKey: string | null;
  nextTargetKey?: string | null;
  theme: ThemeConfig;
  showFingerGuides: boolean;
  capsLockActive: boolean;
  shiftActive: boolean;
  keyHitCounts?: Record<string, number>;
  onVirtualKeyPress: (keyDef: KeyDefinition) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeCodes,
  lastPressedKey,
  nextTargetKey,
  theme,
  showFingerGuides,
  capsLockActive,
  shiftActive,
  keyHitCounts = {},
  onVirtualKeyPress,
}) => {
  // Check if a specific key is pressed right now
  const isKeyPressed = (keyDef: KeyDefinition): boolean => {
    // Check by code (e.g., 'KeyG', 'Space', 'ShiftLeft')
    if (activeCodes.has(keyDef.code)) return true;
    // Check by generic key
    if (activeCodes.has(keyDef.key.toLowerCase())) return true;
    if (activeCodes.has(keyDef.key.toUpperCase())) return true;
    if (keyDef.shiftKey && activeCodes.has(keyDef.shiftKey)) return true;
    return false;
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto p-3 sm:p-5 rounded-2xl border transition-all duration-300 shadow-2xl relative overflow-hidden"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.keyBorder,
        boxShadow: `0 20px 40px -15px ${theme.keyShadow}`,
      }}
    >
      {/* Top Keyboard Bar: Status LEDs and branding */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b text-xs select-none" style={{ borderColor: `${theme.keyBorder}80` }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: theme.subText }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
            <span>INTERAKTIV KLAVIATURA</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.subBg, color: theme.subText }}>
            ANSI 60%
          </span>
        </div>

        {/* LED indicators: Caps Lock, Shift */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor: capsLockActive ? theme.accent : theme.subText,
                boxShadow: capsLockActive ? `0 0 8px ${theme.accent}` : 'none',
              }}
            />
            <span style={{ color: capsLockActive ? theme.text : theme.subText }}>
              CAPS {capsLockActive ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor: shiftActive ? theme.accent : theme.subText,
                boxShadow: shiftActive ? `0 0 8px ${theme.accent}` : 'none',
              }}
            />
            <span style={{ color: shiftActive ? theme.text : theme.subText }}>
              SHIFT
            </span>
          </div>
        </div>
      </div>

      {/* Keyboard Matrix Rows */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 w-full justify-between">
            {row.map((keyDef) => {
              const pressed = isKeyPressed(keyDef);
              const isTarget = Boolean(
                nextTargetKey && (
                  (nextTargetKey === ' ' && keyDef.code === 'Space') ||
                  (nextTargetKey === '\n' && keyDef.code === 'Enter') ||
                  (keyDef.key.toLowerCase() === nextTargetKey.toLowerCase()) ||
                  (keyDef.shiftKey && nextTargetKey === keyDef.shiftKey)
                )
              );
              const isHomingKey = keyDef.code === 'KeyF' || keyDef.code === 'KeyJ';
              const fingerInfo = keyDef.finger && showFingerGuides ? FINGER_COLORS[keyDef.finger] : null;
              const hitCount = keyHitCounts[keyDef.code] || keyHitCounts[keyDef.key.toLowerCase()] || 0;

              // Compute flex basis relative to standard 1u width
              const widthRatio = keyDef.width || 1;

              return (
                <button
                  key={keyDef.code}
                  type="button"
                  onClick={() => onVirtualKeyPress(keyDef)}
                  className={`
                    keycap relative flex flex-col items-center justify-center rounded-lg font-mono text-xs sm:text-sm font-semibold
                    transition-all select-none cursor-pointer focus:outline-none outline-none
                    ${pressed ? 'keycap-pressed' : ''}
                    ${isTarget && !pressed ? 'ring-2 ring-offset-1 ring-offset-transparent' : ''}
                  `}
                  style={{
                    flexGrow: widthRatio,
                    flexShrink: 1,
                    flexBasis: `${widthRatio * 2.4}rem`,
                    height: '2.75rem',
                    backgroundColor: pressed
                      ? theme.keyActiveBg
                      : isTarget
                      ? `${theme.accent}20`
                      : fingerInfo
                      ? fingerInfo.bg
                      : theme.keyCap,
                    color: pressed
                      ? theme.keyActiveText
                      : isTarget
                      ? theme.accent
                      : fingerInfo
                      ? fingerInfo.text
                      : theme.text,
                    borderWidth: isTarget ? '2px' : '1px',
                    borderColor: pressed
                      ? theme.accent
                      : isTarget
                      ? theme.accent
                      : fingerInfo
                      ? fingerInfo.border
                      : theme.keyBorder,
                    boxShadow: pressed
                      ? `0 0 16px ${theme.accent}60, inset 0 2px 4px rgba(0,0,0,0.4)`
                      : isTarget
                      ? `0 0 16px ${theme.accent}80, 0 4px 0 ${theme.keyShadow}`
                      : `0 4px 0 ${theme.keyShadow}, 0 5px 6px rgba(0,0,0,0.3)`,
                    transform: pressed ? 'translateY(3px)' : 'none',
                  }}
                  title={`${keyDef.label} ${isTarget ? "(Navbatdagi tugma!)" : ""} (Bosilgan: ${hitCount} marta)`}
                >
                  {/* Subtle top edge gloss */}
                  <div
                    className="absolute inset-x-1 top-0.5 h-[1px] rounded-t opacity-40 pointer-events-none"
                    style={{ backgroundColor: pressed ? '#ffffff' : 'rgba(255,255,255,0.25)' }}
                  />

                  {/* Dual label for Shift / Standard keys */}
                  {keyDef.shiftLabel && keyDef.shiftLabel !== keyDef.label ? (
                    <div className="flex flex-col items-center justify-between w-full h-full py-0.5 px-1 leading-none">
                      <span
                        className="text-[10px] sm:text-[11px] font-normal transition-opacity"
                        style={{
                          opacity: shiftActive ? 1 : 0.6,
                          fontWeight: shiftActive ? '700' : '400',
                          color: shiftActive && !pressed ? theme.accent : undefined,
                        }}
                      >
                        {keyDef.shiftLabel}
                      </span>
                      <span
                        className="text-xs sm:text-sm font-bold uppercase"
                        style={{
                          opacity: shiftActive ? 0.7 : 1,
                        }}
                      >
                        {keyDef.label}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm tracking-tight px-1 uppercase">
                      {keyDef.label}
                    </span>
                  )}

                  {/* Physical F & J homing indicator bar */}
                  {isHomingKey && (
                    <div
                      className="absolute bottom-1 w-2.5 sm:w-3 h-0.5 rounded-full pointer-events-none"
                      style={{
                        backgroundColor: pressed ? theme.keyActiveText : theme.subText,
                        opacity: 0.8,
                      }}
                    />
                  )}

                  {/* CapsLock LED dot */}
                  {keyDef.code === 'CapsLock' && (
                    <div
                      className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        backgroundColor: capsLockActive ? theme.accent : 'rgba(255,255,255,0.2)',
                        boxShadow: capsLockActive ? `0 0 6px ${theme.accent}` : 'none',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom helper info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t text-[11px] font-mono select-none" style={{ borderColor: `${theme.keyBorder}80`, color: theme.subText }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Klaviaturangizdan bitta-bitta bosing</span>
          </div>

          {nextTargetKey && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border" style={{ borderColor: theme.accent, backgroundColor: `${theme.accent}15` }}>
              <span style={{ color: theme.accent }}>Navbatdagi tugma:</span>
              <kbd
                className="px-1.5 py-0.5 rounded text-xs font-bold uppercase"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                }}
              >
                {nextTargetKey === ' ' ? 'Space ␣' : nextTargetKey === '\n' ? 'Enter ↵' : nextTargetKey}
              </kbd>
            </div>
          )}
        </div>

        {lastPressedKey && (
          <div className="flex items-center gap-1.5">
            <span>Oxirgi bosilgan:</span>
            <kbd
              className="px-2 py-0.5 rounded text-xs font-bold uppercase transition-all"
              style={{
                backgroundColor: theme.subBg,
                color: theme.text,
                border: `1px solid ${theme.keyBorder}`,
              }}
            >
              {lastPressedKey === ' ' ? 'Space (Bo\'shliq)' : lastPressedKey}
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
};
