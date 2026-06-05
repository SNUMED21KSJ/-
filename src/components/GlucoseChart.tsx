/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface GlucoseChartProps {
  fasting: number;
  min30: number;
  min60: number;
}

export default function GlucoseChart({ fasting, min30, min60 }: GlucoseChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = [
    { label: '0분 혈당', labelSub: '공복 시작', value: fasting },
    { label: '식후 30분', labelSub: '소화 흡수', value: min30 },
    { label: '식후 60분', labelSub: '대사 회복', value: min60 },
  ];

  // Chart config
  const chartWidth = 500;
  const chartHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 40;

  const dataWidth = chartWidth - paddingLeft - paddingRight;
  const dataHeight = chartHeight - paddingTop - paddingBottom;

  // Dynamic Y scale bounds
  const rawValues = points.map(p => p.value);
  const minVal = 50; // Standard bottom line
  const maxVal = Math.max(220, ...rawValues) + 20; // Ensure some headroom above peak
  const valueRange = maxVal - minVal;

  const getX = (index: number) => {
    return paddingLeft + (index / (points.length - 1)) * dataWidth;
  };

  const getY = (val: number) => {
    const ratio = (val - minVal) / valueRange;
    return paddingTop + dataHeight - ratio * dataHeight;
  };

  // Generate SVG path string for the line
  let dPath = '';
  points.forEach((p, idx) => {
    const x = getX(idx);
    const y = getY(p.value);
    if (idx === 0) {
      dPath = `M ${x} ${y}`;
    } else {
      dPath += ` L ${x} ${y}`;
    }
  });

  // Gradient area path string
  const dAreaPath = `${dPath} L ${getX(points.length - 1)} ${getY(minVal)} L ${getX(0)} ${getY(minVal)} Z`;

  // Peak index
  const peakVal = Math.max(...rawValues);
  const peakIdx = rawValues.indexOf(peakVal);

  return (
    <div className="w-full bg-white border border-slate-100/80 rounded-3xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 mb-4 gap-2">
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">시간대별 혈당 변동 그래프 (0분, 30분, 60분)</h3>
          <p className="text-[11px] text-slate-400 font-medium">그래프 데이터가 3개 시점으로 압축되었습니다.</p>
        </div>
        <div className="flex gap-2.5 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-rose-500">
            <span className="w-2.5 h-2.5 bg-rose-150 border border-rose-300 rounded-sm"></span> 위험 영역 (&gt;200)
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <span className="w-2.5 h-2.5 bg-amber-100/60 border border-amber-300 rounded-sm"></span> 경계 범위 (140~200)
          </span>
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="w-2.5 h-2.5 bg-emerald-100/40 border border-emerald-300 rounded-sm"></span> 안정 범위 (70~140)
          </span>
        </div>
      </div>

      {/* SVG Container wrapping */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto text-slate-300 select-none overflow-visible"
        >
          {/* Defined gradients */}
          <defs>
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>

            <linearGradient id="stableZoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.01" />
            </linearGradient>
            
            <clipPath id="chartClip">
              <rect x={paddingLeft} y={paddingTop} width={dataWidth} height={dataHeight} />
            </clipPath>
          </defs>

          {/* BACKGROUND BANDS */}
          {/* Stable zone area (70 - 140 mg/dL) */}
          {minVal <= 140 && (
            <rect
              x={paddingLeft}
              y={getY(Math.min(maxVal, 140))}
              width={dataWidth}
              height={Math.max(0, getY(Math.min(maxVal, 70)) - getY(Math.min(maxVal, 140)))}
              className="fill-emerald-50/20"
            />
          )}

          {/* Warning zone area (140 - 200 mg/dL) */}
          {maxVal >= 140 && (
            <rect
              x={paddingLeft}
              y={getY(Math.min(maxVal, 200))}
              width={dataWidth}
              height={Math.max(0, getY(Math.min(maxVal, 140)) - getY(Math.min(maxVal, 200)))}
              className="fill-amber-50/15"
            />
          )}

          {/* Risk zone area ( > 200 mg/dL) */}
          {maxVal >= 200 && (
            <rect
              x={paddingLeft}
              y={getY(maxVal)}
              width={dataWidth}
              height={Math.max(0, getY(Math.min(maxVal, 200)) - getY(maxVal))}
              className="fill-rose-50/10"
            />
          )}

          {/* Grid lines & Y scale values */}
          {[70, 100, 140, 200, 300].map((gridVal) => {
            if (gridVal > maxVal) return null;
            const y = getY(gridVal);
            return (
              <g key={gridVal} className="opacity-90">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke={gridVal === 140 ? '#10b981' : gridVal === 200 ? '#ef4444' : '#e2e8f0'}
                  strokeWidth={gridVal === 140 || gridVal === 200 ? 1 : 0.7}
                  strokeDasharray={gridVal === 140 || gridVal === 200 ? '0' : '3 3'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="font-mono text-[9px] font-bold fill-slate-400"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Horizontal Bottom Line */}
          <line
            x1={paddingLeft}
            y1={getY(minVal)}
            x2={chartWidth - paddingRight}
            y2={getY(minVal)}
            stroke="#cbd5e1"
            strokeWidth={1.5}
          />

          {/* AREA & LINE PLOTS */}
          <path
            d={dAreaPath}
            fill="url(#chartLineGrad)"
          />

          <path
            d={dPath}
            fill="none"
          />
          
          <path
            d={dPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DOTS & INTERACTIONS */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.value);
            const isHovered = hoveredIndex === idx;
            const isPeak = idx === peakIdx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-150"
              >
                {/* Active range click indicator circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={20}
                  className="fill-transparent hover:fill-slate-400/5"
                />

                {/* Outer shadow dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 10 : 7}
                  className={`${isPeak ? 'fill-rose-500' : 'fill-blue-600'} opacity-30 transition-all`}
                />

                {/* Core crisp dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4.5}
                  className={`${isPeak ? 'fill-rose-600' : 'fill-blue-600'} transition-all`}
                  stroke="#ffffff"
                  strokeWidth={2}
                />

                {/* Value label text displayed on graph permanently */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className={`font-mono text-xs font-heavy tracking-tighter ${
                    isPeak ? 'fill-rose-700 font-extrabold' : 'fill-blue-950 font-bold'
                  }`}
                >
                  {p.value}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {points.map((p, idx) => {
            const x = getX(idx);
            return (
              <g key={idx}>
                <text
                  x={x}
                  y={chartHeight - 20}
                  textAnchor="middle"
                  className="font-sans text-[11px] font-bold fill-slate-700"
                >
                  {p.label}
                </text>
                <text
                  x={x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  className="font-mono text-[9px] font-semibold fill-slate-400"
                >
                  {p.labelSub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mini Diagnostic Score explanation below the SVG */}
      <div className="mt-4 bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-700 gap-3">
        <div className="flex items-center gap-1.5 focus:outline-hidden">
          <span className="text-sm">📈</span>
          <span>
            실험 최고 도달 혈당값:{' '}
            <strong className="text-rose-600 text-sm font-black">{peakVal} mg/dL</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 focus:outline-hidden">
          <span>📉</span>
          <span>
            공복 대비 최고 혈당 상승폭:{' '}
            <strong className="text-blue-600 text-sm font-black">+{peakVal - fasting} mg/dL</strong>
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">가독성 높은 3-Point 실시간 2D SVG vector 렌더링</span>
      </div>
    </div>
  );
}
