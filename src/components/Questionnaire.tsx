/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LifestyleAnswers } from '../types';
import { QUESTIONNAIRE_STEPS } from '../data';
import { ArrowLeft, ArrowRight, CheckCircle2, Moon, Activity, Calendar, Award } from 'lucide-react';

interface QuestionnaireProps {
  onNext: (answers: LifestyleAnswers) => void;
  onBack: () => void;
}

export default function Questionnaire({ onNext, onBack }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<LifestyleAnswers>>({
    sleep: undefined,
    stress: undefined,
    lateSnack: undefined,
    exercise: undefined,
    speed: undefined,
    breakfast: undefined,
  });

  const stepInfo = QUESTIONNAIRE_STEPS[currentStep];

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stepInfo.key]: value,
    }));

    // Auto-advance to next step with a tiny delay for UX sensation
    setTimeout(() => {
      if (currentStep < QUESTIONNAIRE_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 250);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleNextStep = () => {
    if (currentStep < QUESTIONNAIRE_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Validate all answers are completed
      if (isAllAnswered(answers)) {
        onNext(answers as LifestyleAnswers);
      }
    }
  };

  const isAllAnswered = (ans: Partial<LifestyleAnswers>): ans is LifestyleAnswers => {
    return (
      ans.sleep !== undefined &&
      ans.stress !== undefined &&
      ans.lateSnack !== undefined &&
      ans.exercise !== undefined &&
      ans.speed !== undefined &&
      ans.breakfast !== undefined
    );
  };

  const currentSelection = answers[stepInfo.key as keyof LifestyleAnswers];

  // Helper icons/decorations for questions
  const getStepIcon = (key: string) => {
    switch (key) {
      case 'sleep': return <Moon className="text-amber-500" size={20} />;
      case 'stress': return <Activity className="text-rose-500" size={20} />;
      case 'lateSnack': return <Calendar className="text-violet-500" size={20} />;
      default: return <Award className="text-emerald-500" size={20} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Progress and Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrevStep}
            id="btn-quiz-back"
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer bg-slate-100/80 px-3 py-2 rounded-xl transition-all"
          >
            <ArrowLeft size={16} />
            이전으로
          </button>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            기초 생활 습관 설문 ({currentStep + 1}/{QUESTIONNAIRE_STEPS.length})
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / QUESTIONNAIRE_STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Presentation Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-slate-50 rounded-lg">
            {getStepIcon(stepInfo.key)}
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">QUESTION 0{currentStep + 1}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">
          {stepInfo.title}
        </h2>

        <p className="text-sm md:text-base text-slate-500 leading-relaxed mb-8 border-l-4 border-slate-200 pl-3">
          {stepInfo.description}
        </p>

        {/* Option Selectors - Big Touch Targets for iPad */}
        <div className="space-y-3.5">
          {stepInfo.options.map((opt) => {
            const isSelected = currentSelection === opt.value;
            return (
              <button
                key={opt.value}
                id={opt.id}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full text-left p-4.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 text-slate-900 shadow-3xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                }`}
              >
                <span className="font-bold text-base md:text-lg group-hover:translate-x-0.5 transition-transform">
                  {opt.label}
                </span>
                <div className="flex items-center">
                  {isSelected ? (
                    <CheckCircle2 className="text-blue-600 fill-blue-50" size={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-slate-400 transition-all"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Non-sequential Navigation Assist */}
      <div className="flex justify-between items-center px-2">
        <p className="text-xs text-slate-400">
          안내: 선택 시 자동으로 다음 조사 단계로 스크롤 이동합니다.
        </p>
        
        {currentSelection && currentStep < QUESTIONNAIRE_STEPS.length - 1 && (
          <button
            onClick={handleNextStep}
            id="btn-quiz-next"
            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 px-4 py-2.5 rounded-xl transition-all"
          >
            다음 문항
            <ArrowRight size={16} />
          </button>
        )}

        {currentStep === QUESTIONNAIRE_STEPS.length - 1 && isAllAnswered(answers) && (
          <button
            onClick={handleNextStep}
            id="btn-quiz-finish"
            className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer px-5 py-3 rounded-xl transition-all shadow-xs"
          >
            기초 질문 완료
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
