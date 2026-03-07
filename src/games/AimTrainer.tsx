import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AimTrainer() {
  const [targets, setTargets] = useState<{ id: number, x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const spawnTarget = useCallback(() => {
    const id = Date.now();
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    setTargets(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(spawnTarget, 800);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, spawnTarget]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, gameStarted]);

  const handleHit = (id: number) => {
    setScore(s => s + 1);
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setGameStarted(true);
    setTargets([]);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
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

      <div className="relative w-full aspect-video bg-zinc-900 border-8 border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl cursor-crosshair">
        <AnimatePresence>
          {targets.map(t => (
            <motion.button
              key={t.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => handleHit(t.id)}
              className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-rose-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
            >
              <Target className="w-6 h-6 text-white" />
            </motion.button>
          ))}
        </AnimatePresence>

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <button
              onClick={startGame}
              className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest"
            >
              Boshlash
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center">
            <h2 className="text-5xl font-black mb-4 uppercase">Vaqt tugadi!</h2>
            <p className="text-zinc-400 text-xl mb-8">Siz {score} ta nishonni urdingiz.</p>
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
    </div>
  );
}
