import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ArrowLeft, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { GameModeId, HissanStep, Phase, Problem, SolvedHistoryItem } from './types';
import { generateProblem, planSteps, createProblemFromCustom, GAME_MODES } from './utils/hissan';
import { Mascot } from './components/Mascot';
import { HissanBoard } from './components/HissanBoard';
import { Numpad } from './components/Numpad';
import { PreviewToolbar } from './components/PreviewToolbar';
import { HistoryModal } from './components/HistoryModal';

export default function App() {
  // Navigation & Problem State
  const [screen, setScreen] = useState<'menu' | 'game' | 'complete'>('menu');
  const [modeId, setModeId] = useState<GameModeId>('2_div_1');
  const [problemCount, setProblemCount] = useState<number>(1);
  const [starCount, setStarCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hissan_star_count');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [history, setHistory] = useState<SolvedHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('hissan_solved_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [steps, setSteps] = useState<HissanStep[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>('A');
  const [inputSlots, setInputSlots] = useState<string[]>([]);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);
  
  // Feedback & Mistake tracking
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [mistakesThisProblem, setMistakesThisProblem] = useState<number>(0);
  const [bubbleHint, setBubbleHint] = useState<string>('');
  const [flashState, setFlashState] = useState<'none' | 'correct' | 'wrong'>('none');

  // Preview / UI check toolbar state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true);

  // Save history and stars to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hissan_star_count', starCount.toString());
    } catch {}
  }, [starCount]);

  useEffect(() => {
    try {
      localStorage.setItem('hissan_solved_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Initialize a new problem
  const startProblem = useCallback((prob: Problem) => {
    const planned = planSteps(prob.dividendDigits, prob.divisor);
    setProblem(prob);
    setSteps(planned);
    setStepIdx(0);
    setPhase('A');
    setInputSlots([]);
    setActiveSlotIdx(0);
    setWrongCount(0);
    setMistakesThisProblem(0);
    setBubbleHint('');
    setFlashState('none');
    setScreen('game');
  }, []);

  const startNewRandomProblem = useCallback((selectedModeId: GameModeId) => {
    setModeId(selectedModeId);
    const prob = generateProblem(selectedModeId);
    startProblem(prob);
  }, [startProblem]);

  const handleStartGame = (selectedModeId: GameModeId) => {
    setProblemCount(1);
    startNewRandomProblem(selectedModeId);
  };

  const handleNextProblem = () => {
    setProblemCount((prev) => prev + 1);
    startNewRandomProblem(modeId);
  };

  const handleBackToMenu = () => {
    setScreen('menu');
  };

  // Current Target Span & Width calculation
  const currentStep = steps[stepIdx];

  const getTargetSpan = useCallback((): [number, number] | null => {
    if (!currentStep) return null;
    if (phase === 'A') return [currentStep.quotientCol, currentStep.quotientCol];
    if (phase === 'B') return currentStep.productSpan;
    if (phase === 'C') return currentStep.valueSpanAlone;
    return null;
  }, [currentStep, phase]);

  const targetSpan = getTargetSpan();
  const targetWidth = targetSpan ? targetSpan[1] - targetSpan[0] + 1 : 0;

  // Reset input slots when phase or target step changes
  useEffect(() => {
    if (targetWidth > 0) {
      setInputSlots(Array(targetWidth).fill(''));
      setActiveSlotIdx(0);
    } else {
      setInputSlots([]);
      setActiveSlotIdx(0);
    }
  }, [phase, stepIdx, targetWidth]);

  const handleSelectSlot = useCallback((idx: number) => {
    if (idx >= 0 && idx < targetWidth) {
      setActiveSlotIdx(idx);
    }
  }, [targetWidth]);

  // Expected Value for current phase
  const getExpectedValue = useCallback((): number | null => {
    if (!currentStep) return null;
    if (phase === 'A') return currentStep.quotientDigit;
    if (phase === 'B') return currentStep.product;
    if (phase === 'C') return currentStep.value;
    return null;
  }, [currentStep, phase]);

  // Bring Down action (Phase D)
  const handleBringDown = useCallback(() => {
    if (!currentStep || phase !== 'D') return;

    setSteps((prevSteps) => {
      const nextSteps = [...prevSteps];
      nextSteps[stepIdx] = {
        ...nextSteps[stepIdx],
        broughtDown: true,
        justBroughtDown: true,
      };
      return nextSteps;
    });

    setTimeout(() => {
      setStepIdx((prev) => prev + 1);
      setPhase('A');
      setWrongCount(0);
      setInputSlots([]);
      setActiveSlotIdx(0);
      setBubbleHint('');
    }, 450);
  }, [currentStep, phase, stepIdx]);

  // Completion trigger
  const handleFinishProblem = useCallback((mistakes: number) => {
    setScreen('complete');
    const isPerfect = mistakes === 0;
    const addedStars = isPerfect ? 2 : 1;
    setStarCount((prev) => prev + addedStars);

    if (problem) {
      const q = parseInt(steps.map((s) => s.quotientDigit).join(''), 10) || Math.floor(problem.dividend / problem.divisor);
      const r = steps.length > 0 ? steps[steps.length - 1].value : problem.dividend % problem.divisor;
      const currentConfig = GAME_MODES[modeId] || GAME_MODES['2_div_1'];

      const historyItem: SolvedHistoryItem = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        dividend: problem.dividend,
        divisor: problem.divisor,
        quotient: q,
        remainder: r,
        modeId,
        modeName: currentConfig.name,
        isPerfect,
        mistakes,
        solvedAt: Date.now(),
      };

      setHistory((prev) => [historyItem, ...prev]);
    }
  }, [problem, steps, modeId]);

  // Submit Answer validation
  const handleSubmitAnswer = useCallback(() => {
    if (!currentStep || targetWidth <= 0) return;

    // Check if all slots are filled
    const firstEmpty = inputSlots.findIndex((s) => s === '');
    if (firstEmpty !== -1 || inputSlots.length < targetWidth) {
      setActiveSlotIdx(firstEmpty !== -1 ? firstEmpty : 0);
      setBubbleHint('すべてのマスに 数字を入れてね！');
      return;
    }

    const inputStr = inputSlots.join('');
    const inputNum = parseInt(inputStr, 10);
    const expected = getExpectedValue();

    if (inputNum === expected) {
      // Correct!
      setFlashState('correct');
      setTimeout(() => {
        setFlashState('none');
        setInputSlots(Array(targetWidth).fill(''));
        setActiveSlotIdx(0);
        setWrongCount(0);
        setBubbleHint('');

        if (phase === 'A') {
          setSteps((prev) => {
            const next = [...prev];
            next[stepIdx] = { ...next[stepIdx], qRevealed: true };
            return next;
          });
          setPhase('B');
        } else if (phase === 'B') {
          setSteps((prev) => {
            const next = [...prev];
            next[stepIdx] = { ...next[stepIdx], productRevealed: true };
            return next;
          });
          setPhase('C');
        } else if (phase === 'C') {
          setSteps((prev) => {
            const next = [...prev];
            next[stepIdx] = { ...next[stepIdx], valueRevealed: true };
            return next;
          });
          if (currentStep.hasNext) {
            setPhase('D');
          } else {
            handleFinishProblem(mistakesThisProblem);
          }
        }
      }, 500);
    } else {
      // Wrong!
      setFlashState('wrong');
      const newMistakes = mistakesThisProblem + 1;
      const newWrongCount = wrongCount + 1;
      setMistakesThisProblem(newMistakes);
      setWrongCount(newWrongCount);

      let hint = '';
      if (phase === 'A' && problem) {
        if (inputNum * problem.divisor > currentStep.currentValue) {
          hint = '大きすぎるよ！もう少し小さい数字を試してみてね。';
        } else {
          hint = 'おしい！もっと大きい数字が入るはずだよ。';
        }
      } else if (phase === 'B' && problem) {
        hint = `${problem.divisor} × ${currentStep.quotientDigit} を もう一度 計算してみよう。`;
      } else if (phase === 'C') {
        hint = `${currentStep.currentValue} － ${currentStep.product} を もう一度 計算してみよう。`;
      }

      if (newWrongCount >= 3) {
        hint = `答えは【 ${expected} 】だよ！一緒に確認して 次に進もう。`;
        setTimeout(() => {
          setFlashState('none');
          setInputSlots(Array(targetWidth).fill(''));
          setActiveSlotIdx(0);
          setWrongCount(0);
          setBubbleHint('');

          if (phase === 'A') {
            setSteps((prev) => {
              const next = [...prev];
              next[stepIdx] = { ...next[stepIdx], qRevealed: true };
              return next;
            });
            setPhase('B');
          } else if (phase === 'B') {
            setSteps((prev) => {
              const next = [...prev];
              next[stepIdx] = { ...next[stepIdx], productRevealed: true };
              return next;
            });
            setPhase('C');
          } else if (phase === 'C') {
            setSteps((prev) => {
              const next = [...prev];
              next[stepIdx] = { ...next[stepIdx], valueRevealed: true };
              return next;
            });
            if (currentStep.hasNext) {
              setPhase('D');
            } else {
              handleFinishProblem(newMistakes);
            }
          }
        }, 1500);
      } else {
        setTimeout(() => {
          setFlashState('none');
          setInputSlots(Array(targetWidth).fill(''));
          setActiveSlotIdx(0);
        }, 400);
      }

      setBubbleHint(hint);
    }
  }, [
    currentStep,
    inputSlots,
    targetWidth,
    getExpectedValue,
    phase,
    stepIdx,
    mistakesThisProblem,
    wrongCount,
    problem,
    handleFinishProblem,
  ]);

  // Keypad inputs
  const handlePressDigit = useCallback((d: string) => {
    if (targetWidth <= 0) return;

    setInputSlots((prev) => {
      const next = [...prev];
      while (next.length < targetWidth) next.push('');
      next[activeSlotIdx] = d;
      return next;
    });

    // Advance to next slot naturally
    setActiveSlotIdx((currentIdx) => {
      if (targetWidth <= 1) return 0;
      return (currentIdx + 1) % targetWidth;
    });
  }, [activeSlotIdx, targetWidth]);

  const handleClear = useCallback(() => {
    if (targetWidth <= 0) return;

    setInputSlots((prev) => {
      const next = [...prev];
      while (next.length < targetWidth) next.push('');

      if (next[activeSlotIdx] !== '') {
        next[activeSlotIdx] = '';
        return next;
      } else {
        const prevIdx = activeSlotIdx > 0 ? activeSlotIdx - 1 : targetWidth - 1;
        next[prevIdx] = '';
        setActiveSlotIdx(prevIdx);
        return next;
      }
    });
  }, [activeSlotIdx, targetWidth]);

  // Keyboard navigation
  useEffect(() => {
    if (screen !== 'game') return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in input fields (like preview toolbar)
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (phase === 'D') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBringDown();
        }
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handlePressDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitAnswer();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlotIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlotIdx((prev) => Math.min(targetWidth - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen, phase, targetWidth, handleBringDown, handlePressDigit, handleClear, handleSubmitAnswer]);

  // Dynamic guide message
  const getGuideMessage = () => {
    if (!currentStep || !problem) return '読み込み中…';

    if (phase === 'A') {
      const isTwoDigitDivisor = problem.divisor >= 10;
      const estDivisor = Math.floor(problem.divisor / 10);
      const estCurrent = Math.floor(currentStep.currentValue / 10);

      return (
        <>
          <b className="text-[#D98A20] font-black">{currentStep.currentValue}</b> は{' '}
          <b className="text-[#D98A20] font-black">{problem.divisor}</b> が 何回 引ける？
          {isTwoDigitDivisor && estDivisor > 0 && (
            <span className="block mt-1 text-[11px] sm:text-xs text-[#4A93BC] bg-[#6FB3D9]/15 rounded-md px-2 py-0.5 font-bold">
              💡 ヒント: およそ「{estCurrent} ÷ {estDivisor}」で 予想（商の見当）をつけてみよう！
            </span>
          )}
          <span className="block mt-1 text-xs text-[#5C6B78]">
            {problem.divisor} × □ が {currentStep.currentValue} を こえない 一番大きい数字を入れてね。
          </span>
        </>
      );
    }
    if (phase === 'B') {
      return (
        <>
          {problem.divisor} × {currentStep.quotientDigit} は いくつ？
          <br />
          かけ算した答えを、下の空欄に入れよう。
        </>
      );
    }
    if (phase === 'C') {
      return (
        <>
          {currentStep.currentValue} － {currentStep.product} は いくつ？
          <br />
          引き算の答えを、下の空欄に入れよう。
        </>
      );
    }
    if (phase === 'D') {
      return (
        <>
          次の数字「<b className="text-[#3A8F62]">{currentStep.bringDownDigit}</b>」を下ろすよ。
          <br />
          ボタンを押してね。
        </>
      );
    }
    return '';
  };

  // Preview Toolbar Handlers
  const handleSetCustomProblem = (d1: number, d2: number) => {
    const custom = createProblemFromCustom(d1, d2);
    startProblem(custom);
  };

  const handleStepForward = () => {
    if (!currentStep) return;
    if (phase === 'A') {
      setSteps((prev) => {
        const next = [...prev];
        next[stepIdx] = { ...next[stepIdx], qRevealed: true };
        return next;
      });
      setPhase('B');
    } else if (phase === 'B') {
      setSteps((prev) => {
        const next = [...prev];
        next[stepIdx] = { ...next[stepIdx], productRevealed: true };
        return next;
      });
      setPhase('C');
    } else if (phase === 'C') {
      setSteps((prev) => {
        const next = [...prev];
        next[stepIdx] = { ...next[stepIdx], valueRevealed: true };
        return next;
      });
      if (currentStep.hasNext) {
        setPhase('D');
      } else {
        handleFinishProblem(0);
      }
    } else if (phase === 'D') {
      handleBringDown();
    }
    setInputSlots([]);
    setActiveSlotIdx(0);
  };

  const handleSolveAll = () => {
    if (!steps.length) return;
    const completed = steps.map((s) => ({
      ...s,
      qRevealed: true,
      productRevealed: true,
      valueRevealed: true,
      broughtDown: true,
    }));
    setSteps(completed);
    setStepIdx(steps.length - 1);
    handleFinishProblem(0);
  };

  const handleResetStep = () => {
    if (problem) {
      startProblem(problem);
    }
  };

  const handleJumpPhase = (targetPhase: Phase) => {
    setPhase(targetPhase);
    setInputSlots([]);
    setActiveSlotIdx(0);
    setFlashState('none');
    setBubbleHint('');
  };

  const handleRetryProblem = useCallback((dividend: number, divisor: number, targetModeId: GameModeId) => {
    setModeId(targetModeId);
    handleSetCustomProblem(dividend, divisor);
  }, [handleSetCustomProblem]);

  const handleClearHistory = useCallback((resetStars = false) => {
    setHistory([]);
    try {
      localStorage.removeItem('hissan_solved_history');
    } catch {}
    if (resetStars) {
      setStarCount(0);
      try {
        localStorage.removeItem('hissan_star_count');
      } catch {}
    }
  }, []);

  // Mascot emotion determination
  const mascotMood =
    flashState === 'correct' || screen === 'complete'
      ? 'happy'
      : flashState === 'wrong'
      ? 'thinking'
      : wrongCount > 0
      ? 'thinking'
      : 'normal';

  // Completion calculation
  const quotientStr = steps.map((s) => s.quotientDigit).join('');
  const remainderVal = steps.length > 0 ? steps[steps.length - 1].value : 0;
  const isPerfectGame = mistakesThisProblem === 0;

  const currentModeConfig = GAME_MODES[modeId] || GAME_MODES['2_div_1'];

  return (
    <div className="w-full min-h-screen py-6 px-3 sm:px-6 flex flex-col items-center justify-start font-['Zen_Maru_Gothic',sans-serif]">
      <div className="w-full max-w-xl">
        
        {/* Preview Control Toolbar for Developer / UI Inspector */}
        <PreviewToolbar
          isOpen={isPreviewOpen}
          onToggleOpen={() => setIsPreviewOpen(!isPreviewOpen)}
          onSetCustomProblem={handleSetCustomProblem}
          onStepForward={handleStepForward}
          onSolveAll={handleSolveAll}
          onResetStep={handleResetStep}
          currentProblem={problem}
          phase={phase}
          stepIdx={stepIdx}
          totalSteps={steps.length}
          onJumpPhase={handleJumpPhase}
        />

        {/* Top Header Bar */}
        <header className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-['Kosugi_Maru',sans-serif] text-xl sm:text-2xl font-bold text-[#33414E]">
            <span className="text-[#F0A63E]">✏️</span>
            <span>
              わり算の<ruby>筆算<rt>ひっさん</rt></ruby>練習
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 bg-white border-2 border-[#C3DEDC] hover:border-[#F0A63E] hover:bg-[#FBF7EC] rounded-full px-3 sm:px-3.5 py-1 font-bold text-sm sm:text-base text-[#33414E] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer group"
            title="クリックして これまで解いた問題の記録を見る"
            aria-label="解いた問題の記録を見る"
          >
            <Sparkles className="w-4 h-4 text-[#F0A63E] fill-[#F0A63E] group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-base">{starCount}</span>
            <span className="text-[11px] text-[#4A93BC] bg-[#6FB3D9]/15 border border-[#6FB3D9]/30 px-1.5 py-0.5 rounded-full font-bold ml-0.5 flex items-center gap-0.5">
              <span>記録</span>
            </span>
          </button>
        </header>

        {/* MENU SCREEN */}
        {screen === 'menu' && (
          <main className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(51,65,78,0.10)] p-6 sm:p-8 text-center border border-[#D8E9E4]">
            <div className="flex justify-center mb-2">
              <Mascot size={110} mood="happy" />
            </div>

            <h1 className="font-['Kosugi_Maru',sans-serif] text-xl sm:text-2xl font-bold text-[#33414E] mt-2 mb-2">
              えんぴつ先生と 練習しよう！
            </h1>
            <p className="text-[#5C6B78] text-sm sm:text-base leading-relaxed mb-6">
              1つずつ 順番に進めば、一人でも わり算の筆算ができるようになるよ。
              <br />
              どのコースで 練習する？
            </p>

            {/* Mode Select Sections */}
            <div className="flex flex-col gap-6 max-w-md mx-auto text-left">
              
              {/* Section 1: 1けたで割る (基礎) */}
              <div>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6FB3D9]" />
                  <h2 className="text-sm font-bold text-[#4A93BC]">
                    📘 【基本】1けたの数で 割る
                  </h2>
                </div>

                <div className="flex flex-col gap-2.5">
                  {(['2_div_1', '3_div_1'] as GameModeId[]).map((mId) => {
                    const cfg = GAME_MODES[mId];
                    return (
                      <button
                        key={mId}
                        type="button"
                        onClick={() => handleStartGame(mId)}
                        className="flex items-center gap-3.5 text-left border-[2.5px] border-[#C3DEDC] hover:border-[#6FB3D9] bg-[#FBF7EC] hover:bg-white rounded-2xl p-3.5 cursor-pointer transition-all active:scale-[0.98] shadow-sm group"
                      >
                        <span
                          style={{ backgroundColor: cfg.color }}
                          className="shrink-0 w-12 h-12 rounded-xl text-white flex items-center justify-center text-sm font-black transition-colors"
                        >
                          {cfg.badge}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-base text-[#33414E] flex items-center justify-between">
                            <span>{cfg.name}</span>
                          </div>
                          <small className="block text-xs text-[#5C6B78] font-normal">
                            {cfg.sub}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: 2けたで割る (小4応用・重要) */}
              <div>
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4FAF7C]" />
                  <h2 className="text-sm font-bold text-[#3A8F62]">
                    📙 【小4・応用】2けたの数で 割る
                  </h2>
                </div>

                <div className="flex flex-col gap-2.5">
                  {(['2_div_2', '3_div_2', '4_div_2'] as GameModeId[]).map((mId) => {
                    const cfg = GAME_MODES[mId];
                    return (
                      <button
                        key={mId}
                        type="button"
                        onClick={() => handleStartGame(mId)}
                        className="flex items-center gap-3.5 text-left border-[2.5px] border-[#C3DEDC] hover:border-[#4FAF7C] bg-[#FBF7EC] hover:bg-white rounded-2xl p-3.5 cursor-pointer transition-all active:scale-[0.98] shadow-sm group"
                      >
                        <span
                          style={{ backgroundColor: cfg.color }}
                          className="shrink-0 w-12 h-12 rounded-xl text-white flex items-center justify-center text-sm font-black transition-colors"
                        >
                          {cfg.badge}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-base text-[#33414E] flex items-center justify-between">
                            <span>{cfg.name}</span>
                            {mId === '3_div_2' && (
                              <span className="text-[11px] px-2 py-0.5 bg-[#4FAF7C] text-white rounded-full font-bold">
                                おすすめ！
                              </span>
                            )}
                          </div>
                          <small className="block text-xs text-[#5C6B78] font-normal">
                            {cfg.sub}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </main>
        )}

        {/* GAME & PRACTICE SCREEN */}
        {screen === 'game' && problem && (
          <main className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(51,65,78,0.10)] p-5 sm:p-6 border border-[#D8E9E4]">
            
            {/* Top Navigation in Game */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#5C6B78] font-bold mb-3">
              <button
                type="button"
                onClick={handleBackToMenu}
                className="text-[#4A93BC] hover:text-[#33414E] flex items-center gap-1 cursor-pointer transition-colors py-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>コース選択に戻る</span>
              </button>

              <div className="flex items-center gap-2">
                <span
                  style={{ color: currentModeConfig.color }}
                  className="px-2.5 py-0.5 bg-[#FBF7EC] border border-[#D8E9E4] rounded-md font-bold"
                >
                  {currentModeConfig.name}
                </span>
                <span className="px-2.5 py-0.5 bg-[#FBF7EC] border border-[#D8E9E4] rounded-md text-[#33414E]">
                  問題 {problemCount}
                </span>
              </div>
            </div>

            {/* Guide & Speech Bubble */}
            <div className="flex items-start gap-3 mb-4">
              <Mascot size={58} mood={mascotMood} />
              
              <div className="relative flex-1 bg-[#FFF9EE] border-2 border-[#F0A63E] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed text-[#33414E] shadow-sm min-h-[56px]">
                {/* Bubble triangle indicator */}
                <div className="absolute -left-2 top-4 w-0 h-0 border-y-[7px] border-y-transparent border-r-[8px] border-r-[#F0A63E]" />
                <div className="absolute -left-[6px] top-4 w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-[#FFF9EE]" />

                <div>{getGuideMessage()}</div>

                {bubbleHint && (
                  <div className="mt-2 text-[#D9614A] font-bold text-xs sm:text-sm animate-pop">
                    ⚠️ {bubbleHint}
                  </div>
                )}
              </div>
            </div>

            {/* Hissan Board (The calculation area) */}
            <HissanBoard
              dividendDigits={problem.dividendDigits}
              divisor={problem.divisor}
              steps={steps}
              stepIdx={stepIdx}
              phase={phase}
              inputSlots={inputSlots}
              activeSlotIdx={activeSlotIdx}
              flashState={flashState}
              targetSpan={targetSpan}
              onSelectSlot={handleSelectSlot}
            />

            {/* Tap slot guidance for multi-digit steps */}
            {targetWidth > 1 && phase !== 'D' && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#4A93BC] mt-1 mb-2 bg-[#6FB3D9]/15 border border-[#6FB3D9]/30 rounded-full py-1 px-3.5 w-fit mx-auto font-bold animate-fade-in">
                <span>👆</span>
                <span>マスをタッチして、大きい位・小さい位 どちらからでも入力できるよ！</span>
              </div>
            )}

            {/* Keypad & Action controls */}
            <div className="mt-2">
              <Numpad
                phase={phase}
                bringDownDigit={currentStep?.bringDownDigit || null}
                onPressDigit={handlePressDigit}
                onClear={handleClear}
                onSubmit={handleSubmitAnswer}
                onBringDown={handleBringDown}
              />
            </div>
          </main>
        )}

        {/* COMPLETION SCREEN */}
        {screen === 'complete' && problem && (
          <main className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(51,65,78,0.10)] p-6 sm:p-8 text-center border border-[#D8E9E4] animate-pop">
            <div className="flex justify-center mb-2">
              <Mascot size={100} mood="cheer" />
            </div>

            <div className="text-4xl my-2">
              {isPerfectGame ? '🏅' : '⭐'}
            </div>

            <div className="font-['Zen_Maru_Gothic',sans-serif] text-2xl sm:text-3xl font-black text-[#33414E] my-2">
              {remainderVal > 0 ? (
                <>
                  {problem.dividendStr} ÷ {problem.divisor} = {quotientStr}{' '}
                  <span className="text-[#EE7A63] text-xl sm:text-2xl">あまり {remainderVal}</span>
                </>
              ) : (
                <>
                  {problem.dividendStr} ÷ {problem.divisor} = {quotientStr}
                </>
              )}
            </div>

            <p className="text-[#5C6B78] text-sm sm:text-base font-bold my-3">
              {isPerfectGame
                ? 'ノーミスで 正解！すばらしい！✨'
                : 'よくがんばったね！正解できたよ！👏'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleNextProblem}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#F0A63E] hover:bg-[#D98A20] text-white font-bold text-base rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
              >
                次の問題へ →
              </button>

              <button
                type="button"
                onClick={handleBackToMenu}
                className="w-full sm:w-auto px-5 py-3.5 bg-[#FBF7EC] hover:bg-white border-2 border-[#C3DEDC] text-[#33414E] font-bold text-sm rounded-xl cursor-pointer transition-all"
              >
                メニューに戻る
              </button>
            </div>
          </main>
        )}

        {/* Solved Problems History Modal */}
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          starCount={starCount}
          onRetryProblem={handleRetryProblem}
          onClearHistory={handleClearHistory}
        />

      </div>
    </div>
  );
}

