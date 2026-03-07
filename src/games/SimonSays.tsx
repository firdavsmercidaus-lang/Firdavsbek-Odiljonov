import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export default function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const playSequence = useCallback(async (seq: number[]) => {
    setIsShowing(true);
    const delay = Math.max(200, 600 - (seq.length * 40)); // Speed up as level increases
    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise(r => setTimeout(r, delay));
      setActiveColor(null);
      await new Promise(r => setTimeout(r, delay / 3));
    }
    setIsShowing(false);
  }, []);

  const nextRound = useCallback(() => {
    const next = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, next];
    setSequence(newSeq);
    setUserSequence([]);
    setTimeout(() => playSequence(newSeq), 1000);
  }, [sequence, playSequence]);

  const handleColorClick = (idx: number) => {
    if (isShowing || gameOver) return;

    const newUserSeq = [...userSequence, idx];
    setUserSequence(newUserSeq);
    
    // Flash color
    setActiveColor(idx);
    setTimeout(() => setActiveColor(null), 300);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      setGameOver(true);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setScore(s => s + 1);
      nextRound();
    }
  };

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setScore(0);
    setGameOver(false);
    const first = Math.floor(Math.random() * 4);
    setSequence([first]);
    setTimeout(() => playSequence([first]), 500);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Level</p>
        <p className="text-6xl font-black text-white">{score}</p>
      </div>

      <div className="relative w-72 h-72 sm:w-96 sm:h-96 grid grid-cols-2 gap-4 p-4 bg-zinc-900 rounded-full border-8 border-zinc-800 shadow-2xl overflow-hidden">
        {COLORS.map((color, i) => (
          <motion.button
            key={i}
            whileHover={!isShowing && !gameOver ? { scale: 1.02, brightness: 1.1 } : {}}
            whileTap={!isShowing && !gameOver ? { scale: 0.95 } : {}}
            onClick={() => handleColorClick(i)}
            className={cn(
              "w-full h-full transition-all duration-200",
              activeColor === i ? "brightness-150 scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]" : "opacity-40"
            )}
            style={{ backgroundColor: color, borderRadius: i === 0 ? '100% 0 0 0' : i === 1 ? '0 100% 0 0' : i === 2 ? '0 0 0 100%' : '0 0 100% 0' }}
          />
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-zinc-900 rounded-full border-8 border-zinc-800 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {!sequence.length && !gameOver && (
        <button
          onClick={startGame}
          className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest"
        >
          Boshlash
        </button>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center">
          <h2 className="text-5xl font-black mb-4 uppercase">Xato!</h2>
          <p className="text-zinc-400 text-xl mb-8">Siz {score} ta bosqichdan o'tdingiz.</p>
          <button
            onClick={startGame}
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
