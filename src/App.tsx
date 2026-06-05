/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LifestyleAnswers, MealOption, GlucoseData, GlucoseType, UserHistoryItem } from './types';
import { classifyGlucoseResponse } from './utils';
import Home from './components/Home';
import Questionnaire from './components/Questionnaire';
import FastingInput from './components/FastingInput';
import MealSelection from './components/MealSelection';
import PostMealInput from './components/PostMealInput';
import Dashboard from './components/Dashboard';
import { Heart, Activity } from 'lucide-react';

type AppStep = 'home' | 'questionnaire' | 'fasting' | 'meal' | 'postmeal' | 'dashboard';

export default function App() {
  const [step, setStep] = useState<AppStep>('home');
  const [history, setHistory] = useState<UserHistoryItem[]>([]);

  // Core Simulation States
  const [answers, setAnswers] = useState<LifestyleAnswers | null>(null);
  const [fasting, setFasting] = useState<number | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [customMealName, setCustomMealName] = useState<string>('');
  const [glucoseData, setGlucoseData] = useState<GlucoseData | null>(null);
  const [glucoseType, setGlucoseType] = useState<GlucoseType | null>(null);
  const [hasBeenSaved, setHasBeenSaved] = useState<boolean>(false);

  // Load history from localStorage on mounting
  useEffect(() => {
    try {
      const stored = localStorage.getItem('glucose_sim_history_v1');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage:', e);
    }
  }, []);

  // Save history helper
  const saveHistoryList = (newList: UserHistoryItem[]) => {
    setHistory(newList);
    try {
      localStorage.setItem('glucose_sim_history_v1', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to stringify and store history list:', e);
    }
  };

  const handleStartSimulation = () => {
    // Reset individual states
    setAnswers(null);
    setFasting(null);
    setSelectedMeal(null);
    setCustomMealName('');
    setGlucoseData(null);
    setGlucoseType(null);
    setHasBeenSaved(false);
    
    // Jump to questionnaire
    setStep('questionnaire');
  };

  const handleQuestionnaireNext = (completedAnswers: LifestyleAnswers) => {
    setAnswers(completedAnswers);
    setStep('fasting');
  };

  const handleFastingNext = (fastingVal: number) => {
    setFasting(fastingVal);
    setStep('meal');
  };

  const handleMealNext = (meal: MealOption, customName?: string) => {
    setSelectedMeal(meal);
    if (customName) {
      setCustomMealName(customName);
    } else {
      setCustomMealName('');
    }
    setStep('postmeal');
  };

  const handlePostMealSubmit = (data: GlucoseData) => {
    setGlucoseData(data);
    if (fasting !== null) {
      const type = classifyGlucoseResponse(fasting, data);
      setGlucoseType(type);
    }
    setStep('dashboard');
  };

  const handleSaveToHistory = (name: string) => {
    if (fasting === null || !selectedMeal || !glucoseData || !glucoseType) return;

    const mealName = customMealName || selectedMeal.name;
    const maxVal = Math.max(glucoseData.min30, glucoseData.min60);
    const rise = maxVal - fasting;

    const newItem: UserHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      meal: `${mealName} ${selectedMeal.emoji}`,
      glucoseType,
      date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      maxRise: rise,
    };

    const updated = [newItem, ...history];
    saveHistoryList(updated);
    setHasBeenSaved(true);
  };

  const handleClearHistory = () => {
    saveHistoryList([]);
  };

  const handleViewRecordFromHistory = (recordId: string) => {
    // Find record (this platform works as simulator, let's load parameters from saved historical presets in actual run)
    // To enable instant historic inspection:
    alert('실습 보드의 기록은 교차 비교 관찰 대상입니다. 새로운 실험을 시작하여 직접 나만의 결과를 도출해 보세요!');
  };

  const handleBackToHome = () => {
    setStep('home');
  };

  return (
    <div className="min-h-100dvh bg-slate-50 text-slate-800 flex flex-col justify-between font-sans antialiased pb-safe selection:bg-blue-100 selection:text-blue-900">
      
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4.5 flex items-center justify-between shadow-3xs">
        <div 
          onClick={handleBackToHome}
          className="flex items-center gap-2 cursor-pointer select-none group focus:outline-hidden"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xs group-hover:scale-105 transition-transform">
            <Activity size={18} className="stroke-[3]" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm md:text-base leading-none tracking-tight">1일 혈당 체험 플랫폼</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 font-mono">BLOOD GLUCOSE SIMULATOR V1.1</p>
          </div>
        </div>

        {/* Global indicator/pills */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            iPad 보건 교육 최적화
          </span>
          {step !== 'home' && (
            <button
              onClick={handleBackToHome}
              id="btn-nav-home"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              대시보드 홈
            </button>
          )}
        </div>
      </header>

      {/* Main Core Layout */}
      <main className="flex-1 w-full flex flex-col justify-start">
        {step === 'home' && (
          <Home
            onStart={handleStartSimulation}
            history={history}
            onClearHistory={handleClearHistory}
            onViewRecord={handleViewRecordFromHistory}
          />
        )}

        {step === 'questionnaire' && (
          <Questionnaire
            onNext={handleQuestionnaireNext}
            onBack={handleBackToHome}
          />
        )}

        {step === 'fasting' && (
          <FastingInput
            onNext={handleFastingNext}
            onBack={() => setStep('questionnaire')}
          />
        )}

        {step === 'meal' && (
          <MealSelection
            onNext={handleMealNext}
            onBack={() => setStep('fasting')}
          />
        )}

        {step === 'postmeal' && fasting !== null && selectedMeal !== null && (
          <PostMealInput
            fasting={fasting}
            meal={selectedMeal}
            customMealName={customMealName}
            onNext={handlePostMealSubmit}
            onBack={() => setStep('meal')}
          />
        )}

        {step === 'dashboard' && 
         fasting !== null && 
         selectedMeal !== null && 
         glucoseData !== null && 
         glucoseType !== null && (
          <Dashboard
            fasting={fasting}
            meal={selectedMeal}
            customMealName={customMealName}
            answers={answers!}
            glucoseData={glucoseData}
            glucoseType={glucoseType}
            onRestart={handleStartSimulation}
            onSaveToHistory={handleSaveToHistory}
            hasBeenSaved={hasBeenSaved}
          />
        )}
      </main>

      {/* Persistent micro progress nodes footer for teacher tracking */}
      <footer className="w-full text-center text-[10px] font-bold text-slate-300 py-4 select-none pointer-events-none mt-auto">
        <span>KOREAN SECONDARY MEDICAL EDUCATION PLATFORM SUPPORT LABS</span>
      </footer>

    </div>
  );
}
