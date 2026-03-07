import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WORDS = [
  'OLMA', 'ANOR', 'BEHI', 'UZUM', 'ORIK', 'SHAFTOLI', 'QOVUN', 'TARVUZ', 'BANAN', 'LIMON',
  'GOSHT', 'NON', 'SUT', 'CHOY', 'SUV', 'KITOIB', 'QALAM', 'DAFTAR', 'MAKTAB', 'USTOZ',
  'QUYOSH', 'OY', 'YULDUZ', 'OSMON', 'YER', 'DENIZ', 'DARYO', 'TOG', 'OLLOX', 'VATAN',
  'DOST', 'ONA', 'OTA', 'BOLA', 'UY', 'ESHIK', 'DERAZA', 'STOL', 'STUL', 'GILAM'
];
const MAX_TRIES = 6;
const KEYBOARD = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

export default function Wordle() {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase());
  }, []);

  const resetGame = () => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase());
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWin(false);
  };

  const onKeyPress = (key: string) => {
    if (gameOver || win) return;

    if (key === 'ENTER') {
      if (currentGuess.length === targetWord.length) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');
        if (currentGuess === targetWord) {
          setWin(true);
          setGameOver(true);
        } else if (newGuesses.length === MAX_TRIES) {
          setGameOver(true);
        }
      }
    } else if (key === 'BACK') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < targetWord.length) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') onKeyPress('ENTER');
    else if (e.key === 'Backspace') onKeyPress('BACK');
    else if (/^[a-zA-Z]$/.test(e.key)) onKeyPress(e.key.toUpperCase());
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, targetWord, gameOver, win]);

  const getStatus = (guess: string, index: number) => {
    const char = guess[index];
    if (targetWord[index] === char) return 'correct';
    if (targetWord.includes(char)) return 'present';
    return 'absent';
  };

  const getLetterStatus = (char: string) => {
    let status: string = '';
    guesses.forEach(guess => {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === char) {
          if (targetWord[i] === char) status = 'correct';
          else if (status !== 'correct') status = 'present';
          else if (!status) status = 'absent';
        }
      }
    });
    return status;
  };

  const wordLength = targetWord.length;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-black mb-2">SO'Z TOP</h2>
        <p className="text-zinc-500 text-sm">O'zbekcha mevalar nomini toping.</p>
      </div>

      <div className="grid gap-2">
        {Array(MAX_TRIES).fill(0).map((_, i) => {
          const guess = guesses[i] || (i === guesses.length ? currentGuess : '');
          const isSubmitted = i < guesses.length;

          return (
            <div key={i} className="flex gap-2">
              {Array(wordLength).fill(0).map((_, j) => {
                const char = guess[j] || '';
                const status = isSubmitted ? getStatus(guess, j) : '';

                return (
                  <motion.div
                    key={j}
                    initial={isSubmitted ? { rotateX: 90 } : {}}
                    animate={isSubmitted ? { rotateX: 0 } : {}}
                    transition={{ delay: j * 0.1 }}
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center text-2xl font-black rounded-lg transition-colors",
                      status === 'correct' ? "bg-emerald-500 border-emerald-500 text-white" :
                      status === 'present' ? "bg-yellow-500 border-yellow-500 text-white" :
                      status === 'absent' ? "bg-zinc-700 border-zinc-700 text-white" :
                      char ? "border-zinc-500 text-white" : "border-zinc-800"
                    )}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="text-center">
          <h2 className={cn("text-2xl font-black mb-2", win ? "text-emerald-500" : "text-rose-500")}>
            {win ? "G'ALABA!" : `YUTQAZDINGIZ! So'z: ${targetWord}`}
          </h2>
          <button onClick={resetGame} className="px-6 py-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 flex items-center gap-2 mx-auto mt-4">
            <RotateCcw className="w-4 h-4" /> Qayta boshlash
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {KEYBOARD.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map(key => {
              const status = getLetterStatus(key);
              return (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={cn(
                    "px-2 py-3 sm:px-4 sm:py-4 rounded font-bold text-xs sm:text-sm transition-colors",
                    status === 'correct' ? "bg-emerald-500 text-white" :
                    status === 'present' ? "bg-yellow-500 text-white" :
                    status === 'absent' ? "bg-zinc-800 text-zinc-500" :
                    "bg-zinc-700 text-white hover:bg-zinc-600",
                    (key === 'ENTER' || key === 'BACK') && "px-3 sm:px-6"
                  )}
                >
                  {key === 'BACK' ? '←' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
