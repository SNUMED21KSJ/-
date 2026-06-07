/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LifestyleAnswers {
  sleep: 'short' | 'normal' | 'long';      // 5시간 미만, 5~7시간, 7시간 초과
  stress: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high'; // 매우 낮음, 낮음, 보통, 높음, 매우 높음
  lateSnack: 'none' | 'few' | 'frequent';   // 거의 없음, 주 1-2회, 주 3회 이상
  exercise: 'none' | 'few' | 'frequent';    // 거의 없음, 주 1-2회, 주 3회 이상
  speed: 'slow' | 'normal' | 'fast';        // 느림, 보통, 빠름
  breakfast: 'eat' | 'sometimes' | 'skip';  // 거의 먹음, 가끔 거름, 자주 거름
}

export interface MealOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  glycemicIndex: 'high' | 'medium' | 'low';
}

export interface GlucoseData {
  fasting: number;
  min30: number;
  min60: number;
}

export type GlucoseType = 
  | 'stable'       // 안정형
  | 'spike'        // 급상승형
  | 'delayed'      // 지연상승형
  | 'gradual'      // 완만상승형
  | 'slow_recovery' // 회복지연형
  | 'reversed';    // 역반응형

export interface SimulationResult {
  id: string;
  userName: string;
  date: string;
  answers: LifestyleAnswers;
  fasting: number;
  meal: MealOption;
  customMealName?: string;
  glucose: GlucoseData;
  glucoseType: GlucoseType;
  timestamp: number;
}

export interface UserHistoryItem {
  id: string;
  name: string;
  meal: string;
  glucoseType: GlucoseType;
  date: string;
  maxRise: number;
}
