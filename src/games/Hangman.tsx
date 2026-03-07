import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WORDS = ["KOMPYUTER", "DASTURCHI", "INTERNET", "TELEFON", "O'YINLAR", "ALGORITM", "MA'LUMOT", "EKRAN", "KLAVIATURA", "SICHQONCHA"];

export default function Hangman() {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const initGame = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    setWord(w);
    setGuessed([]);
    setMistakes(0);
    setGameOver(false);
    setWin(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = (char: string) => {
    if (gameOver || win || guessed.includes(char)) return;

    setGuessed(prev => [...prev, char]);
    if (!word.includes(char)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 6) setGameOver(true);
    }
  };

  useEffect(() => {
    if (word && word.split('').every(c => c === "'" || guessed.includes(c))) {
      setWin(true);
    }
  }, [guessed, word]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Hangman Drawing */}
        <div className="relative w-48 h-64 border-b-4 border-zinc-700">
          <div className="absolute left-1/2 bottom-0 w-1 h-full bg-zinc-700" />
          <div className="absolute left-1/2 top-0 w-24 h-1 bg-zinc-700" />
          <div className="absolute right-0 top-0 w-1 h-8 bg-zinc-700" />
          
          {/* Body Parts */}
          {mistakes > 0 && <div className="absolute right-[-12px] top-8 w-6 h-6 border-4 border-white rounded-full" />}
          {mistakes > 1 && <div className="absolute right-0 top-14 w-1 h-16 bg-white" />}
          {mistakes > 2 && <div className="absolute right-0 top-16 w-8 h-1 bg-white origin-left rotate-[-30deg]" />}
          {mistakes > 3 && <div className="absolute right-0 top-16 w-8 h-1 bg-white origin-left rotate-[210deg]" />}
          {mistakes > 4 && <div className="absolute right-0 top-30 w-8 h-1 bg-white origin-left rotate-[60deg]" />}
          {mistakes > 5 && <div className="absolute right-0 top-30 w-8 h-1 bg-white origin-left rotate-[120deg]" />}
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-3">
            {word.split('').map((char, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black min-w-[24px] text-center">
                  {char === "'" ? "'" : (guessed.includes(char) ? char : '')}
                </span>
                {char !== "'" && <div className="w-8 h-1 bg-zinc-700 rounded-full" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
            {alphabet.map(char => (
              <button
                key={char}
                onClick={() => handleGuess(char)}
                disabled={guessed.includes(char) || gameOver || win}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold transition-all",
                  guessed.includes(char) 
                    ? (word.includes(char) ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-600")
                    : "bg-zinc-900 hover:bg-zinc-700 text-white"
                )}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(gameOver || win) && (
        <div className="text-center">
          <h2 className={cn("text-3xl font-black mb-4", win ? "text-emerald-500" : "text-rose-500")}>
            {win ? "G'ALABA!" : `YUTQAZDINGIZ! So'z: ${word}`}
          </h2>
          <button onClick={initGame} className="px-8 py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 mx-auto">
            <RotateCcw className="w-5 h-5" /> Qayta boshlash
          </button>
        </div>
      )}
    </div>
  );
}
