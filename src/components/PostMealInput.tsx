/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GlucoseData, MealOption } from '../types';
import { SIMULATION_PRESETS } from '../utils';
import { ArrowLeft, ArrowRight, ChevronDown, Check, Info } from 'lucide-react';

interface PostMealInputProps {
  fasting: number;
  meal: MealOption;
  customMealName?: string;
  onNext: (data: GlucoseData) => void;
  onBack: () => void;
}

export default function PostMealInput({ fasting, meal, customMealName, onNext, onBack }: PostMealInputProps) {
  const [min30, setMin30] = useState<string>('');
  const [min60, setMin60] = useState<string>('');

  const [errors, setErrors] = useState<{
    min30?: string;
    min60?: string;
  }>({});

  const [showPresets, setShowPresets] = useState(false);

  // Validate a single field's entry
  const validateField = (name: 'min30' | 'min60', value: string): string | undefined => {
    if (value === '') {
      return '값을 입력해 주세요.';
    }
    const num = Number(value);
    if (isNaN(num)) {
      return '올바른 숫자를 입력해 주세요.';
    }
    if (num < 50 || num > 400) {
      return '💡 측정 범위 오류 (유효 수치: 50 ~ 400 mg/dL)';
    }
    return undefined;
  };

  const handleFieldChange = (name: 'min30' | 'min60', value: string) => {
    if (name === 'min30') setMin30(value);
    else if (name === 'min60') setMin60(value);

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Preset loader
  const handleLoadPreset = (key: string) => {
    const preset = SIMULATION_PRESETS[key];
    if (preset) {
      setMin30(preset.data.min30.toString());
      setMin60(preset.data.min60.toString());
      setErrors({});
      setShowPresets(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errs = {
      min30: validateField('min30', min30),
      min60: validateField('min60', min60),
    };

    setErrors(errs);

    const hasErrors = Object.values(errs).some((error) => error !== undefined);
    if (hasErrors) return;

    onNext({
      fasting,
      min30: Number(min30),
      min60: Number(min60),
    });
  };

  const isFormValid =
    min30 !== '' &&
    min60 !== '' &&
    !errors.min30 &&
    !errors.min60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 scroll-py-4">
      {/* Navigation Headers */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          id="btn-postmeal-back"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer bg-slate-100/80 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
          이전으로
        </button>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          식후 시간대별 혈당 측정 기록
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">식후 혈당 변화 입력</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
          선택한 음식인 <span className="text-blue-600 font-extrabold">{customMealName || meal.name} {meal.emoji}</span> 섭취 후 혈당을 기록합니다.
          0분, 30분, 60분 기록을 모두 완료해야 맞춤 대사 유형 분석 및 생활 처방이 제공됩니다.
        </p>

        {/* Current Reference Card */}
        <div className="inline-flex items-center gap-2 mt-3.5 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-sm text-slate-700">
          <span>0분 혈당 (공복 기본값):</span>
          <span className="font-extrabold text-blue-600">{fasting} mg/dL</span>
        </div>
      </div>

      {/* CLASSROOM HELPER / PRESET PICKER */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4.5 mb-8 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          id="btn-toggle-presets"
          className="w-full flex items-center justify-between font-bold text-sm text-amber-900 cursor-pointer focus:outline-hidden"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-100 rounded text-amber-700 font-bold">🔬</span>
            <span className="text-left font-semibold">수업 관찰용 가상 대사 유형 프리셋 고속 로드하기</span>
          </div>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${showPresets ? 'rotate-180' : ''}`}
          />
        </button>

        {showPresets && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-amber-200/60 pt-3 animate-fade-in text-xs">
            {Object.entries(SIMULATION_PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleLoadPreset(key)}
                id={`preset-btn-${key}`}
                className="bg-white hover:bg-amber-100/50 border border-slate-200 text-slate-700 font-bold p-3 rounded-xl text-left flex items-center justify-between cursor-pointer transition-all"
              >
                <div>
                  <div className="font-extrabold text-slate-900 text-xs">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    0분(공복): {item.fasting} ➔ 30분: {item.data.min30} ➔ 60분: {item.data.min60}
                  </div>
                </div>
                <Check size={14} className="text-amber-600" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Numeric Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          
          {/* Item 1: 30min */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">INTERVAL 1</span>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 line-height-1 py-1 rounded-md">식후 30분 혈당</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
                탄수화물이 본격적으로 소화 흡수되며 혈당 정점에 도달하는 골든 관측 시점입니다.
              </p>
            </div>
            <div>
              <div className="relative">
                <input
                  id="input-postmeal-30"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="예: 140"
                  value={min30}
                  onChange={(e) => handleFieldChange('min30', e.target.value)}
                  className={`w-full text-center font-bold text-2xl bg-slate-50 border-2 rounded-xl py-4 px-3 focus:bg-white focus:outline-hidden focus:border-blue-600 transition-all ${
                    errors.min30 ? 'border-rose-400 bg-rose-50/25' : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">mg/dL</span>
              </div>
              {errors.min30 && <p className="text-xs text-rose-500 font-semibold mt-1.5">{errors.min30}</p>}
            </div>
          </div>

          {/* Item 2: 60min */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">INTERVAL 2</span>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 line-height-1 py-1 rounded-md">식후 60분 혈당</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
                분비된 인슐린이 혈중 당분을 세포로 밀어내어 안전한 하강 복귀를 시험하는 골든타임입니다.
              </p>
            </div>
            <div>
              <div className="relative">
                <input
                  id="input-postmeal-60"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="예: 115"
                  value={min60}
                  onChange={(e) => handleFieldChange('min60', e.target.value)}
                  className={`w-full text-center font-bold text-2xl bg-slate-50 border-2 rounded-xl py-4 px-3 focus:bg-white focus:outline-hidden focus:border-blue-600 transition-all ${
                    errors.min60 ? 'border-rose-400 bg-rose-50/25' : 'border-slate-200'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">mg/dL</span>
              </div>
              {errors.min60 && <p className="text-xs text-rose-500 font-semibold mt-1.5">{errors.min60}</p>}
            </div>
          </div>

        </div>

        {/* Informative advice */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-2 max-w-2xl mx-auto">
          <Info size={16} className="text-slate-500 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-800">탐구 보고서 유효성 팁:</strong> 학생 여러분과 관찰 조장은 직접 측정한 실험 결과를 각 텍스트 박스에 기입하거나, 위의 대사 유형 가속 프리셋 버튼을 클릭하여 수치를 자동으로 연동하여 관찰할 수 있습니다.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            id="btn-postmeal-submit"
            disabled={!isFormValid}
            className={`w-full sm:w-auto min-w-[320px] font-bold text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98 shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            대사 반응 종합 판정
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
