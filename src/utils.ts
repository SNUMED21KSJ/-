/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GlucoseData, GlucoseType, LifestyleAnswers } from './types';

/**
 * Classifies the glucose response curves based on user input.
 * 
 * Rules:
 * - 급상승형 (Spike): glucose rises by 50 mg/dL or more within 30 minutes
 * - 지연상승형 (Delayed): peak occurs at 45 or 60 minutes
 * - 회복지연형 (Slow Recovery): 60-minute glucose remains within 10 mg/dL of peak or remains high
 * - 안정형 (Stable): total rise is less than 30 mg/dL and values remain relatively stable (< 140 mg/dL)
 * - 완만상승형 (Gradual): moderate rise without sharp spike (between 30 and 49 mg/dL)
 */
export function classifyGlucoseResponse(fasting: number, data: GlucoseData): GlucoseType {
  // Highest post-meal value
  const postMealValues = [data.min30, data.min60];
  const peakValue = Math.max(...postMealValues);
  
  // Find peak time
  let peakTime = 30;
  if (data.min60 === peakValue) peakTime = 60;

  const maxRise = peakValue - fasting;
  const riseAt30 = data.min30 - fasting;

  // 1. 안정형: Total rise is less than 30 and peak is reasonably safe (always < 140, or just very flat)
  if (maxRise < 30 && peakValue < 145) {
    return 'stable';
  }

  // 2. 급상승형: rises by 50 or more within 30 minutes
  if (riseAt30 >= 50) {
    return 'spike';
  }

  // 3. 회복지연형: 60-minute glucose remains within 10 of peak, or remains high (e.g. 60-min glucose is still high)
  if (peakValue - data.min60 <= 10 && maxRise >= 20 && data.min60 >= 130) {
    return 'slow_recovery';
  }

  // 4. 지연상승형: peak occurs at 60 minutes
  if (peakTime === 60 && maxRise >= 25) {
    return 'delayed';
  }

  // 5. 완만상승형: moderate rise overall
  return 'gradual';
}

export interface TypeDetail {
  title: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  emoji: string;
  description: string;
  impacts: string[];
  mechanisms: string[];
}

