import React, { useState } from 'react';
import { Sliders, Play, RotateCcw, FastForward, CheckCircle2, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { Phase, Problem } from '../types';

interface PreviewToolbarProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onSetCustomProblem: (dividend: number, divisor: number) => void;
  onStepForward: () => void;
  onSolveAll: () => void;
  onResetStep: () => void;
  currentProblem: Problem | null;
  phase: Phase;
  stepIdx: number;
  totalSteps: number;
  onJumpPhase: (phase: Phase) => void;
}

export function PreviewToolbar({
  isOpen,
  onToggleOpen,
  onSetCustomProblem,
  onStepForward,
  onSolveAll,
  onResetStep,
  currentProblem,
  phase,
  stepIdx,
  totalSteps,
  onJumpPhase,
}: PreviewToolbarProps) {
  const [customDividend, setCustomDividend] = useState(currentProblem ? String(currentProblem.dividend) : '84');
  const [customDivisor, setCustomDivisor] = useState(currentProblem ? String(currentProblem.divisor) : '3');

  const phaseNames: Record<Phase, string> = {
    A: '① 商をたてる (A)',
    B: '② かけ算 (B)',
    C: '③ ひき算 (C)',
    D: '④ おろす (D)',
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const d1 = parseInt(customDividend, 10);
    const d2 = parseInt(customDivisor, 10);
    if (!isNaN(d1) && !isNaN(d2) && d1 > 0 && d2 > 0) {
      onSetCustomProblem(d1, d2);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 bg-white border-2 border-[#6FB3D9] rounded-2xl shadow-lg overflow-hidden transition-all">
      {/* Header Bar */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#6FB3D9]/15 hover:bg-[#6FB3D9]/25 text-[#33414E] font-bold text-sm transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#4A93BC]" />
          <span className="text-base text-[#3A8F62] font-black">🛠️ UI確認・プレビュー操作パネル</span>
          <span className="text-xs px-2 py-0.5 bg-[#4FAF7C] text-white rounded-full font-bold">Preview Mode</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5C6B78]">
          <span>{isOpen ? '閉じる' : '開いて状態を確認・変更'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Panel Contents */}
      {isOpen && (
        <div className="p-4 space-y-4 text-xs sm:text-sm bg-white">
          
          {/* Custom Problem Input */}
          <div className="bg-[#FBF7EC] p-3 rounded-xl border border-[#D8E9E4]">
            <div className="font-bold text-[#33414E] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F0A63E]" />
              <span>テストしたい問題を自由に設定（2桁〜4桁自由）</span>
            </div>
            <form onSubmit={handleApplyCustom} className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label className="font-bold text-xs text-[#5C6B78]">割られる数:</label>
                <input
                  type="number"
                  min="10"
                  max="9999"
                  value={customDividend}
                  onChange={(e) => setCustomDividend(e.target.value)}
                  className="w-20 px-2.5 py-1.5 bg-white border border-[#C3DEDC] rounded-lg font-mono font-bold text-center focus:outline-[#6FB3D9]"
                  placeholder="84"
                />
              </div>
              <span className="font-bold text-base text-[#5C6B78]">÷</span>
              <div className="flex items-center gap-1.5">
                <label className="font-bold text-xs text-[#5C6B78]">割る数:</label>
                <input
                  type="number"
                  min="2"
                  max="99"
                  value={customDivisor}
                  onChange={(e) => setCustomDivisor(e.target.value)}
                  className="w-16 px-2.5 py-1.5 bg-white border border-[#C3DEDC] rounded-lg font-mono font-bold text-center focus:outline-[#6FB3D9]"
                  placeholder="3"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#4FAF7C] hover:bg-[#3A8F62] text-white font-bold rounded-lg shadow-sm cursor-pointer transition-all flex items-center gap-1"
              >
                <span>問題を作成</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Preset Buttons */}
              <div className="w-full flex flex-wrap gap-1.5 pt-2 mt-1 border-t border-[#D8E9E4]">
                <span className="text-[11px] text-[#5C6B78] py-1">クイック例:</span>
                <button
                  type="button"
                  onClick={() => { setCustomDividend('74'); setCustomDivisor('3'); onSetCustomProblem(74, 3); }}
                  className="px-2 py-0.5 bg-white border border-[#C3DEDC] hover:bg-[#6FB3D9]/10 rounded text-[11px] font-bold text-[#33414E] cursor-pointer"
                >
                  74 ÷ 3 (2÷1)
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomDividend('428'); setCustomDivisor('4'); onSetCustomProblem(428, 4); }}
                  className="px-2 py-0.5 bg-white border border-[#C3DEDC] hover:bg-[#6FB3D9]/10 rounded text-[11px] font-bold text-[#33414E] cursor-pointer"
                >
                  428 ÷ 4 (3÷1)
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomDividend('85'); setCustomDivisor('21'); onSetCustomProblem(85, 21); }}
                  className="px-2 py-0.5 bg-[#9B51E0]/10 border border-[#9B51E0]/30 hover:bg-[#9B51E0]/20 rounded text-[11px] font-bold text-[#7E3EB6] cursor-pointer"
                >
                  85 ÷ 21 (2÷2)
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomDividend('846'); setCustomDivisor('24'); onSetCustomProblem(846, 24); }}
                  className="px-2 py-0.5 bg-[#4FAF7C]/10 border border-[#4FAF7C]/30 hover:bg-[#4FAF7C]/20 rounded text-[11px] font-bold text-[#2E754F] cursor-pointer"
                >
                  846 ÷ 24 (3÷2)
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomDividend('1450'); setCustomDivisor('25'); onSetCustomProblem(1450, 25); }}
                  className="px-2 py-0.5 bg-[#EE7A63]/10 border border-[#EE7A63]/30 hover:bg-[#EE7A63]/20 rounded text-[11px] font-bold text-[#D9614A] cursor-pointer"
                >
                  1450 ÷ 25 (4÷2)
                </button>
              </div>
            </form>
          </div>

          {/* Step & Phase Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#FBF7EC] p-3 rounded-xl border border-[#D8E9E4]">
              <div className="font-bold text-[#33414E] mb-2 flex items-center justify-between">
                <span>現在の進行状況:</span>
                <span className="px-2 py-0.5 bg-[#F0A63E] text-white rounded-md text-xs font-mono font-bold">
                  Step {stepIdx + 1} / {totalSteps || 1}
                </span>
              </div>
              <div className="text-xs text-[#5C6B78] font-bold mb-2">
                現在フェーズ: <span className="text-[#3A8F62] font-black">{phaseNames[phase]}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onStepForward}
                  className="flex-1 px-3 py-1.5 bg-[#6FB3D9] hover:bg-[#4A93BC] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  title="次のフェーズへ強制進行"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>1ステップ進める</span>
                </button>
                <button
                  type="button"
                  onClick={onSolveAll}
                  className="px-3 py-1.5 bg-[#F0A63E] hover:bg-[#D98A20] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  title="全ステップを一発で解いて完成状態を確認"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>すべて完了</span>
                </button>
                <button
                  type="button"
                  onClick={onResetStep}
                  className="px-2.5 py-1.5 bg-white border border-[#EE7A63] text-[#EE7A63] hover:bg-[#FDEEEC] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  title="現在の問題を最初からやり直す"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>リセット</span>
                </button>
              </div>
            </div>

            {/* Quick Phase Jump */}
            <div className="bg-[#FBF7EC] p-3 rounded-xl border border-[#D8E9E4] flex flex-col justify-between">
              <div className="font-bold text-[#33414E] mb-1.5">フェーズ切り替えテスト:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(['A', 'B', 'C', 'D'] as Phase[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onJumpPhase(p)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      phase === p
                        ? 'bg-[#6FB3D9] text-white border-[#4A93BC]'
                        : 'bg-white text-[#33414E] border-[#C3DEDC] hover:bg-slate-50'
                    }`}
                  >
                    {phaseNames[p]}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-[#5C6B78] mt-1.5">
                ※ 各フェーズごとのガイド文やスロットのアニメーション確認ができます
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
