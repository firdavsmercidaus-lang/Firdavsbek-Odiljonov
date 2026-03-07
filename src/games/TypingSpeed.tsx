import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Keyboard } from 'lucide-react';
import { cn } from '../lib/utils';

const TEXTS = [
  "Dasturlash - bu kelajak tili. Har bir qator kod yangi imkoniyatlar eshigini ochadi.",
  "O'zbekiston - go'zal va boy tarixga ega mamlakat. Bizning ajdodlarimiz ilm-fan rivojiga katta hissa qo'shgan.",
  "Muvaffaqiyatga erishish uchun tinimsiz mehnat va sabr kerak. Hech qachon taslim bo'lmang.",
  "Texnologiyalar dunyoni o'zgartirmoqda. Biz ham bu o'zgarishlarning bir qismi bo'lishimiz kerak."
];

export default function TypingSpeed() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());
    
    setInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }
    setAccuracy(Math.floor((correct / val.length) * 100) || 100);

    // Calculate WPM
    const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000;
    const wordsTyped = val.length / 5;
    setWpm(Math.floor(wordsTyped / timeElapsed) || 0);

    if (val === text) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-3xl">
      <div className="flex gap-24 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">WPM</p>
          <p className="text-5xl font-black text-white">{wpm}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Accuracy</p>
          <p className="text-5xl font-black text-emerald-500">{accuracy}%</p>
        </div>
      </div>

      <div className="w-full bg-zinc-900 border-4 border-zinc-800 p-8 rounded-[40px] shadow-2xl relative">
        <div className="text-xl leading-relaxed mb-8 select-none">
          {text.split('').map((char, i) => (
            <span 
              key={i}
              className={cn(
                "transition-colors",
                i < input.length ? (input[i] === char ? "text-emerald-500" : "text-rose-500 bg-rose-500/20") : "text-zinc-600"
              )}
            >
              {char}
            </span>
          ))}
        </div>

        <textarea
          value={input}
          onChange={handleInput}
          disabled={gameOver}
          className="w-full bg-zinc-800 border-2 border-zinc-700 p-6 rounded-2xl text-xl outline-none focus:border-emerald-500 transition-all resize-none h-32"
          placeholder="Yozishni boshlang..."
          autoFocus
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center rounded-[40px]">
            <h2 className="text-5xl font-black mb-4 uppercase">Tamomlandi!</h2>
            <div className="flex gap-12 mb-8">
              <div className="text-center">
                <p className="text-zinc-500 text-xs uppercase tracking-widest">WPM</p>
                <p className="text-4xl font-black">{wpm}</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Accuracy</p>
                <p className="text-4xl font-black text-emerald-500">{accuracy}%</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform"
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