export const GLUCOSE_TYPE_DETAILS: Record<GlucoseType, TypeDetail> = {
  stable: {
    title: '안정형 (Stable Style)',
    emoji: '🟢',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50/70',
    description: '식후 혈당의 오르내림이 대단히 완만하고 안정적인 이상적인 상태입니다. 인슐린 분비량과 세포의 민감도가 아주 균형 잡혀 있습니다.',
    impacts: [
      '혈관 피로도가 최소화되어 피로감이나 졸음이 찾아오지 않습니다.',
      '지방 합성 신호가 적어 이상적인 체지방 비율을 유지하기 쉽습니다.',
      '지속적인 집중력과 풍부한 아점 활동 에너지를 유지할 수 있습니다.'
    ],
    mechanisms: [
      '바람직한 수면 습관과 철저한 야식 삼가로 정상적인 대사 능력이 유지 중입니다.',
      '식사 속도를 충분히 늦춰 과식을 미연에 차단하고 영양 공급 속도를 늘렸습니다.',
      '근섬유 내 글리코겐 수치가 적절해 당분을 빠르고 효율적으로 흡수합니다.'
    ]
  },
  spike: {
    title: '급상승형 (Glucose Spike)',
    emoji: '⚡',
    badgeColor: 'bg-red-100 text-red-800',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50/70',
    description: '식사를 시작하자마자 15분~30분 내로 혈당이 폭발적으로 급상승하여 ‘혈당 스파이크’가 감지되었습니다. 췌장이 과로하는 주요 원인입니다.',
    impacts: [
      '일시적인 쾌감 후, 갑작스러운 저혈당 쇼크로 ‘식곤증’과 강한 ‘당 갈망’이 옵니다.',
      '과잉 분비된 인슐린이 남은 당을 곧바로 ‘체지방’으로 축적하여 세포 비만을 늘립니다.',
      '체내 활성산소가 급증하여 전신 혈관 벽에 가벼운 스크래치와 염증을 냅니다.'
    ],
    mechanisms: [
      '단백질이나 채소 없이 정제 탄수화물(빵, 밀가루, 백미) 위주로 빠르게 식수하였습니다.',
      '지나친 수면 긴장 또는 과도한 만성 스트레스로 인해 혈관 조절 호르몬이 이미 교란되어 있습니다.',
      '식후 제자리걸음 등 대퇴근 운동 부재로 신속한 에너지 흡수가 정체되었습니다.'
    ]
  },
  delayed: {
    title: '지연상승형 (Delayed Rise)',
    emoji: '⏳',
    badgeColor: 'bg-amber-100 text-amber-800',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50/70',
    description: '식후 45분 이후나 1시간이 될 때까지 혈당이 계속 천천히 올라가 뒤늦게 정점에 다다르는 형태입니다. 위장의 음식 배출 시간이 지연되었거나 점심 건너뛰기 등의 결과일 수 있습니다.',
    impacts: [
      '식후 수 시간이 지난 오후 늦게 머리가 유독 멍하고 피로를 느낍니다.',
      '소화 능력이 다방면으로 무거워져 수축 팽창에 부담을 느낍니다.',
      '혈액이 오래 당에 절여져 전신의 신경 말단까지 가벼운 손상을 받습니다.'
    ],
    mechanisms: [
      '기름지고 나트륨이 과다한 가공 정제식품(라면, 튀김류) 위주로 드셨습니다.',
      '수면이 교란되거나 불규칙한 생활 주기가 췌장의 주기성 순환 타이밍을 흐립니다.',
      '아침 식사를 거르고 대폭 오랜 단식을 가졌을 때 흔히 발생합니다.'
    ]
  },
  gradual: {
    title: '완만상승형 (Moderate)',
    emoji: '🔵',
    badgeColor: 'bg-blue-100 text-blue-800',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/70',
    description: '부담스럽지 않은 정상적인 범위(30~49 mg/dL 내외)로 안락하게 소폭 올랐다가, 식후 1시간 내로 다시 자연스럽게 아래 방향으로 꺾이는 건강한 생체 소화 반응입니다.',
    impacts: [
      '일상 업무와 공부에 영향을 주는 심한 기분 스윙이나 졸음 현상이 최소화됩니다.',
      '자연스러운 신진대사가 돌기 때문에 인슐린 시스템이 알맞게 안정을 회복합니다.',
      '급체나 속쓰림 없이 편안한 위장 활동이 가능합니다.'
    ],
    mechanisms: [
      '과하지 않은 건강한 식단 조율 혹은 평범하지만 적절하게 천천히 꼭꼭 씹는 습관입니다.',
      '스트레스 수치가 안정적이어서 아드레날린 폭주에 의한 기동 상승을 방어했습니다.',
      '약간 수면이 부족하더라도 평소의 건강 수용 능력이 작용한 결과입니다.'
    ]
  },
  slow_recovery: {
    title: '회복지연형 (Delayed Recovery)',
    emoji: '🧱',
    badgeColor: 'bg-purple-100 text-purple-800',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50/70',
    description: '혈당이 일정 수준 위로 치솟은 후, 1시간이 지나도 다시 떨어지지 않고 계속 높은 정점 근처에 머무는 상황입니다. 세포의 인슐린 저항성이 높아졌을 가능성을 강력히 암시합니다.',
    impacts: [
      '신장에 여과 과부하가 걸리며 목이 자주 타고 소변량이 많이 지게 됩니다.',
      '온몸이 만성적으로 무거우며, 피가 찐득한 상태가 고착화되어 피로 악순환에 빠집니다.',
      '수면 중에도 과도한 내장 지방 합성 신호가 떨어져 개운함 유도가 불가능합니다.'
    ],
    mechanisms: [
      '잦은 주간 야식 및 잦은 자극적인 음식 섭취로 세포의 당 수용체가 지쳐 무반응 상태입니다.',
      '극도로 잠이 적어(5시간 미만) 성장 호르몬 복구율이 급감하고 활성 축적이 방해받았습니다.',
      '낮은 심폐 대사 운동량으로 인해 주 근육층 포도당 소비 기능이 꺼졌습니다.'
    ]
  }
};

/**
 * Generates clinical-inspired suggestions based on questionnaire and results
 */
