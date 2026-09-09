import { GameModeConfig, GameModeId, HissanStep, Problem } from '../types';

export const GAME_MODES: Record<GameModeId, GameModeConfig> = {
  '2_div_1': {
    id: '2_div_1',
    name: '2けた ÷ 1けた',
    sub: 'まずは基本のわり算から',
    badge: '2÷1',
    color: '#6FB3D9',
    dividendDigits: 2,
    divisorDigits: 1,
  },
  '3_div_1': {
    id: '3_div_1',
    name: '3けた ÷ 1けた',
    sub: 'けたが増えても基本は同じ！',
    badge: '3÷1',
    color: '#F0A63E',
    dividendDigits: 3,
    divisorDigits: 1,
  },
  '2_div_2': {
    id: '2_div_2',
    name: '2けた ÷ 2けた',
    sub: '2けたで割る入門レベル',
    badge: '2÷2',
    color: '#9B51E0',
    dividendDigits: 2,
    divisorDigits: 2,
  },
  '3_div_2': {
    id: '3_div_2',
    name: '3けた ÷ 2けた',
    sub: '小4の最重要・定番ステップ！',
    badge: '3÷2',
    color: '#4FAF7C',
    dividendDigits: 3,
    divisorDigits: 2,
  },
  '4_div_2': {
    id: '4_div_2',
    name: '4けた ÷ 2けた',
    sub: '筆算マスターに挑戦！',
    badge: '4÷2',
    color: '#EE7A63',
    dividendDigits: 4,
    divisorDigits: 2,
  },
};

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(modeId: GameModeId | number): Problem {
  let dividend = 0;
  let divisor = 0;

  // Backward compatibility if number passed
  if (typeof modeId === 'number') {
    if (modeId === 2) modeId = '2_div_1';
    else if (modeId === 3) modeId = '3_div_1';
    else if (modeId === 4) modeId = '4_div_2';
    else modeId = '2_div_1';
  }

  if (modeId === '2_div_1') {
    dividend = randInt(14, 99);
    divisor = randInt(2, 9);
  } else if (modeId === '3_div_1') {
    dividend = randInt(100, 999);
    divisor = randInt(2, 9);
  } else if (modeId === '2_div_2') {
    divisor = randInt(11, 45);
    const minQ = 1;
    const maxQ = Math.floor(99 / divisor);
    const quotient = randInt(minQ, Math.max(minQ, maxQ));
    const remainder = randInt(0, divisor - 1);
    dividend = Math.min(99, Math.max(divisor, quotient * divisor + remainder));
  } else if (modeId === '3_div_2') {
    divisor = randInt(12, 89);
    dividend = randInt(100, 999);
    if (dividend < divisor) {
      dividend = randInt(divisor, 999);
    }
  } else if (modeId === '4_div_2') {
    divisor = randInt(12, 98);
    dividend = randInt(1000, 9999);
  } else {
    dividend = randInt(10, 99);
    divisor = randInt(2, 9);
  }

  const dividendStr = String(dividend);
  return {
    dividend,
    divisor,
    dividendStr,
    dividendDigits: dividendStr.split(''),
  };
}


export function createProblemFromCustom(dividend: number, divisor: number): Problem {
  const dividendStr = String(Math.max(1, dividend));
  const validDivisor = Math.max(1, divisor);
  return {
    dividend: parseInt(dividendStr, 10),
    divisor: validDivisor,
    dividendStr,
    dividendDigits: dividendStr.split(''),
  };
}

export function planSteps(digitsArr: string[], div: number): HissanStep[] {
  const n = digitsArr.length;
  if (n === 0 || div <= 0) return [];

  // Determine starting prefix length
  let prefixLen = 1;
  while (parseInt(digitsArr.slice(0, prefixLen).join(''), 10) < div && prefixLen < n) {
    prefixLen++;
  }

  let col = prefixLen;
  let currentValue = parseInt(digitsArr.slice(0, prefixLen).join(''), 10);
  const out: HissanStep[] = [];

  while (true) {
    const q = Math.floor(currentValue / div);
    const product = q * div;
    const value = currentValue - product;
    const hasNext = col < n;
    const productStr = String(product);
    const productSpan: [number, number] = [col - productStr.length + 1, col];
    const valueStr = String(value);
    const valueSpanAlone: [number, number] = [col - valueStr.length + 1, col];

    let bringDownDigit: string | null = null;
    let combinedValue: number | null = null;
    let combinedSpan: [number, number] | null = null;

    if (hasNext) {
      bringDownDigit = digitsArr[col];
      combinedValue = value * 10 + parseInt(bringDownDigit, 10);
      const cs = String(combinedValue);
      combinedSpan = [(col + 1) - cs.length + 1, col + 1];
    }

    out.push({
      quotientDigit: q,
      quotientCol: col,
      currentValue,
      product,
      productSpan,
      value,
      valueSpanAlone,
      hasNext,
      bringDownDigit,
      combinedValue,
      combinedSpan,
      qRevealed: false,
      productRevealed: false,
      valueRevealed: false,
      broughtDown: false,
    });

    if (!hasNext) break;
    currentValue = combinedValue!;
    col += 1;
  }

  return out;
}
