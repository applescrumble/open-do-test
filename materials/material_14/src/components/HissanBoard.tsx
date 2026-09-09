import { HissanStep, Phase } from '../types';

interface HissanBoardProps {
  dividendDigits: string[];
  divisor: number;
  steps: HissanStep[];
  stepIdx: number;
  phase: Phase;
  inputSlots: string[];
  activeSlotIdx: number;
  flashState: 'none' | 'correct' | 'wrong';
  targetSpan: [number, number] | null;
  onSelectSlot: (slotIdx: number) => void;
}

export function HissanBoard({
  dividendDigits,
  divisor,
  steps,
  stepIdx,
  phase,
  inputSlots,
  activeSlotIdx,
  flashState,
  targetSpan,
  onSelectSlot,
}: HissanBoardProps) {
  const n = dividendDigits.length;
  if (n === 0) return null;

  const currentStep = steps[stepIdx];
  const divisorDigits = String(divisor).length;
  const divisorWidthClass = divisorDigits >= 3 ? 'w-20 sm:w-24' : divisorDigits >= 2 ? 'w-14 sm:w-16' : 'w-10 sm:w-12';

  // Render input slot or placeholder
  const renderSlotCell = (colPos: number, span: [number, number]) => {
    const isInside = colPos >= span[0] && colPos <= span[1];
    if (!isInside) {
      return <div key={`slot-empty-${colPos}`} className="w-10 h-10" />;
    }

    const slotIdx = colPos - span[0];
    const filledChar = inputSlots[slotIdx] || '';
    const isFilled = filledChar !== '';
    const isActive = activeSlotIdx === slotIdx && phase !== 'D';

    let slotClass =
      'w-9 h-9 mx-auto flex items-center justify-center rounded-lg text-2xl font-black font-mono transition-all select-none relative';

    if (flashState === 'correct') {
      slotClass += ' border-[2.5px] border-solid border-[#4FAF7C] bg-[#EFFAF3] text-[#3A8F62] animate-pop';
    } else if (flashState === 'wrong') {
      slotClass += ' border-[2.5px] border-solid border-[#EE7A63] bg-[#FDEEEC] text-[#D9614A] animate-shake';
    } else if (isActive) {
      slotClass +=
        ' border-[2.5px] border-[#3B82F6] bg-[#EFF6FF] text-[#1D4ED8] ring-4 ring-[#93C5FD]/60 shadow-md scale-105';
    } else if (isFilled) {
      slotClass +=
        ' border-[2.5px] border-solid border-[#6FB3D9] text-[#4A93BC] bg-white hover:bg-[#F0F8FC] shadow-inner cursor-pointer hover:scale-102';
    } else {
      slotClass +=
        ' border-[2.5px] border-dashed border-[#C3DEDC] bg-white hover:border-[#6FB3D9] hover:bg-[#F8FCFB] animate-pulse-slot cursor-pointer';
    }

    return (
      <div
        key={`slot-${colPos}`}
        onClick={() => onSelectSlot(slotIdx)}
        className="w-10 h-10 flex items-center justify-center cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`マス ${slotIdx + 1}`}
      >
        <div className={slotClass}>
          {filledChar}
          {isActive && !isFilled && flashState === 'none' && (
            <span className="absolute w-2.5 h-0.5 bg-[#3B82F6] bottom-1.5 animate-pulse rounded-full" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 select-none" id="hissanBoardArea">
      {/* Background card container with math notebook styling */}
      <div className="relative inline-block bg-[#FDFCF7] border-2 border-[#D8E9E4] rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto max-w-full">
        
        {/* Board Main Structure */}
        <div className="flex flex-col font-['Zen_Maru_Gothic',sans-serif] text-[#33414E]">
          
          {/* 1. QUOTIENT ROW (商) */}
          <div className="flex items-center h-10">
            {/* Divisor width placeholder */}
            <div className={`${divisorWidthClass} shrink-0`} />
            {/* Bracket width placeholder */}
            <div className="w-4 shrink-0" />
            
            {/* Quotient digits */}
            <div className="flex items-center">
              {dividendDigits.map((_, i) => {
                const col = i + 1;
                const completedStep = steps.find((s) => s.quotientCol === col && s.qRevealed);
                const isQTarget = phase === 'A';

                return (
                  <div
                    key={`q-col-${col}`}
                    className="w-10 h-10 flex items-center justify-center relative"
                  >
                    {completedStep ? (
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#33414E] animate-pop">
                        {completedStep.quotientDigit}
                      </span>
                    ) : isQTarget && targetSpan && col >= targetSpan[0] && col <= targetSpan[1] ? (
                      renderSlotCell(col, targetSpan)
                    ) : (
                      <span className="text-transparent">0</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. DIVISOR & DIVIDEND WITH AUTHENTIC JAPANESE DIVISION BRACKET */}
          <div className="flex items-center h-10 relative">
            
            {/* Divisor (割る数) */}
            <div className={`${divisorWidthClass} shrink-0 flex items-center justify-end pr-1.5`}>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#33414E]">
                {divisor}
              </span>
            </div>

            {/* Division Bracket: Curved Separator on left + Overline directly over dividend */}
            <div className="relative flex items-center h-10">
              
              {/* Bracket Arc Symbol `)` */}
              <div className="w-4 h-10 shrink-0 relative flex items-center justify-center">
                <svg
                  className="w-full h-full text-[#33414E]"
                  viewBox="0 0 16 40"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 3,38 C 14,28 15,8 16,0"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              {/* Dividend Digits (with top overline of the hissan bracket) */}
              <div className="flex items-center h-10 border-t-[3.2px] border-[#33414E] relative">
                {dividendDigits.map((digit, i) => {
                  const col = i + 1;
                  const isBeingBroughtDown =
                    phase === 'D' && currentStep && currentStep.bringDownDigit === digit && col === currentStep.quotientCol + 1;

                  return (
                    <div
                      key={`div-col-${col}`}
                      className={`w-10 h-10 flex items-center justify-center relative transition-colors ${
                        isBeingBroughtDown ? 'bg-[#6FB3D9]/15 rounded-md' : ''
                      }`}
                    >
                      <span
                        className={`text-2xl sm:text-3xl font-black font-mono ${
                          isBeingBroughtDown ? 'text-[#3A8F62] scale-110' : 'text-[#33414E]'
                        }`}
                      >
                        {digit}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* 3. STEP-BY-STEP WORK ROWS (かけ算・引き算・おろす) */}
          <div className="flex flex-col">
            {steps.map((s, idx) => {
              const isCurrent = idx === stepIdx;
              const showProductRow = s.productRevealed || (isCurrent && phase === 'B');
              const showValueRow = s.valueRevealed || (isCurrent && phase === 'C');

              if (!showProductRow && !showValueRow) return null;

              const productLen = s.productSpan[1] - s.productSpan[0] + 1;
              const productStr = String(s.product).padStart(productLen, '0');
              const pSpan = isCurrent && phase === 'B' ? targetSpan : null;

              const useCombined = s.broughtDown && s.hasNext;
              const valueSpan = useCombined ? s.combinedSpan! : s.valueSpanAlone;
              const valLen = valueSpan[1] - valueSpan[0] + 1;
              const val = useCombined ? s.combinedValue! : s.value;
              const valStr = String(val).padStart(valLen, '0');
              const vSpan = isCurrent && phase === 'C' ? targetSpan : null;

              return (
                <div key={`work-step-${idx}`} className="flex flex-col">
                  
                  {/* (A) Product Row (かけ算の答え) */}
                  {showProductRow && (
                    <div className="flex items-center h-10">
                      {/* Minus symbol */}
                      <div className={`${divisorWidthClass} shrink-0 flex items-center justify-end pr-1 text-[#5C6B78] font-bold text-xl sm:text-2xl select-none`}>
                        <span>－</span>
                      </div>
                      {/* Bracket spacing */}
                      <div className="w-4 shrink-0" />

                      {/* Product digits strictly aligned under respective columns */}
                      <div className="flex items-center">
                        {dividendDigits.map((_, i) => {
                          const col = i + 1;
                          const isProductCol = col >= s.productSpan[0] && col <= s.productSpan[1];

                          if (s.productRevealed && isProductCol) {
                            const char = productStr[col - s.productSpan[0]];
                            return (
                              <div
                                key={`prod-col-${col}`}
                                className="w-10 h-10 flex items-center justify-center"
                              >
                                <span className="text-2xl sm:text-3xl font-black font-mono text-[#33414E] animate-pop">
                                  {char}
                                </span>
                              </div>
                            );
                          }

                          if (pSpan && col >= pSpan[0] && col <= pSpan[1]) {
                            return renderSlotCell(col, pSpan);
                          }

                          return (
                            <div
                              key={`prod-empty-${col}`}
                              className="w-10 h-10 flex items-center justify-center"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* (B) Subtraction Underline (引き算の仕切り横線) */}
                  {s.productRevealed && (
                    <div className="flex items-center h-1">
                      <div className={`${divisorWidthClass} shrink-0`} />
                      <div className="w-4 shrink-0" />
                      <div className="flex items-center">
                        {dividendDigits.map((_, i) => {
                          const col = i + 1;
                          const hasLine = col >= s.productSpan[0] && col <= s.productSpan[1];
                          return (
                            <div
                              key={`sub-line-${col}`}
                              className="w-10 h-1 flex items-center justify-center"
                            >
                              {hasLine && (
                                <div className="w-full border-t-[2.8px] border-[#33414E]" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* (C) Value / Remainder / Combined Row (ひき算の答え・おろした数字) */}
                  {showValueRow && (
                    <div className="flex items-center h-10">
                      <div className={`${divisorWidthClass} shrink-0`} />
                      <div className="w-4 shrink-0" />

                      <div className="flex items-center">
                        {dividendDigits.map((_, i) => {
                          const col = i + 1;
                          const isValueCol = col >= valueSpan[0] && col <= valueSpan[1];

                          if (s.valueRevealed && isValueCol) {
                            const char = valStr[col - valueSpan[0]];
                            const isBroughtDigit = useCombined && col === valueSpan[1];

                            return (
                              <div
                                key={`val-col-${col}`}
                                className="w-10 h-10 flex items-center justify-center relative"
                              >
                                <span
                                  className={`text-2xl sm:text-3xl font-black font-mono animate-pop ${
                                    isBroughtDigit
                                      ? 'text-[#3A8F62] font-black'
                                      : 'text-[#33414E]'
                                  }`}
                                >
                                  {char}
                                </span>
                              </div>
                            );
                          }

                          if (vSpan && col >= vSpan[0] && col <= vSpan[1]) {
                            return renderSlotCell(col, vSpan);
                          }

                          return (
                            <div
                              key={`val-empty-${col}`}
                              className="w-10 h-10 flex items-center justify-center"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
