import { KeyDefinition } from '../types';

export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Number row
  [
    { code: 'Backquote', key: '`', shiftKey: '~', label: '`', shiftLabel: '~', width: 1, finger: 'left-pinky' },
    { code: 'Digit1', key: '1', shiftKey: '!', label: '1', shiftLabel: '!', width: 1, finger: 'left-pinky' },
    { code: 'Digit2', key: '2', shiftKey: '@', label: '2', shiftLabel: '@', width: 1, finger: 'left-ring' },
    { code: 'Digit3', key: '3', shiftKey: '#', label: '3', shiftLabel: '#', width: 1, finger: 'left-middle' },
    { code: 'Digit4', key: '4', shiftKey: '$', label: '4', shiftLabel: '$', width: 1, finger: 'left-index' },
    { code: 'Digit5', key: '5', shiftKey: '%', label: '5', shiftLabel: '%', width: 1, finger: 'left-index' },
    { code: 'Digit6', key: '6', shiftKey: '^', label: '6', shiftLabel: '^', width: 1, finger: 'right-index' },
    { code: 'Digit7', key: '7', shiftKey: '&', label: '7', shiftLabel: '&', width: 1, finger: 'right-index' },
    { code: 'Digit8', key: '8', shiftKey: '*', label: '8', shiftLabel: '*', width: 1, finger: 'right-middle' },
    { code: 'Digit9', key: '9', shiftKey: '(', label: '9', shiftLabel: '(', width: 1, finger: 'right-ring' },
    { code: 'Digit0', key: '0', shiftKey: ')', label: '0', shiftLabel: ')', width: 1, finger: 'right-pinky' },
    { code: 'Minus', key: '-', shiftKey: '_', label: '-', shiftLabel: '_', width: 1, finger: 'right-pinky' },
    { code: 'Equal', key: '=', shiftKey: '+', label: '=', shiftLabel: '+', width: 1, finger: 'right-pinky' },
    { code: 'Backspace', key: 'Backspace', label: 'Backspace', width: 2, finger: 'right-pinky', isModifier: true },
  ],
  // Row 2: QWERTY row
  [
    { code: 'Tab', key: 'Tab', label: 'Tab', width: 1.5, finger: 'left-pinky', isModifier: true },
    { code: 'KeyQ', key: 'q', shiftKey: 'Q', label: 'q', shiftLabel: 'Q', width: 1, finger: 'left-pinky' },
    { code: 'KeyW', key: 'w', shiftKey: 'W', label: 'w', shiftLabel: 'W', width: 1, finger: 'left-ring' },
    { code: 'KeyE', key: 'e', shiftKey: 'E', label: 'e', shiftLabel: 'E', width: 1, finger: 'left-middle' },
    { code: 'KeyR', key: 'r', shiftKey: 'R', label: 'r', shiftLabel: 'R', width: 1, finger: 'left-index' },
    { code: 'KeyT', key: 't', shiftKey: 'T', label: 't', shiftLabel: 'T', width: 1, finger: 'left-index' },
    { code: 'KeyY', key: 'y', shiftKey: 'Y', label: 'y', shiftLabel: 'Y', width: 1, finger: 'right-index' },
    { code: 'KeyU', key: 'u', shiftKey: 'U', label: 'u', shiftLabel: 'U', width: 1, finger: 'right-index' },
    { code: 'KeyI', key: 'i', shiftKey: 'I', label: 'i', shiftLabel: 'I', width: 1, finger: 'right-middle' },
    { code: 'KeyO', key: 'o', shiftKey: 'O', label: 'o', shiftLabel: 'O', width: 1, finger: 'right-ring' },
    { code: 'KeyP', key: 'p', shiftKey: 'P', label: 'p', shiftLabel: 'P', width: 1, finger: 'right-pinky' },
    { code: 'BracketLeft', key: '[', shiftKey: '{', label: '[', shiftLabel: '{', width: 1, finger: 'right-pinky' },
    { code: 'BracketRight', key: ']', shiftKey: '}', label: ']', shiftLabel: '}', width: 1, finger: 'right-pinky' },
    { code: 'Backslash', key: '\\', shiftKey: '|', label: '\\', shiftLabel: '|', width: 1.5, finger: 'right-pinky' },
  ],
  // Row 3: Home row (A S D F G H J K L ; ' Enter)
  [
    { code: 'CapsLock', key: 'CapsLock', label: 'Caps Lock', width: 1.75, finger: 'left-pinky', isModifier: true },
    { code: 'KeyA', key: 'a', shiftKey: 'A', label: 'a', shiftLabel: 'A', width: 1, finger: 'left-pinky' },
    { code: 'KeyS', key: 's', shiftKey: 'S', label: 's', shiftLabel: 'S', width: 1, finger: 'left-ring' },
    { code: 'KeyD', key: 'd', shiftKey: 'D', label: 'd', shiftLabel: 'D', width: 1, finger: 'left-middle' },
    { code: 'KeyF', key: 'f', shiftKey: 'F', label: 'f', shiftLabel: 'F', width: 1, finger: 'left-index' },
    { code: 'KeyG', key: 'g', shiftKey: 'G', label: 'g', shiftLabel: 'G', width: 1, finger: 'left-index' },
    { code: 'KeyH', key: 'h', shiftKey: 'H', label: 'h', shiftLabel: 'H', width: 1, finger: 'right-index' },
    { code: 'KeyJ', key: 'j', shiftKey: 'J', label: 'j', shiftLabel: 'J', width: 1, finger: 'right-index' },
    { code: 'KeyK', key: 'k', shiftKey: 'K', label: 'k', shiftLabel: 'K', width: 1, finger: 'right-middle' },
    { code: 'KeyL', key: 'l', shiftKey: 'L', label: 'l', shiftLabel: 'L', width: 1, finger: 'right-ring' },
    { code: 'Semicolon', key: ';', shiftKey: ':', label: ';', shiftLabel: ':', width: 1, finger: 'right-pinky' },
    { code: 'Quote', key: "'", shiftKey: '"', label: "'", shiftLabel: '"', width: 1, finger: 'right-pinky' },
    { code: 'Enter', key: 'Enter', label: 'Enter ↵', width: 2.25, finger: 'right-pinky', isModifier: true },
  ],
  // Row 4: Bottom row (Shift Z X C V B N M , . / Shift)
  [
    { code: 'ShiftLeft', key: 'Shift', label: 'Shift ⇧', width: 2.25, finger: 'left-pinky', isModifier: true },
    { code: 'KeyZ', key: 'z', shiftKey: 'Z', label: 'z', shiftLabel: 'Z', width: 1, finger: 'left-pinky' },
    { code: 'KeyX', key: 'x', shiftKey: 'X', label: 'x', shiftLabel: 'X', width: 1, finger: 'left-ring' },
    { code: 'KeyC', key: 'c', shiftKey: 'C', label: 'c', shiftLabel: 'C', width: 1, finger: 'left-middle' },
    { code: 'KeyV', key: 'v', shiftKey: 'V', label: 'v', shiftLabel: 'V', width: 1, finger: 'left-index' },
    { code: 'KeyB', key: 'b', shiftKey: 'B', label: 'b', shiftLabel: 'B', width: 1, finger: 'left-index' },
    { code: 'KeyN', key: 'n', shiftKey: 'N', label: 'n', shiftLabel: 'N', width: 1, finger: 'right-index' },
    { code: 'KeyM', key: 'm', shiftKey: 'M', label: 'm', shiftLabel: 'M', width: 1, finger: 'right-index' },
    { code: 'Comma', key: ',', shiftKey: '<', label: ',', shiftLabel: '<', width: 1, finger: 'right-middle' },
    { code: 'Period', key: '.', shiftKey: '>', label: '.', shiftLabel: '>', width: 1, finger: 'right-ring' },
    { code: 'Slash', key: '/', shiftKey: '?', label: '/', shiftLabel: '?', width: 1, finger: 'right-pinky' },
    { code: 'ShiftRight', key: 'Shift', label: 'Shift ⇧', width: 2.75, finger: 'right-pinky', isModifier: true },
  ],
  // Row 5: Modifier row
  [
    { code: 'ControlLeft', key: 'Control', label: 'Ctrl', width: 1.25, finger: 'left-pinky', isModifier: true },
    { code: 'MetaLeft', key: 'Meta', label: 'Win ⊞', width: 1.25, finger: 'left-pinky', isModifier: true },
    { code: 'AltLeft', key: 'Alt', label: 'Alt', width: 1.25, finger: 'thumb', isModifier: true },
    { code: 'Space', key: ' ', label: 'Space ␣', width: 6.25, finger: 'thumb' },
    { code: 'AltRight', key: 'Alt', label: 'Alt', width: 1.25, finger: 'thumb', isModifier: true },
    { code: 'MetaRight', key: 'Fn', label: 'Fn', width: 1.25, finger: 'right-pinky', isModifier: true },
    { code: 'ControlRight', key: 'Control', label: 'Ctrl', width: 1.25, finger: 'right-pinky', isModifier: true },
  ],
];

// Finger colors for touch-typing guides
export const FINGER_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'left-pinky': { bg: 'rgba(239, 68, 68, 0.12)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)', label: 'Chap jimjiloq' },
  'left-ring': { bg: 'rgba(249, 115, 22, 0.12)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.3)', label: 'Chap nomsiz' },
  'left-middle': { bg: 'rgba(234, 179, 8, 0.12)', text: '#facc15', border: 'rgba(234, 179, 8, 0.3)', label: 'Chap o\'rta' },
  'left-index': { bg: 'rgba(34, 197, 94, 0.12)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)', label: 'Chap ko\'rsatkich' },
  'thumb': { bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)', label: 'Bosh barmoq' },
  'right-index': { bg: 'rgba(59, 130, 246, 0.12)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)', label: 'O\'ng ko\'rsatkich' },
  'right-middle': { bg: 'rgba(14, 165, 233, 0.12)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.3)', label: 'O\'ng o\'rta' },
  'right-ring': { bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)', label: 'O\'ng nomsiz' },
  'right-pinky': { bg: 'rgba(236, 72, 153, 0.12)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)', label: 'O\'ng jimjiloq' },
};
