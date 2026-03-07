import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TowerOfHanoi() {
  const [towers, setTowers] = useState<number[][]>([[3, 2, 1], [], []]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);
  const [count, setCount] = useState(3);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const initGame = useCallback((n: number) => {
    setTowers([Array.from({ length: n }, (_, i) => n - i), [], []]);
    setSelected(null);
    setMoves(0);
    setWin(false);
    setCount(n);
    setTime(0);
    setIsActive(false);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && !win) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, win]);

  useEffect(() => {
    initGame(3);
  }, [initGame]);

  const handleTowerClick = (idx: number) => {
    if (win) return;
    if (!isActive) setIsActive(true);

    if (selected === null) {
      if (towers[idx].length > 0) setSelected(idx);
    } else {
      if (selected === idx) {
        setSelected(null);
        return;
      }

      const source = towers[selected];
      const target = towers[idx];
      const disk = source[source.length - 1];

      if (target.length === 0 || target[target.length - 1] > disk) {
        const newTowers = [...towers.map(t => [...t])];
        newTowers[selected].pop();
        newTowers[idx].push(disk);
        setTowers(newTowers);
        setMoves(m => m + 1);
        setSelected(null);

        if (idx === 2 && newTowers[2].length === count) setWin(true);
      } else {
        setSelected(idx);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-8">
          <div className="text-left">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Harakatlar</p>
            <p className="text-4xl font-black">{moves}</p>
          </div>
          <div className="text-left">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Vaqt</p>
            <p className="text-4xl font-black">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {[3, 4, 5].map(n => (
            <button 
              key={n} 
              onClick={() => initGame(n)}
              className={cn("px-4 py-2 rounded-xl font-bold transition-all", count === n ? "bg-white text-black" : "bg-zinc-900 text-zinc-500")}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-around w-full h-64 items-end relative">
        <div className="absolute bottom-0 w-full h-2 bg-zinc-800 rounded-full" />
        {towers.map((tower, i) => (
          <div 
            key={i} 
            onClick={() => handleTowerClick(i)}
            className="relative flex flex-col items-center w-1/3 h-full cursor-pointer group"
          >
            <div className={cn("absolute bottom-0 w-2 h-full bg-zinc-800 rounded-t-full transition-colors", selected === i ? "bg-emerald-500" : "group-hover:bg-zinc-700")} />
            <div className="absolute bottom-2 flex flex-col-reverse items-center w-full">
              {tower.map((disk, j) => (
                <motion.div
                  key={disk}
                  layoutId={`disk-${disk}`}
                  className={cn(
                    "h-8 rounded-full border-2 border-black/20 shadow-lg",
                    selected === i && j === tower.length - 1 ? "brightness-125 -translate-y-4" : ""
                  )}
                  style={{ 
                    width: `${disk * 20 + 40}px`,
                    backgroundColor: `hsl(${disk * 40}, 70%, 50%)`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {win && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-emerald-500 mb-4 uppercase">G'alaba!</h2>
          <button onClick={() => initGame(count)} className="px-8 py-3 bg-white text-black font-black rounded-xl">Yana o'ynash</button>
        </div>
      )}
    </div>
  );
}
