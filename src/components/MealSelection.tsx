/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MealOption } from '../types';
import { MEAL_OPTIONS } from '../data';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';

interface MealSelectionProps {
  onNext: (meal: MealOption, customMealName?: string) => void;
  onBack: () => void;
}

export default function MealSelection({ onNext, onBack }: MealSelectionProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [customMealName, setCustomMealName] = useState<string>('');
  const [customError, setCustomError] = useState<string | null>(null);

  const handleSelectMeal = (meal: MealOption) => {
    setSelectedMeal(meal);
    if (meal.id !== 'custom') {
      setCustomMealName('');
      setCustomError(null);
    }
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMealName(val);
    if (val.trim() === '') {
      setCustomError('드신 음식을 직접 한글 또는 영어로 입력해 주세요.');
    } else {
      setCustomError(null);
    }
  };

  const handleSubmit = () => {
    if (!selectedMeal) return;

    if (selectedMeal.id === 'custom') {
      if (customMealName.trim() === '') {
        setCustomError('드신 음식명을 정확하게 입력해야 탐구 시뮬레이션 결과에 반영할 수 있습니다.');
        return;
      }
      onNext(selectedMeal, customMealName);
    } else {
      onNext(selectedMeal);
    }
  };

  const isFormValid = selectedMeal !== null && (selectedMeal.id !== 'custom' || customMealName.trim() !== '');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Navigation Headers */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          id="btn-meal-back"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer bg-slate-100/80 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
          이전으로
        </button>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          테스트용 선택 식사 등록
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">테스트 음식 선택</h2>
        <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          가상 혈당 수치 측정을 진행할 타겟 식사 메뉴를 결정합니다. 같은 영양 식단이라도 개인의 체내 특성에 따라 반응 속도가 확연하게 달라집니다.
        </p>
      </div>

      {/* Grid Layout of Meal Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {MEAL_OPTIONS.map((meal) => {
          const isSelected = selectedMeal?.id === meal.id;
          return (
            <div
              key={meal.id}
              id={`meal-card-${meal.id}`}
              onClick={() => handleSelectMeal(meal)}
              className={`border-2 rounded-3xl p-5 cursor-pointer transition-all flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-2xs select-none ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/20 ring-4 ring-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                {/* Upper row: Emoji and indicator badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl filter drop-shadow-xs" role="img" aria-label={meal.name}>
                    {meal.emoji}
                  </span>
                  
                  {meal.glycemicIndex === 'high' && (
                    <span className="text-[10px] font-bold tracking-tight bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md">
                      ⚠️ 단순 당질 비율 높음
                    </span>
                  )}
                  {meal.glycemicIndex === 'medium' && (
                    <span className="text-[10px] font-bold tracking-tight bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md">
                      ⚖️ 보통 흡수 속도
                    </span>
                  )}
                  {meal.glycemicIndex === 'low' && (
                    <span className="text-[10px] font-bold tracking-tight bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md">
                      🌱 고섬유질 완만 흡수
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-slate-800 mb-1.5">{meal.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{meal.description}</p>
              </div>

              {/* Selection Check Circle */}
              <div className="mt-5 flex justify-end">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-transparent'
                }`}>
                  <Check size={14} className="stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditionally reveal input form when "Custom Name" is chosen */}
      {selectedMeal?.id === 'custom' && (
        <div id="custom-meal-form" className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 mb-8 max-w-xl mx-auto animate-fade-in">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="text-indigo-600 shrink-0" size={16} />
            <label htmlFor="custom-meal-input" className="block text-sm font-bold text-slate-700">
              드신 외부 특별식 또는 간식을 구체적으로 남겨 주세요.
            </label>
          </div>
          <input
            autoFocus
            id="custom-meal-input"
            type="text"
            placeholder="예: 마라탕 + 버블티, 초코 당근 케이크"
            value={customMealName}
            onChange={handleCustomNameChange}
            className={`w-full font-semibold bg-white border-2 rounded-xl py-4 px-4 focus:outline-hidden focus:border-indigo-600 transition-all ${
              customError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200'
            }`}
          />
          {customError && (
            <p className="text-xs text-rose-500 font-semibold mt-2">{customError}</p>
          )}
        </div>
      )}

      {/* Submit controls */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          id="btn-meal-submit"
          disabled={!isFormValid}
          className={`w-full sm:w-auto min-w-[320px] font-bold text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            isFormValid
              ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          식사 정보 잠금 및 측정 시작
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
