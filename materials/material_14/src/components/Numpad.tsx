import { Phase } from '../types';

interface NumpadProps {
  phase: Phase;
  bringDownDigit: string | null;
  onPressDigit: (digit: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onBringDown: () => void;
}

export function Numpad({
  phase,
  bringDownDigit,
  onPressDigit,
  onClear,
  onSubmit,
  onBringDown,
}: NumpadProps) {
  if (phase === 'D') {
    return (
      <div className="w-full max-w-[300px] mx-auto mt-4 px-2">
        <button
          type="button"
          onClick={onBringDown}
          className="w-full bg-[#6FB3D9] hover:bg-[#4A93BC] active:scale-[0.98] text-white font-bold text-lg py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>「{bringDownDigit}」を下ろす</span>
          <span className="text-xl">↓</span>
        </button>
      </div>
    );
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'ok'];

  return (
    <div className="grid grid-cols-3 gap-2.5 max-w-[300px] mx-auto mt-2 select-none">
      {keys.map((key) => {
        if (key === 'clear') {
          return (
            <button
              key="btn-clear"
              type="button"
              onClick={onClear}
              className="py-3.5 bg-[#FDEEEC] hover:bg-[#FCD8D4] active:scale-[0.93] text-[#D9614A] border-2 border-[#F3C7BE] rounded-xl text-lg font-bold transition-transform cursor-pointer"
            >
              消す
            </button>
          );
        }

        if (key === 'ok') {
          return (
            <button
              key="btn-ok"
              type="button"
              onClick={onSubmit}
              className="py-3.5 bg-[#4FAF7C] hover:bg-[#3A8F62] active:scale-[0.93] text-white border-2 border-[#3A8F62] rounded-xl text-xl font-black transition-transform cursor-pointer shadow-sm"
            >
              OK
            </button>
          );
        }

        if (key === '0') {
          return (
            <button
              key="btn-0"
              type="button"
              onClick={() => onPressDigit('0')}
              className="py-3.5 bg-[#FBF7EC] hover:bg-white active:scale-[0.93] text-[#33414E] border-2 border-[#C3DEDC] hover:border-[#6FB3D9] rounded-xl text-xl font-bold font-mono transition-transform cursor-pointer"
            >
              0
            </button>
          );
        }

        return (
          <button
            key={`btn-${key}`}
            type="button"
            onClick={() => onPressDigit(key)}
            className="py-3.5 bg-[#FBF7EC] hover:bg-white active:scale-[0.93] text-[#33414E] border-2 border-[#C3DEDC] hover:border-[#6FB3D9] rounded-xl text-xl font-bold font-mono transition-transform cursor-pointer"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
