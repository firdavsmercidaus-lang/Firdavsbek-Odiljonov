import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const CHOICES = [
  { id: 'rock', emoji: '✊', name: 'Tosh' },
  { id: 'paper', emoji: '✋', name: 'Qog\'oz' },
  { id: 'scissors', emoji: '✌️', name: 'Qaychi' }
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<any>(null);
  const [cpuChoice, setCpuChoice] = useState<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, cpu: 0 });

  const play = (choice: any) => {
    const cpu = CHOICES[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setCpuChoice(cpu);

    if (choice.id === cpu.id) {
      setResult('Durang');
    } else if (
      (choice.id === 'rock' && cpu.id === 'scissors') ||
      (choice.id === 'paper' && cpu.id === 'rock') ||
      (choice.id === 'scissors' && cpu.id === 'paper')
    ) {
      setResult('G\'alaba!');
      setScore(s => ({ ...s, player: s.player + 1 }));
    } else {
      setResult('Mag\'lubiyat');
      setScore(s => ({ ...s, cpu: s.cpu + 1 }));
    }
  };

  const reset = () => {
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex gap-24 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Siz</p>
          <p className="text-6xl font-black text-white">{score.player}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">CPU</p>
          <p className="text-6xl font-black text-zinc-600">{score.cpu}</p>
        </div>
      </div>

      <div className="flex gap-8 items-center justify-center min-h-[200px]">
        <AnimatePresence mode="wait">
          {playerChoice ? (
            <motion.div 
              key="result"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex gap-12 items-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-8xl">{playerChoice.emoji}</div>
                  <p className="text-zinc-500 uppercase tracking-widest font-bold">Siz</p>
                </div>
                <div className="text-4xl font-black text-zinc-700">VS</div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-8xl">{cpuChoice.emoji}</div>
                  <p className="text-zinc-500 uppercase tracking-widest font-bold">CPU</p>
                </div>
              </div>
              <h2 className={cn(
                "text-5xl font-black uppercase tracking-tighter",
                result === 'G\'alaba!' ? "text-emerald-500" : result === 'Mag\'lubiyat' ? "text-rose-500" : "text-zinc-400"
              )}>
                {result}
              </h2>
              <button onClick={reset} className="px-8 py-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 flex items-center gap-2">
                <RotateCcw className="w-5 h-5" /> Yana bir bor
              </button>
            </motion.div>
          ) : (
            <div className="flex gap-6">
              {CHOICES.map(choice => (
                <motion.button
                  key={choice.id}
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => play(choice)}
                  className="w-28 h-28 sm:w-36 sm:h-36 bg-zinc-900 border-4 border-zinc-800 rounded-[40px] flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 transition-all shadow-xl"
                >
                  <span className="text-5xl sm:text-6xl">{choice.emoji}</span>
                  <span className="text-xs uppercase tracking-widest font-bold text-zinc-500">{choice.name}</span>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
