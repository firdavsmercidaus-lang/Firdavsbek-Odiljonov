import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Timer, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ReactionTime() {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setResult(null);
    setState('waiting');
    const delay = Math.random() * 3000 + 2000;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setState('ready');
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('result');
      setResult(-1); // Special value for "Too early"
    } else if (state === 'ready') {
      const time = Date.now() - startTime;
      setResult(time);
      setHistory(prev => [time, ...prev].slice(0, 5));
      setState('result');
    } else if (state === 'idle' || state === 'result') {
      startTest();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-2">REAKSIYA TESTI</h2>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Qanchalik tez ekansiz?</p>
      </div>

      <motion.div
        onClick={handleClick}
        animate={{ 
          backgroundColor: state === 'ready' ? '#10b981' : state === 'waiting' ? '#ef4444' : result === -1 ? '#f43f5e' : '#18181b',
          scale: state === 'ready' ? 1.02 : 1
        }}
        className="w-full aspect-video rounded-[40px] border-8 border-zinc-800 flex flex-col items-center justify-center cursor-pointer select-none shadow-2xl transition-all"
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <Zap className="w-16 h-16 text-zinc-700" />
            <p className="text-2xl font-black uppercase tracking-widest">Boshlash uchun bosing</p>
          </div>
        )}
        {state === 'waiting' && (
          <div className="flex flex-col items-center gap-4">
            <Timer className="w-16 h-16 text-white/20 animate-spin" />
            <p className="text-4xl font-black uppercase tracking-widest">Kuting...</p>
          </div>
        )}
        {state === 'ready' && (
          <p className="text-6xl font-black uppercase tracking-widest text-black">BOSING!</p>
        )}
        {state === 'result' && (
          <div className="flex flex-col items-center gap-4">
            {result === -1 ? (
              <>
                <p className="text-5xl font-black uppercase tracking-tight">JUDA TEZ!</p>
                <p className="text-zinc-400 font-bold uppercase tracking-widest">Yashil rangni kuting</p>
              </>
            ) : (
              <>
                <p className="text-7xl font-black">{result}ms</p>
                <p className="text-xl font-bold uppercase tracking-widest text-zinc-500">Yana bir bor?</p>
              </>
            )}
          </div>
        )}
      </motion.div>

      {history.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Oxirgi natijalar</p>
          <div className="flex gap-4 overflow-auto pb-2">
            {history.map((h, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl min-w-[100px] text-center">
                <p className="text-2xl font-black text-emerald-500">{h}ms</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
