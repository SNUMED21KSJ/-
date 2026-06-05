/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GlucoseData, GlucoseType, LifestyleAnswers, MealOption, SimulationResult } from '../types';
import { GLUCOSE_TYPE_DETAILS, generateSuggestions } from '../utils';
import GlucoseChart from './GlucoseChart';
import EducationSection from './EducationSection';
import { 
  ArrowLeft, RotateCcw, Share2, Award, ClipboardCopy, Info, CheckCircle, 
  HelpCircle, ChevronRight, UserMinus, Plus, ShieldCheck, HeartPulse
} from 'lucide-react';

interface DashboardProps {
  fasting: number;
  meal: MealOption;
  customMealName?: string;
  answers: LifestyleAnswers;
  glucoseData: GlucoseData;
  glucoseType: GlucoseType;
  onRestart: () => void;
  onSaveToHistory: (name: string) => void;
  hasBeenSaved: boolean;
}

export default function Dashboard({
  fasting,
  meal,
  customMealName,
  answers,
  glucoseData,
  glucoseType,
  onRestart,
  onSaveToHistory,
  hasBeenSaved
}: DashboardProps) {
  const [studentName, setStudentName] = useState('');
  const [savedName, setSavedName] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load state details
  const detail = GLUCOSE_TYPE_DETAILS[glucoseType];
  const suggestions = generateSuggestions(answers, glucoseType);

  const mealDisplayName = customMealName || meal.name;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim() === '') {
      setSaveError('실습대장에 기록할 학적 이름이나 별명을 기재해 주세요.');
      return;
    }
    onSaveToHistory(studentName.trim());
    setSavedName(studentName.trim());
    setStudentName('');
    setSaveError(null);
  };

  const handleCopySummary = () => {
    const summaryText = `
[🔬 1일 혈당 체험 플랫폼 실습 보고서]
이름: ${savedName || '가상 실험자'}
식사 메뉴: ${mealDisplayName} ${meal.emoji}
0분 혈당(공복): ${fasting} mg/dL
식후 시간별: 30분(${glucoseData.min30}) ➔ 60분(${glucoseData.min60})
판정된 혈당 대사 유형: ${detail.title}
건강 생활 가이드 조언:
${suggestions.map((s, i) => `${i+1}. ${s.title} : ${s.description}`).join('\n')}

*본 보고서는 교육 탐구 시뮬레이션으로 의학적 정밀 진단서가 아닙니다.
    `.trim();

    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('클립보드 작성에 실패했습니다:', err);
      });
  };

  // Humanized values for questionnaire summary layout
  const translateAnswer = (key: keyof LifestyleAnswers, val: string) => {
    const dict: Record<string, string> = {
      short: '5시간 미만 (부족)',
      normal: '5 ~ 7시간 (보통)',
      long: '7시간 초과 (충분)',
      very_low: '매우 편안함 (매우 낮음)',
      low: '편안함 (낮음)',
      moderate: '보통 수준',
      high: '높음 (상시)',
      very_high: '매우 높음',
      none: '거의 없음',
      few: '주 1 ~ 2회',
      frequent: '주 3회 이상',
      slow: '20분 이상 천천히',
      fast: '10분 미만 빠르게',
      eat: '규칙적 섭취',
      sometimes: '가끔 거름',
      skip: '자주 거름',
    };
    return dict[val] || val;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <button
          onClick={onRestart}
          id="btn-return-home"
          className="text-sm font-bold text-slate-600 hover:text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer bg-slate-100 py-3 px-4 rounded-xl transition-all"
        >
          <RotateCcw size={16} />
          다시 실험 시작하기
        </button>
        <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-center">
          실습 결과 분석표 발급 완료
        </span>
      </div>

      {/* Main Educational Simulation Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-slate-800 to-transparent opacity-40 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-xs font-bold text-blue-300 font-mono uppercase tracking-wider">실습 분석 리포트 카드</span>
          </div>

          <p className="text-slate-400 text-xs font-semibold mb-1">인슐린 감수성 진단 모델링 판결</p>
          <div className="flex flex-wrap items-baseline gap-2 mb-4">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2 text-white">
              <span className="text-3xl">{detail.emoji}</span> {detail.title}
            </h1>
          </div>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-blue-500 pl-3">
            {detail.description}
          </p>
        </div>
      </div>

      {/* Grid: Graph Card (Left/Major) & Dynamic Questionnaire Result summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left Double-Column for SVG Graph */}
        <div className="lg:col-span-2">
          <GlucoseChart
            fasting={fasting}
            min30={glucoseData.min30}
            min60={glucoseData.min60}
          />
        </div>

        {/* Right Single-Column for Questionnaire Sync Summary */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4">
              <span className="text-slate-600">📋</span>
              <h3 className="font-extrabold text-slate-800 text-sm">입력된 기초 생활 습관 지표</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: '🛌 수면 시간', val: answers.sleep, key: 'sleep' },
                { label: '🧘 스트레스 수준', val: answers.stress, key: 'stress' },
                { label: '⏰ 야식 빈도', val: answers.lateSnack, key: 'lateSnack' },
                { label: '👟 운동 주기', val: answers.exercise, key: 'exercise' },
                { label: '⏱️ 식사 속도', val: answers.speed, key: 'speed' },
                { label: '🍚 아침 식사', val: answers.breakfast, key: 'breakfast' },
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="font-medium bg-white text-slate-800 border border-slate-150 px-2 py-0.5 rounded shadow-4xs">
                    {translateAnswer(item.key as keyof LifestyleAnswers, item.val)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-200/80 text-xs text-slate-500">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-600">🍽️ 선택된 시뮬레이션 식사</span>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {mealDisplayName}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-200 bg-rose-50/40 p-3 rounded-xl border border-rose-100 text-[10px] text-rose-700 font-semibold leading-relaxed flex gap-1.5">
            <Info size={14} className="shrink-0 text-rose-500 mt-0.5" />
            <p>
              <strong>법적 고지:</strong> 이 시뮬레이터가 제시하는 판정은 자가 진단 가상 시나리오로, 의학적 소견이 필요할 수 있는 실제 임상 혈당과는 상이할 수 있습니다.
            </p>
          </div>
        </div>
        
      </div>

      {/* Section: Physiological Mechanism Explainer - Highlighting Affected Factors */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6">
        <h3 className="font-extrabold text-slate-800 text-base mb-3 flex items-center gap-1.5 text-slate-900 border-b border-slate-100 pb-2.5">
          <span>🧬</span>
          이 혈당 유형을 촉진한 생체적 내적 메커니즘
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          조사된 유전적 성향과 습관에 터잡아 발생할 수 있는 주요 체내 작용 방식을 요약해 드립니다.
        </p>
        <div className="space-y-2.5">
          {detail.mechanisms.map((mech, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/50 border border-slate-100 rounded-xl p-3">
              <span className="text-indigo-600 font-extrabold mt-0.5">{i+1}.</span>
              <p className="leading-relaxed">{mech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized suggestions based on questionnaire */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <HeartPulse className="text-rose-500" size={20} />
          <div>
            <h3 className="font-extrabold text-slate-950 text-base">맞춤형 건강 생활 개선 처방</h3>
            <p className="text-xs text-slate-400 font-semibold">입력하신 설문에 기초해 추출된 즉시 실천 가능한 조언입니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className={`border-l-4 p-4.5 rounded-r-2xl border-slate-200 shadow-2xs ${sug.color} flex items-start gap-3.5`}
            >
              <span className="text-3xl filter drop-shadow-xs shrink-0 select-none">{sug.icon}</span>
              <div>
                <h4 className="font-black text-sm mb-1.5 text-slate-900 leading-tight">
                  {sug.title}
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {sug.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Save and Reporting board - multi-user capability for classes */}
      <div className="bg-gradient-to-br from-blue-50/40 via-sky-50/20 to-blue-100/30 border border-blue-100 rounded-3xl p-6 mb-6">
        <h3 className="font-extrabold text-blue-950 text-base mb-2 flex items-center gap-1.5">
          <span>🏆</span>
          실습대장에 기록 저장 및 공유
        </h3>
        <p className="text-xs text-blue-900/80 mb-4 max-w-xl leading-relaxed font-medium">
          이름이나 학번을 입력해 학급 대장보드에 여러분의 데이터 곡선을 남깁니다. 다른 학우들과 결과를 교차 대조하여 다름을 발견해 보세요.
        </p>

        {/* Name input form */}
        {!hasBeenSaved && !savedName ? (
          <form onSubmit={handleSaveSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="flex-1">
              <input
                id="input-student-name"
                type="text"
                placeholder="실습생 이름 기재 (예: 김영희)"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-white border border-blue-200 focus:border-blue-600 rounded-xl px-4 py-3 text-sm font-bold placeholder-slate-400 focus:outline-hidden transition-all shadow-3xs"
              />
              {saveError && (
                <p className="text-xs text-rose-500 font-semibold mt-1">{saveError}</p>
              )}
            </div>
            <button
              type="submit"
              id="btn-save-record"
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-3 rounded-xl cursor-pointer shadow-3xs hover:shadow-2xs active:scale-98 transition-all shrink-0"
            >
              이름 적고 실습 저장
            </button>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 p-4 rounded-2xl border border-blue-100/80">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm flex-1">
              <CheckCircle className="text-emerald-500 shrink-0" size={18} />
              <span>
                성공적으로 실습 대장에 등록되었습니다! (등록명: <strong>{savedName || '실습완료자'}</strong>)
              </span>
            </div>
            
            {/* Share and Copy Button */}
            <div className="flex gap-2 w-full sm:w-auto self-stretch sm:self-auto">
              <button
                type="button"
                onClick={handleCopySummary}
                id="btn-copy-report"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
              >
                <ClipboardCopy size={14} />
                {copied ? '복사되었습니다!' : '리포트 텍스트 복사'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Educational Information loungers */}
      <EducationSection />

      {/* Footer controls for ipad scroll margin */}
      <div className="pb-16 pt-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 text-xs text-slate-400 gap-3">
        <span>1일 혈당 체험 플랫폼 © 보건·생물 융합 공동체</span>
        <div className="flex gap-3">
          <a
            href="#education-anchor"
            className="hover:underline hover:text-blue-600 font-bold"
          >
            배움 라운지 스크롤 이동 ➔
          </a>
        </div>
      </div>
    </div>
  );
}
