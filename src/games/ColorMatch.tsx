import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const COLOR_NAMES = ['QIZIL', 'KO\'K', 'YASHIL', 'SARIQ', 'BINAFSHA', 'PUSHTI'];

export default function ColorMatch() {
  const [targetColor, setTargetColor] = useState({ name: '', color: '' });
  const [options, setOptions] = useState<{ name: string, color: string }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const nextRound = useCallback(() => {
    const targetIdx = Math.floor(Math.random() * COLORS.length);
    const displayIdx = Math.floor(Math.random() * COLORS.length);
    
    setTargetColor({
      name: COLOR_NAMES[targetIdx],
      color: COLORS[displayIdx] // Stroop effect
    });

    const newOptions = COLORS.map((c, i) => ({
      name: COLOR_NAMES[i],
      color: c
    })).sort(() => Math.random() - 0.5);
    
    setOptions(newOptions);
  }, []);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleChoice = (name: string) => {
    if (gameOver) return;
    if (name === targetColor.name) {
      setScore(s => s + 1);
      nextRound();
    } else {
      setScore(s => Math.max(0, s - 1));
      nextRound();
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    nextRound();
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex gap-24 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Score</p>
          <p className="text-5xl font-black text-white">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Time</p>
          <p className={cn("text-5xl font-black", timeLeft < 10 ? "text-rose-500" : "text-emerald-500")}>{timeLeft}s</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4">Rang nomini tanlang:</p>
        <motion.h2 
          key={targetColor.name + targetColor.color}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl font-black tracking-tighter"
          style={{ color: targetColor.color }}
        >
          {targetColor.name}
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md">
        {options.map((opt, i) => (
          <motion.button
            key={opt.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(opt.name)}
            className="bg-zinc-900 border border-zinc-800 py-4 rounded-2xl font-bold text-lg hover:border-zinc-600 transition-all"
          >
            {opt.name}
          </motion.button>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center">
          <h2 className="text-5xl font-black mb-4">VAQT TUGADI!</h2>
          <p className="text-zinc-400 text-xl mb-8">Sizning natijangiz: {score}</p>
          <button
            onClick={resetGame}
            className="px-10 py-4 bg-emerald-500 text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-6 h-6" />
            Qayta boshlash
          </button>
        </div>
      )}
    </div>
  );
}
