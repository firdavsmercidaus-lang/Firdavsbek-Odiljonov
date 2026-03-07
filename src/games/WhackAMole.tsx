import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WhackAMole() {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const spawnMole = useCallback(() => {
    if (gameOver) return;
    const newMoles = Array(9).fill(false);
    const idx = Math.floor(Math.random() * 9);
    newMoles[idx] = true;
    setMoles(newMoles);
    
    const timeout = setTimeout(() => {
      setMoles(Array(9).fill(false));
      if (!gameOver) setTimeout(spawnMole, Math.random() * 1000 + 500);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, [gameOver]);

  useEffect(() => {
    spawnMole();
  }, [spawnMole]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleWhack = (idx: number) => {
    if (moles[idx]) {
      setScore(s => s + 1);
      const newMoles = [...moles];
      newMoles[idx] = false;
      setMoles(newMoles);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setMoles(Array(9).fill(false));
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

      <div className="grid grid-cols-3 gap-4 bg-zinc-900 p-6 rounded-[40px] border-8 border-zinc-800 shadow-2xl">
        {moles.map((active, i) => (
          <div 
            key={i} 
            className="w-24 h-24 bg-zinc-950 rounded-full relative overflow-hidden border-4 border-zinc-900 shadow-inner cursor-crosshair"
            onClick={() => handleWhack(i)}
          >
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="absolute inset-0 flex items-center justify-center text-5xl select-none"
                >
                  🐹
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center">
          <h2 className="text-5xl font-black mb-4 uppercase">Vaqt tugadi!</h2>
          <p className="text-zinc-400 text-xl mb-8">Siz {score} ta molni urdingiz.</p>
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
