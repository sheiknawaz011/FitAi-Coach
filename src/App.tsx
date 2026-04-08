/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Utensils, 
  Lightbulb, 
  Flame, 
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  User, 
  Scale, 
  Target, 
  Trophy,
  Zap
} from 'lucide-react';
import { generateFitnessPlan, FitnessPlan } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    goal: 'fat loss',
    experience: 'beginner'
  });
  const [plan, setPlan] = useState<FitnessPlan | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    try {
      const result = await generateFitnessPlan(
        Number(formData.age),
        Number(formData.weight),
        formData.goal,
        formData.experience
      );
      setPlan(result);
      setStep('results');
    } catch (error) {
      console.error('Error generating plan:', error);
      setStep('input');
      alert('Failed to generate plan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Accents */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-400 text-zinc-950 mb-4 neon-glow">
                <Dumbbell size={32} />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">FitAI Coach</h1>
              <p className="text-zinc-400">Your personalized AI fitness journey starts here.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 glass p-8 rounded-3xl">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 block">Age</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="number"
                      required
                      placeholder="e.g. 25"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all outline-none"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 block">Weight (kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="number"
                      required
                      placeholder="e.g. 75"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all outline-none"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 block">Goal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['fat loss', 'muscle gain'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal: g })}
                        className={`py-3 rounded-xl border transition-all capitalize flex items-center justify-center gap-2 ${
                          formData.goal === g
                            ? 'bg-lime-400 border-lime-400 text-zinc-950 font-bold'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {g === 'fat loss' ? <Flame size={16} /> : <Zap size={16} />}
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 block">Experience</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['beginner', 'intermediate'].map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => setFormData({ ...formData, experience: exp })}
                        className={`py-3 rounded-xl border transition-all capitalize ${
                          formData.experience === exp
                            ? 'bg-lime-400 border-lime-400 text-zinc-950 font-bold'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-lime-400 text-zinc-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-lime-300 transition-colors group"
              >
                Generate My Plan
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </form>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-lime-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Profile</h2>
            <p className="text-zinc-400">Crafting your personalized fitness blueprint...</p>
          </motion.div>
        )}

        {step === 'results' && plan && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-4xl space-y-8 py-8"
          >
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setStep('input')}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Edit
              </button>
              <div className="text-right">
                <h2 className="text-3xl font-extrabold text-lime-400">Your Plan</h2>
                <p className="text-zinc-500 text-sm uppercase tracking-widest">{formData.goal} • {formData.experience}</p>
              </div>
            </div>

            {/* Motivation Section */}
            <div className="bg-lime-400 text-zinc-950 p-6 rounded-3xl relative overflow-hidden">
              <Trophy className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12" />
              <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-70">Trainer's Motivation</h3>
                <p className="text-xl font-bold italic leading-tight">"{plan.motivation}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Workout Plan */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-zinc-900 rounded-lg text-lime-400">
                    <Dumbbell size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Weekly Workout</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.workoutPlan.map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass p-5 rounded-2xl"
                    >
                      <h4 className="text-lime-400 font-bold mb-3 flex items-center justify-between">
                        {day.day}
                        <span className="text-[10px] bg-lime-400/10 px-2 py-0.5 rounded-full">Day {idx + 1}</span>
                      </h4>
                      <ul className="space-y-2">
                        {day.exercises.map((ex, i) => (
                          <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-1.5 shrink-0" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar: Diet & Tips */}
              <div className="space-y-8">
                {/* Diet Plan */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 rounded-lg text-orange-400">
                      <Utensils size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">Indian Diet</h3>
                  </div>
                  <div className="space-y-3">
                    {plan.dietPlan.map((meal, idx) => (
                      <div key={idx} className="glass p-4 rounded-2xl">
                        <h4 className="text-orange-400 font-bold text-sm mb-2 uppercase tracking-wider">{meal.meal}</h4>
                        <ul className="space-y-1">
                          {meal.items.map((item, i) => (
                            <li key={i} className="text-sm text-zinc-400">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 rounded-lg text-blue-400">
                      <Lightbulb size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">Pro Tips</h3>
                  </div>
                  <div className="space-y-3">
                    {plan.tips.map((tip, idx) => (
                      <div key={idx} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                        <p className="text-sm text-blue-200">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