export function generateSuggestions(answers: LifestyleAnswers, glucoseType: GlucoseType) {
  const suggestions: Array<{
    title: string;
    description: string;
    icon: string;
    color: string;
  }> = [];

  if (answers.sleep === 'short') {
    suggestions.push({
      title: '🔋 수면 시간은 무조건 6~7시간 확보!',
      description: '부족한 수면(5시간 이하)은 인슐린을 방해하는 코르티솔 호르몬 분비를 다음 날 약 30% 증가시켜 전반적인 대사 능력을 망쳐 놓습니다.',
      icon: '🛌',
      color: 'border-blue-200 bg-blue-50/50 text-blue-900',
    });
  }

  if (answers.stress === 'high' || answers.stress === 'very_high') {
    suggestions.push({
      title: '🧘 급하지 않게, 마인드풀 긴장 이완',
      description: '스트레스 지수가 높은 상태에서 먹으면 혈관이 수축해 같은 탄수화물이라도 스파이크 폭이 더 넓어집니다. 식사 전 가벼운 복식 심호흡 5회를 추천합니다.',
      icon: '🍃',
      color: 'border-teal-200 bg-teal-50/50 text-teal-900',
    });
  }

  if (answers.speed === 'fast') {
    suggestions.push({
      title: '⏱️ 야채부터 꼭꼭! 식사 시간 15분 보장',
      description: '10분 안에 급하게 삼키면 소화 기관이 포만감 신호를 올리기도 전에 당이 몰려들어 스파이크 우려가 최대가 됩니다. 야채 - 단백질 - 탄수화물 순으로 느리게 식사하십시오.',
      icon: '🥗',
      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
    });
  }

  if (answers.lateSnack === 'frequent') {
    suggestions.push({
      title: '🚫 밤 9시 이후 일체 주방 오프(OFF)',
      description: '잦은 주간/야간 야식은 밤 사이 췌장 세포를 지치게 하며 아침 공복 혈당 자체를 상승시키는 지름길입니다. 야식을 참는 것만으로도 인슐린 효율이 2배 좋아집니다.',
      icon: '⏰',
      color: 'border-red-200 bg-red-50/50 text-red-900',
    });
  }

  if (answers.exercise === 'none') {
    suggestions.push({
      title: '🚶 식후 15분 가벼운 동네 산책',
      description: '식후 가만히 앉아 있거나 누우면 흡수된 혈전 당이 전신을 돕니다. 식사 후 15분 뒤 가볍게 서서 걸으면 근육이 혈당을 즉각 흡수하여 스파이크가 올 확률을 절대적으로 막아 줍니다.',
      icon: '👟',
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
    });
  }

  // Fallback or addition suggestion based on results
  if (glucoseType === 'spike') {
    suggestions.push({
      title: '🧬 음식에 ‘식이섬유 단백질 범퍼’ 두르기',
      description: '밀가루나 밥물을 들이키기 전에, 오이나 삶은 계란 또는 샐러드를 먼저 몇 입 꼭꼭 씹어 먹으면 위 내벽에 그물이 생겨 혈당 최고점 폭이 즉시 가라앉습니다.',
      icon: '🛡️',
      color: 'border-pink-200 bg-pink-50/50 text-pink-900',
    });
  } else if (glucoseType === 'slow_recovery') {
    suggestions.push({
      title: '💪 허벅지와 엉덩이 대근육 스쿼트 10회',
      description: '세포가 문을 안 열 때(회복 지연), 인간 몸에서 가장 큰 허벅지 근육을 사용하면 세포 소기관에서 인슐린의 승인 없이 당을 강제로 빨아들여 회복 시간을 크게 앞당깁니다.',
      icon: '🦵',
      color: 'border-purple-200 bg-purple-50/50 text-purple-900',
    });
  }

  // Ensure we always have at least 3 great cards
  if (suggestions.length < 3) {
    suggestions.push({
      title: '💧 수시로 미온수 들이켜 혈류 개선 ',
      description: '혈중 포도당 농도가 높은 식사 후에는 충분히 따뜻한 물을 보충해 주시는 것만으로도 소변 배출과 체액 순식을 유도해 혈액 점도를 빠르게 복구할 수 있습니다.',
      icon: '💧',
      color: 'border-sky-200 bg-sky-50/50 text-sky-950',
    });
  }

  return suggestions.slice(0, 4);
}

/**
 * Preset data helper to allow classroom simulation filled on request
 */
export const SIMULATION_PRESETS: Record<string, {name: string; fasting: number; data: GlucoseData; responseType: GlucoseType}> = {
  spike_example: {
    name: '급상승형 (스파이크 체험)',
    fasting: 90,
    data: { fasting: 90, min30: 165, min60: 105 },
    responseType: 'spike',
  },
  stable_example: {
    name: '안정형 (인슐린 황금 비율)',
    fasting: 85,
    data: { fasting: 85, min30: 105, min60: 92 },
    responseType: 'stable',
  },
  recovery_example: {
    name: '회복지연형 (저항성 체감)',
    fasting: 110,
    data: { fasting: 110, min30: 178, min60: 169 },
    responseType: 'slow_recovery',
  },
  delayed_example: {
    name: '지연상승형 (야식/과체중 시뮬레이션)',
    fasting: 95,
    data: { fasting: 95, min30: 125, min60: 160 },
    responseType: 'delayed',
  },
  gradual_example: {
    name: '완만상승형 (일반인 평균)',
    fasting: 88,
    data: { fasting: 88, min30: 124, min60: 98 },
    responseType: 'gradual',
  }
};
