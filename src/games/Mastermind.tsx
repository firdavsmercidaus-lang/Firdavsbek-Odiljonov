import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const MAX_TRIES = 10;

export default function Mastermind() {
  const [target, setTarget] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<{ colors: number[], feedback: { black: number, white: number } }[]>([]);
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const initGame = useCallback(() => {
    const t = Array(4).fill(0).map(() => Math.floor(Math.random() * COLORS.length));
    setTarget(t);
    setGuesses([]);
    setCurrentGuess([]);
    setGameOver(false);
    setWin(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleColorClick = (idx: number) => {
    if (currentGuess.length < 4) setCurrentGuess([...currentGuess, idx]);
  };

  const submitGuess = () => {
    if (currentGuess.length !== 4) return;

    let black = 0;
    let white = 0;
    const tCopy = [...target];
    const gCopy = [...currentGuess];

    // Check black
    for (let i = 0; i < 4; i++) {
      if (gCopy[i] === tCopy[i]) {
        black++;
        tCopy[i] = -1;
        gCopy[i] = -2;
      }
    }

    // Check white
    for (let i = 0; i < 4; i++) {
      if (gCopy[i] === -2) continue;
      const idx = tCopy.indexOf(gCopy[i]);
      if (idx !== -1) {
        white++;
        tCopy[idx] = -1;
      }
    }

    const newGuesses = [...guesses, { colors: currentGuess, feedback: { black, white } }];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    if (black === 4) {
      setWin(true);
      setGameOver(true);
    } else if (newGuesses.length === MAX_TRIES) {
      setGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2">MASTERMIND</h2>
        <p className="text-zinc-500 text-sm">Rangli kodni toping.</p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {Array(MAX_TRIES).fill(0).map((_, i) => {
          const guess = guesses[i];
          const isCurrent = i === guesses.length;
          
          return (
            <div key={i} className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
              <div className="flex gap-2">
                {Array(4).fill(0).map((_, j) => {
                  const colorIdx = isCurrent ? currentGuess[j] : guess?.colors[j];
                  return (
                    <div 
                      key={j} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-zinc-800"
                      style={{ backgroundColor: colorIdx !== undefined ? COLORS[colorIdx] : 'transparent' }}
                    />
                  );
                })}
              </div>
              <div className="flex gap-1 flex-wrap w-8">
                {guess && Array(4).fill(0).map((_, j) => {
                  let color = 'bg-zinc-800';
                  if (j < guess.feedback.black) color = 'bg-white';
                  else if (j < guess.feedback.black + guess.feedback.white) color = 'bg-zinc-400';
                  return <div key={j} className={cn("w-3 h-3 rounded-full border border-black/20", color)} />;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-3">
          {COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => handleColorClick(i)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-zinc-800 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
          <button 
            onClick={() => setCurrentGuess(currentGuess.slice(0, -1))}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold"
          >
            ←
          </button>
        </div>
        <button
          onClick={submitGuess}
          disabled={currentGuess.length !== 4 || gameOver}
          className="px-12 py-3 bg-white text-black font-black rounded-xl disabled:opacity-50"
        >
          TEKSHIRISH
        </button>
      </div>

      {gameOver && (
        <div className="text-center">
          <h2 className={cn("text-3xl font-black mb-4", win ? "text-emerald-500" : "text-rose-500")}>
            {win ? "G'ALABA!" : "YUTQAZDINGIZ!"}
          </h2>
          <div className="flex gap-2 justify-center mb-6">
            {target.map((c, i) => <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: COLORS[c] }} />)}
          </div>
          <button onClick={initGame} className="px-8 py-3 bg-zinc-900 rounded-xl flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> Qayta boshlash
          </button>
        </div>
      )}
    </div>
  );
}
