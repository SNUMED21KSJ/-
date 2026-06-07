/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserHistoryItem } from '../types';
import { GLUCOSE_TYPE_DETAILS } from '../utils';
import { Play, TrendingUp, HelpCircle, GraduationCap, History, Trash2, Award } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
  history: UserHistoryItem[];
  onClearHistory: () => void;
  onViewRecord: (id: string) => void;
}

export default function Home({ onStart, history, onClearHistory, onViewRecord }: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100/80 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          학생용 혈당 다양성 탐구 실험실
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-1 mb-3">
          1일 혈당 체험 플랫폼
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          “같은 음식을 먹어도 혈당 반응은 사람마다 다릅니다.”
        </p>
        <p className="text-sm text-slate-400 mt-2">
          본 플랫폼은 과학·보건 공동 탐구를 위한 시뮬레이션 교육 부스입니다.
        </p>
      </div>

      {/* 6 Types Information Alert Banner */}
      <div className="w-full bg-blue-50/50 border border-blue-200/60 rounded-2xl p-4 md:p-5 mb-8 flex flex-col sm:flex-row items-start gap-3.5 text-sm text-slate-700">
        <span className="text-xl select-none mt-0.5">🔬</span>
        <div>
          <h4 className="font-extrabold text-slate-900">분류 체계 안내</h4>
          <p className="text-xs font-semibold text-slate-600 mt-1">이 앱은 혈당 반응을 6가지 유형으로 분류합니다.</p>
          <p className="text-xs text-slate-500 mt-0.5">C. 역반응형은 걷기 후에도 혈당이 안정되지 않고 오히려 상승하는 유형입니다.</p>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
        <div className="bg-white border border-slate-200/80 hover:border-blue-200 p-6 rounded-2xl shadow-xs transition-all duration-200">
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1.5">혈당 변화 시뮬레이션</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            나의 수면, 스트레스, 야식 습관을 입력하고 특정 음식을 섭취한 뒤의 시간을 직접 측정한 혈당값을 숫자로 타이핑해 변화 그래프를 이끌어 냅니다.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 hover:border-blue-200 p-6 rounded-2xl shadow-xs transition-all duration-200">
          <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-4">
            <GraduationCap size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1.5">6가지 혈당 반응 유형</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            학생들은 자신이 키인한 데이터가 ‘안정형’, ‘급상승형’, ‘완만상승형’, ‘C. 역반응형’, ‘회복지연형’, ‘지연상승형’ 중 어디에 매치되는지 의학적 공식 규칙 유형으로 검사받습니다.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 hover:border-blue-200 p-6 rounded-2xl shadow-xs transition-all duration-200">
          <div className="bg-slate-50 text-slate-600 w-12 h-12 rounded-xl flex items-center justify-center font-bold mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1.5">개별 건강생활 처방전</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            나쁜 습관이 어떻게 인슐린 저항의 단초를 다지는지 학습하고, 생활 속에서 실현 가능한 식이조절 템플릿과 식후 근육 운동 수칙 조언을 처방받습니다.
          </p>
        </div>
      </div>

      {/* Hero Interactive Start Button */}
      <div className="w-full flex justify-center mb-10">
        <button
          onClick={onStart}
          id="btn-start-simulation"
          className="w-full sm:w-auto min-w-[320px] bg-blue-600 text-white font-bold text-lg px-8 py-5 rounded-2xl shadow-md hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play size={22} className="fill-current" />
          가상 혈당 실험 탐구 시작하기
        </button>
      </div>

      {/* Class/Previous Student Records Section */}
      <div className="w-full bg-slate-50/70 border border-slate-200/60 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <History className="text-slate-600" size={20} />
            <h2 className="font-bold text-slate-800 text-lg">우리 반 실습 탐구 보고서 보드 ({history.length}건)</h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              id="btn-clear-history"
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200/70 shadow-2xs"
            >
              <Trash2 size={13} />
              전체 기록 초기화
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
            <Award className="mx-auto text-slate-300 mb-2" size={36} />
            <p className="text-slate-500 font-medium text-sm">등록된 실습 결과가 전혀 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">첫 번째 가상 체험자가 되어 탐구 결과를 등록해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
            {history.map((record) => {
              const detail = GLUCOSE_TYPE_DETAILS[record.glucoseType];
              return (
                <div
                  key={record.id}
                  onClick={() => onViewRecord(record.id)}
                  className="bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-2xs p-3.5 rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-slate-800 text-sm truncate">{record.name} 학생</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {record.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="font-medium bg-slate-50 px-1 py-0.5 border border-slate-100 rounded text-slate-600">
                        {record.meal}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-rose-500 font-semibold">최고 상승 +{record.maxRise} mg/dL</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${detail?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {detail?.emoji} {detail?.title.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
