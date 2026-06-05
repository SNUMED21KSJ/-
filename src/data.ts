/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MealOption } from './types';

export const MEAL_OPTIONS: MealOption[] = [
  {
    id: 'rice',
    name: '흰쌀밥 + 반찬',
    emoji: '🍚',
    description: '대표적인 한국식 탄수화물 식사입니다. 정제된 탄수화물이 많이 포함되어 있어 식후 혈당이 뚜렷하게 상승할 수 있습니다.',
    glycemicIndex: 'high',
  },
  {
    id: 'bread',
    name: '빵 + 우유',
    emoji: '🍞',
    description: '정제 밀가루와 단순당이 풍부합니다. 매우 빠르게 소화가 진행되어 혈당상승 속도가 상당히 빠른 편입니다.',
    glycemicIndex: 'high',
  },
  {
    id: 'ramen',
    name: '라면',
    emoji: '🍜',
    description: '고탄수화물 면류에 짠 국물과 지방이 결합되어 있습니다. 혈당이 높이 오르고 오랫동안 높게 유지될 수 있습니다.',
    glycemicIndex: 'high',
  },
  {
    id: 'salad',
    name: '닭가슴살 샐러드',
    emoji: '🥗',
    description: '식이섬유와 풍부한 단백질, 좋은 지방이 먼저 흡수되면서 당질의 흡수 속도를 지연시켜 혈당이 안정적으로 유지됩니다.',
    glycemicIndex: 'low',
  },
  {
    id: 'fruit',
    name: '제철 과일',
    emoji: '🍎',
    description: '단순 과당이 들어 있어 식후 초기 상승 속도는 다소 빠를 수 있으나, 풍부한 수분과 일부 섬유질 덕분에 안정적입니다.',
    glycemicIndex: 'medium',
  },
  {
    id: 'custom',
    name: '직접 입력',
    emoji: '🍽️',
    description: '내가 원하는 음식(예: 떡볶이, 도넛, 현미밥 등)의 혈당 시뮬레이션을 체험합니다.',
    glycemicIndex: 'medium',
  },
];

export const QUESTIONNAIRE_STEPS = [
  {
    key: 'sleep',
    title: '하루 평균 수면 시간은 얼마나 되나요?',
    description: '충분한 수면은 인슐린 감수성을 향상시켜 혈당을 조절하는 데 필수적입니다.',
    options: [
      { value: 'short', label: '5시간 미만 (부족)', id: 'q-sleep-short' },
      { value: 'normal', label: '5 ~ 7시간 (보통)', id: 'q-sleep-normal' },
      { value: 'long', label: '7시간 초과 (풍부)', id: 'q-sleep-long' },
    ],
  },
  {
    key: 'stress',
    title: '일상 속에서의 스트레스 체감 수준은 어떤가요?',
    description: '스트레스를 받으면 코르티솔 호르몬이 분비되어 포도당의 세포 흡수를 막아 혈당이 상승합니다.',
    options: [
      { value: 'very_low', label: '매우 편안함 (매우 낮음)', id: 'q-stress-vlow' },
      { value: 'low', label: '편안함 (낮음)', id: 'q-stress-low' },
      { value: 'moderate', label: '적당함 (보통)', id: 'q-stress-mod' },
      { value: 'high', label: '높음 (지속적인 긴장)', id: 'q-stress-high' },
      { value: 'very_high', label: '매우 높음 (극심한 긴장)', id: 'q-stress-vhigh' },
    ],
  },
  {
    key: 'lateSnack',
    title: '야식을 섭취하는 빈도는 어떻게 되나요?',
    description: '늦은 시간의 자극적인 간식은 밤 동안 췌장을 쉬지 못하게 해 지속해서 공복 혈당을 올려 놓습니다.',
    options: [
      { value: 'none', label: '거의 없음 (안정적)', id: 'q-snack-none' },
      { value: 'few', label: '주 1 ~ 2회 (가끔)', id: 'q-snack-few' },
      { value: 'frequent', label: '주 3회 이상 (자주)', id: 'q-snack-freq' },
    ],
  },
  {
    key: 'exercise',
    title: '규칙적인 신체 활동이나 운동 주기 정보는 무엇인가요?',
    description: '꾸준한 운동은 인슐린 수용체를 자극하여 별도의 인슐린 분비 없이도 세포가 포도당을 소모하도록 돕습니다.',
    options: [
      { value: 'none', label: '거의 하지 않음 (운동 부족)', id: 'q-ex-none' },
      { value: 'few', label: '주 1 ~ 2회 (가벼운 관리)', id: 'q-ex-few' },
      { value: 'frequent', label: '주 3회 이상 (체계적 운동)', id: 'q-ex-freq' },
    ],
  },
  {
    key: 'speed',
    title: '식사를 완료하는 속도는 평소 어떠한가요?',
    description: '식사를 빨리하면 뇌가 늘어난 혈당을 알아차리기 전에 포만감을 넘겨 인슐린이 폭발적으로 나와 스파이크가 올 확률이 매우 커집니다.',
    options: [
      { value: 'slow', label: '20분 이상 (천천히 섭취)', id: 'q-speed-slow' },
      { value: 'normal', label: '10 ~ 20분 사이 (보통)', id: 'q-speed-normal' },
      { value: 'fast', label: '10분 미만 (매우 급하게)', id: 'q-speed-fast' },
    ],
  },
  {
    key: 'breakfast',
    title: '아침 식사를 평소 규칙적으로 섭취하시나요?',
    description: '아침 식사를 거르면 점심 식사 시 과식하기 쉬워지고, 공복 시간이 길어져 혈당 반응이 더 격렬해지는 세컨드 밀 효과가 생깁니다.',
    options: [
      { value: 'eat', label: '예, 대부분 규칙적으로 먹음', id: 'q-bf-eat' },
      { value: 'sometimes', label: '아니오, 종종 또는 격일로 거름', id: 'q-bf-sometimes' },
      { value: 'skip', label: '거의 먹지 않고 거르는 편임', id: 'q-bf-skip' },
    ],
  },
];
