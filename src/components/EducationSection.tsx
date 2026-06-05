/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Sparkles, Check, CheckCircle, Flame, Heart, Zap, BrainCircuit } from 'lucide-react';

export default function EducationSection() {
  const [markedCards, setMarkedCards] = useState<Record<string, boolean>>({});

  const toggleMarkRead = (cardId: string) => {
    setMarkedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const eduCards = [
    {
      id: 'diff',
      title: '왜 사람마다 식후 혈당 반응이 전부 다를까요?',
      icon: <BrainCircuit className="text-blue-600" size={22} />,
      badge: '대사 다양성',
      color: 'border-blue-100 bg-blue-50/10 hover:border-blue-200',
      text: '우리는 같은 음식을 먹어도 체내 장내 미생물의 생태계 분포, 췌장 세포의 인슐린 초기 동원 분비 능력, 허벅지나 엉덩이에 분포하고 있는 근육의 총 부피량, 그리고 밤사이 가졌던 수면의 질(스트레스 코르티솔 결합 정도)에 의해 흡수 속도가 극명하게 갈립니다. 과학자들은 이러한 생리학적 차이로 인해 100명에게 동일한 유기 흰쌀밥을 먹여도 혈당 곡선이 모두 제각각임을 무수한 논문을 통해 확인하였습니다.'
    },
    {
      id: 'spikes',
      title: '식후 혈당 스파이크(Spike)가 건강에 치명적인 이유',
      icon: <Zap className="text-rose-600" size={22} />,
      badge: '스파이크 부작용',
      color: 'border-rose-100 bg-rose-50/10 hover:border-rose-200',
      text: '식사를 시작한 지 얼마 되지 않아 혈당이 한순간에 폭발적으로 위로 솟는 상태를 ‘혈당 스파이크’라고 부릅니다. 이와 같은 급변동이 매 식사마다 누적되면 혈관 기저막에 상처와 만성 미세 염증이 촉발됩니다. 또한, 일하기 지친 췌장에서 갑자기 과량 분비된 인슐린의 작용으로 이번에는 혈당이 비정상적으로 밑으로 꺾이며 손이 떨리고 머리가 하얘지는 ‘식곤증 및 저혈당 쇼크’와 뇌의 ‘가짜 배고픔’을 일으키고, 이는 또 다른 당 중독으로 이어지는 굴레가 됩니다.'
    },
    {
      id: 'exercise',
      title: '식후 15분 만의 ‘가볍고 빠른 걷기’가 만드는 기적',
      icon: <Flame className="text-emerald-600" size={22} />,
      badge: '포도당 셔틀',
      color: 'border-emerald-100 bg-emerald-50/10 hover:border-emerald-200',
      text: '소화 직후 혈액 내에 가득 풀려 돌아다니는 포도당 수용체를 혈관 밖으로 빠르게 청소해 주어야 합니다. 신기하게도, 인간 몸의 대퇴사두근(허벅지)이나 기저 대근육을 가볍게 수축시키면(스쿼트, 빠른 보행, 제자리 런지 등) 신체는 복잡한 인슐린 매개체 경로를 완전 거치지 않고도 “GLUT-4 포도당 운반통로”를 즉시 근육 바깥벽으로 뿜어냅니다. 이 덕분에 활성화된 하체가 인슐린 없이도 신속히 당분을 에너지로 집어와 소모하므로 엄청난 혈당 강하 및 스파이크 상쇄 효과가 발생합니다.'
    },
    {
      id: 'not_diagnosis',
      title: '학교 실습용 가상 시뮬레이션 활용 시 주의사항',
      icon: <Heart className="text-violet-600" size={22} />,
      badge: '탐구 참고서',
      color: 'border-violet-100 bg-violet-50/10 hover:border-violet-200',
      text: '현재 이 프로그램의 시뮬레이션 모방 및 분석 판정 기준은 일반적인 성인 건강 교육 지침을 준용하여 정량된 수식으로 작동합니다. 따라서, 실제 당뇨 질환이나 병리 인슐린 이상 등으로 병원 진료가 필요하신 사용자를 정밀 보정하거나 의학 치료 처방을 제공할 수 없습니다. 단순한 대사 순환 지표의 작동법과 내 생활 습관 파악을 돕는 보건 협업 실습용으로만 신뢰하여 탐구하길 적극 독려합니다.'
    }
  ];

  const readCount = Object.values(markedCards).filter(Boolean).length;

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 scroll-mt-6" id="education-anchor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="text-slate-700" size={24} />
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">혈당 배움 교육 라운지</h2>
            <p className="text-xs text-slate-500 font-medium">대사 다양성과 왜곡습관에 대한 기초 지식을 즉시 마스터합니다.</p>
          </div>
        </div>
        {readCount > 0 && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs self-start sm:self-auto">
            <CheckCircle size={14} />
            탐구 마스터율 {Math.round((readCount / eduCards.length) * 100)}%
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eduCards.map((card) => {
          const isRead = markedCards[card.id] || false;
          return (
            <div
              key={card.id}
              className={`border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 ${card.color} ${
                isRead ? 'bg-slate-100/40 border-slate-300 shadow-2xs' : 'bg-white shadow-2xs'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold font-mono bg-white border border-slate-100 px-2.5 py-0.5 rounded-md shadow-2xs text-slate-500">
                    {card.badge}
                  </span>
                  <div className="p-1.5 bg-white rounded-lg shadow-4xs">{card.icon}</div>
                </div>

                <h3 className="font-extrabold text-slate-800 text-sm md:text-base mb-2">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4 whitespace-pre-wrap">{card.text}</p>
              </div>

              {/* Read Confirmation Button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => toggleMarkRead(card.id)}
                  id={`btn-read-edu-${card.id}`}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border transition-all ${
                    isRead
                      ? 'bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700 active:scale-97 shadow-3xs'
                  }`}
                >
                  {isRead ? (
                    <>
                      <Check size={13} className="stroke-[2.5]" />
                      배움 탐색 완료
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      자세히 읽고 마크하기
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
