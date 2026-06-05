/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Info, AlertCircle } from 'lucide-react';

interface FastingInputProps {
  onNext: (fasting: number) => void;
  onBack: () => void;
}

export default function FastingInput({ onNext, onBack }: FastingInputProps) {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    
    // Quick validation on keystroke
    if (val === '') {
      setError('공복 혈당 수치를 숫자로 입력해 주세요.');
      return;
    }

    const num = Number(val);
    if (isNaN(num)) {
      setError('올바른 숫자 형식만 입력 가능합니다.');
    } else if (num < 50 || num > 300) {
      setError('💡 공복 혈당의 정상 또는 탐구 가능한 범위는 50 ~ 300 mg/dL 수치 사이여야 연구 시뮬레이션에 유효합니다.');
    } else {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(value);
    
    if (value === '' || isNaN(num)) {
      setError('공복 혈당을 명확하게 숫자로 입력해 주세요.');
      return;
    }

    if (num < 50 || num > 300) {
      setError('⚠️ 측정 범위 초과: 50 mg/dL 미만이나 300 mg/dL 초과는 대사 가상 실험 분석 범위를 벗어납니다.');
      return;
    }

    onNext(num);
  };

  const numericValue = Number(value);
  const isValid = value !== '' && !isNaN(numericValue) && numericValue >= 50 && numericValue <= 300;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header navigations */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          id="btn-fasting-back"
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer bg-slate-100/80 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
          이전으로
        </button>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          공복 혈당 등록
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">공복 혈당 입력</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          음식물을 하룻밤(8시간 이상) 섭취하지 않은 상태에서 아침 기상 직후의 가상 혈당 수치를 등록합니다.
        </p>
      </div>

      {/* Dynamic Glucose Meter Illustration */}
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 mb-8 flex flex-col items-center justify-center shadow-2xs relative overflow-hidden">
        {/* Decorative background grids */}
        <div className="absolute inset-0 bg-radial from-transparent to-slate-200/50 opacity-60"></div>
        
        {/* Glucose Meter Main Body */}
        <div className="w-48 h-64 bg-slate-800 rounded-4xl border-4 border-slate-700 shadow-lg flex flex-col items-center p-4 relative z-10 transition-transform duration-300 hover:rotate-1">
          {/* Blood Drop Indicator Slot */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 px-3 py-1 rounded-full text-[9px] font-bold text-white shadow-xs">
            🩸 STRIP READY
          </div>

          {/* Liquid Crystal Display SCREEN */}
          <div className="w-full h-24 bg-teal-100/95 border-2 border-teal-200 rounded-xl p-2.5 flex flex-col justify-between font-mono relative mt-2 shadow-inner">
            <div className="flex justify-between items-center text-[8px] text-teal-800/80 font-bold">
              <span>MEM: 01</span>
              <span>12:00 AM</span>
            </div>
            
            {/* The Screen Output Value */}
            <div className="text-center flex items-baseline justify-center select-none">
              <span className="text-4xl font-black text-teal-950 tracking-tight leading-none">
                {value === '' || isNaN(numericValue) ? '---' : numericValue}
              </span>
              <span className="text-xs font-bold text-teal-900 ml-1">mg/dL</span>
            </div>

            <div className="flex justify-between text-[8px] text-teal-800/80 font-bold">
              <span>SYS FASTING</span>
              <span>OK</span>
            </div>
          </div>

          {/* Button indicators below the screen */}
          <div className="flex justify-around w-full mt-6">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold select-none cursor-not-allowed">M</div>
            <div className="w-10 h-10 rounded-full bg-rose-600/90 border border-rose-500 shadow-inner flex items-center justify-center text-[12px] text-white font-extrabold select-none animate-pulse">🩸</div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold select-none cursor-not-allowed">S</div>
          </div>

          {/* Brand/Model details */}
          <p className="text-[7px] text-slate-400 font-semibold tracking-wider font-mono mt-auto pt-2">GLUCO-METER S50</p>
        </div>
      </div>

      {/* Input Form with large touch inputs for iPad */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <label htmlFor="input-fasting-glucose" className="block text-sm font-bold text-slate-700 mb-2">
            공복 혈당 수치를 아래 칸에 입력하세요 (mg/dL)
          </label>
          <div className="relative">
            <input
              autoFocus
              id="input-fasting-glucose"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="예: 92"
              value={value}
              onChange={handleInputChange}
              className={`w-full text-xl font-bold bg-slate-50 border-2 rounded-xl py-4.5 px-4 focus:bg-white focus:outline-hidden focus:border-blue-600 transition-all ${
                error ? 'border-rose-400 bg-rose-50/25' : 'border-slate-200'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
              mg/dL
            </span>
          </div>

          {error ? (
            <div className="flex items-start gap-1.5 text-rose-600 text-xs font-semibold mt-3 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-start gap-1.5 text-slate-500 text-xs font-medium mt-3">
              <Info size={14} className="mt-0.5 text-blue-500 shrink-0" />
              <span>기준 참고: 건강한 성인의 평균 공복 혈당 수치는 70~99 mg/dL 범위에 속합니다.</span>
            </div>
          )}
        </div>

        {/* Form submitting button */}
        <button
          type="submit"
          id="btn-fasting-submit"
          disabled={!isValid}
          className={`w-full font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-750 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          기록 인증 및 다음 단계 진행
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
