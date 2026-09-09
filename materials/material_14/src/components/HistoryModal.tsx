import { useState } from 'react';
import { X, Sparkles, Trophy, Award, Clock, ArrowRight, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { SolvedHistoryItem, GameModeId } from '../types';
import { GAME_MODES, planSteps, createProblemFromCustom } from '../utils/hissan';
import { HissanBoard } from './HissanBoard';
import { Mascot } from './Mascot';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SolvedHistoryItem[];
  starCount: number;
  onRetryProblem: (dividend: number, divisor: number, modeId: GameModeId) => void;
  onClearHistory: (resetStars?: boolean) => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  starCount,
  onRetryProblem,
  onClearHistory,
}: HistoryModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);
  const [resetStars, setResetStars] = useState<boolean>(false);

  if (!isOpen) return null;

  const perfectCount = history.filter((h) => h.isPerfect).length;
  const filteredHistory =
    selectedFilter === 'all'
      ? history
      : selectedFilter === 'perfect'
      ? history.filter((h) => h.isPerfect)
      : history.filter((h) => h.modeId === selectedFilter);

  const formatTime = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'たった今';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}分前`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}時間前`;
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getSolvedBoardData = (item: SolvedHistoryItem) => {
    const prob = createProblemFromCustom(item.dividend, item.divisor);
    const steps = planSteps(prob.dividendDigits, prob.divisor);
    // reveal all for completed preview
    const completedSteps = steps.map((s) => ({
      ...s,
      qRevealed: true,
      productRevealed: true,
      valueRevealed: true,
      broughtDown: true,
    }));
    return { prob, steps: completedSteps };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#33414E]/60 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="historyModalTitle"
    >
      <div
        className="relative w-full max-w-lg bg-[#FDFCF7] border-2 border-[#D8E9E4] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-['Zen_Maru_Gothic',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white border-b border-[#D8E9E4] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#F0A63E]/15 border border-[#F0A63E]/30 flex items-center justify-center text-[#F0A63E]">
              <Sparkles className="w-5 h-5 fill-[#F0A63E]" />
            </div>
            <div>
              <h2 id="historyModalTitle" className="text-lg sm:text-xl font-bold text-[#33414E] leading-tight">
                解いた問題の記録
              </h2>
              <p className="text-xs text-[#5C6B78]">
                これまでクリアした問題を見返せるよ！
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="w-9 h-9 rounded-full bg-[#FBF7EC] hover:bg-[#EE7A63]/15 text-[#5C6B78] hover:text-[#EE7A63] border border-[#D8E9E4] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Banner */}
        <div className="bg-[#FBF7EC] px-4 py-3 border-b border-[#D8E9E4] shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white border border-[#D8E9E4] rounded-xl p-2.5 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#5C6B78] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#F0A63E] fill-[#F0A63E]" />
                <span>スター</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#D98A20] font-mono mt-0.5">
                {starCount}
              </div>
            </div>

            <div className="bg-white border border-[#D8E9E4] rounded-xl p-2.5 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#5C6B78] font-bold">
                <Award className="w-3.5 h-3.5 text-[#6FB3D9]" />
                <span>クリア数</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#4A93BC] font-mono mt-0.5">
                {history.length} <span className="text-xs font-normal text-[#5C6B78]">問</span>
              </div>
            </div>

            <div className="bg-white border border-[#D8E9E4] rounded-xl p-2.5 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#5C6B78] font-bold">
                <Trophy className="w-3.5 h-3.5 text-[#4FAF7C]" />
                <span>ノーミス</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#3A8F62] font-mono mt-0.5">
                {perfectCount} <span className="text-xs font-normal text-[#5C6B78]">問</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          {history.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-[#33414E] text-white'
                    : 'bg-white text-[#5C6B78] border border-[#D8E9E4] hover:bg-[#E8F3F1]'
                }`}
              >
                すべて ({history.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('perfect')}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                  selectedFilter === 'perfect'
                    ? 'bg-[#4FAF7C] text-white'
                    : 'bg-white text-[#3A8F62] border border-[#4FAF7C]/30 hover:bg-[#EFFAF3]'
                }`}
              >
                👑 ノーミス ({perfectCount})
              </button>
              {(Object.keys(GAME_MODES) as GameModeId[]).map((mId) => {
                const count = history.filter((h) => h.modeId === mId).length;
                if (count === 0) return null;
                const cfg = GAME_MODES[mId];
                return (
                  <button
                    key={mId}
                    type="button"
                    onClick={() => setSelectedFilter(mId)}
                    className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                      selectedFilter === mId
                        ? 'text-white'
                        : 'bg-white text-[#5C6B78] border border-[#D8E9E4] hover:bg-[#E8F3F1]'
                    }`}
                    style={selectedFilter === mId ? { backgroundColor: cfg.color } : {}}
                  >
                    {cfg.badge} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Body: Solved Problems List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Mascot size={90} mood="thinking" />
              <p className="font-bold text-base text-[#33414E] mt-3">
                まだ解いた問題がないよ！
              </p>
              <p className="text-xs text-[#5C6B78] mt-1 max-w-xs leading-relaxed">
                コースを選んで筆算を解くと、ここに解いた問題が記録されていつでも見返せるよ。
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-[#5C6B78] text-sm">
              該当する問題がありません
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isExpanded = expandedItemId === item.id;
              const cfg = GAME_MODES[item.modeId] || GAME_MODES['2_div_1'];
              const hasRemainder = item.remainder > 0;

              return (
                <div
                  key={item.id}
                  className="bg-white border-2 border-[#D8E9E4] rounded-2xl p-3.5 shadow-xs transition-all hover:border-[#6FB3D9]"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {/* Left: Mode Badge & Formula */}
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: cfg.color }}
                        className="px-2 py-0.5 rounded-lg text-white text-xs font-black shrink-0"
                      >
                        {cfg.badge}
                      </span>

                      <div>
                        <div className="text-base sm:text-lg font-black font-mono text-[#33414E] flex items-center gap-1.5">
                          <span>{item.dividend}</span>
                          <span className="text-xs text-[#5C6B78]">÷</span>
                          <span>{item.divisor}</span>
                          <span className="text-xs text-[#5C6B78]">=</span>
                          <span className="text-[#3A8F62]">{item.quotient}</span>
                          {hasRemainder && (
                            <span className="text-xs text-[#D98A20] font-normal font-sans">
                              あまり <b className="font-mono text-sm font-bold">{item.remainder}</b>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#5C6B78] mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.solvedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Perfect Badge & Action Buttons */}
                    <div className="flex items-center gap-2">
                      {item.isPerfect ? (
                        <span className="px-2 py-0.5 bg-[#EFFAF3] border border-[#4FAF7C]/30 text-[#3A8F62] rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ノーミス！</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#FBF7EC] border border-[#D8E9E4] text-[#5C6B78] rounded-full text-xs">
                          ミス {item.mistakes}回
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="px-2.5 py-1 text-xs font-bold text-[#4A93BC] hover:bg-[#6FB3D9]/10 rounded-lg flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <span>筆算</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onRetryProblem(item.dividend, item.divisor, item.modeId);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-[#6FB3D9] hover:bg-[#4A93BC] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95"
                      >
                        <span>もう一度</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Completed Hissan Board */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#D8E9E4] flex flex-col items-center bg-[#FDFCF7] rounded-xl p-2 animate-fade-in">
                      <div className="text-xs font-bold text-[#5C6B78] mb-1">
                        📖 完成した筆算
                      </div>
                      {(() => {
                        const boardData = getSolvedBoardData(item);
                        return (
                          <HissanBoard
                            dividendDigits={boardData.prob.dividendDigits}
                            divisor={boardData.prob.divisor}
                            steps={boardData.steps}
                            stepIdx={boardData.steps.length - 1}
                            phase="D"
                            inputSlots={[]}
                            activeSlotIdx={0}
                            flashState="none"
                            targetSpan={null}
                            onSelectSlot={() => {}}
                          />
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-[#D8E9E4] px-4 py-3 flex items-center justify-between shrink-0">
          {history.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="text-xs text-[#D9614A] hover:text-[#EE7A63] flex items-center gap-1 font-bold cursor-pointer py-1.5 px-2.5 hover:bg-[#EE7A63]/10 rounded-lg transition-colors border border-transparent hover:border-[#EE7A63]/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>記録を消去</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#33414E] hover:bg-[#202932] text-white rounded-xl font-bold text-sm cursor-pointer transition-colors active:scale-95 shadow-sm"
          >
            閉じる
          </button>
        </div>

        {/* Clear Confirmation Sub-dialog */}
        {showConfirmClear && (
          <div className="absolute inset-0 z-20 bg-[#33414E]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white border-2 border-[#EE7A63] rounded-2xl p-5 max-w-xs sm:max-w-sm w-full shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#FDEEEC] text-[#D9614A] mx-auto flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-base text-[#33414E] mb-1">
                解いた記録を消去しますか？
              </h3>
              <p className="text-xs text-[#5C6B78] leading-relaxed mb-4">
                これまでに解いた問題の一覧（{history.length}問）がリセットされます。
              </p>

              <label className="flex items-center justify-center gap-2 text-xs font-bold text-[#33414E] bg-[#FBF7EC] p-2.5 rounded-xl border border-[#D8E9E4] mb-5 cursor-pointer hover:bg-[#F4EDE0]">
                <input
                  type="checkbox"
                  checked={resetStars}
                  onChange={(e) => setResetStars(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F0A63E] focus:ring-[#F0A63E] cursor-pointer"
                />
                <span>✨ 集めたスター（{starCount}個）もリセットする</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-2.5 bg-[#FBF7EC] hover:bg-[#E8F3F1] text-[#5C6B78] font-bold text-xs rounded-xl border border-[#D8E9E4] cursor-pointer transition-colors"
                >
                  やめる
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory(resetStars);
                    setShowConfirmClear(false);
                  }}
                  className="flex-1 py-2.5 bg-[#EE7A63] hover:bg-[#D9614A] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors active:scale-95"
                >
                  消去する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
