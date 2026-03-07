import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LightsOut() {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);
  const [level, setLevel] = useState(1);

  const initGame = useCallback(() => {
    let newGrid = Array(5).fill(null).map(() => Array(5).fill(false));
    // Simulate random clicks to ensure solvable. More clicks for higher levels.
    const clicks = 5 + level * 5;
    for (let i = 0; i < clicks; i++) {
      const r = Math.floor(Math.random() * 5);
      const c = Math.floor(Math.random() * 5);
      toggle(newGrid, r, c);
    }
    setGrid(newGrid);
    setMoves(0);
    setWin(false);
  }, [level]);

  const nextLevel = () => {
    setLevel(l => l + 1);
  };

  const toggle = (g: boolean[][], r: number, c: number) => {
    const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
    dirs.forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
        g[nr][nc] = !g[nr][nc];
      }
    });
  };

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleClick = (r: number, c: number) => {
    if (win) return;
    const newGrid = [...grid.map(row => [...row])];
    toggle(newGrid, r, c);
    setGrid(newGrid);
    setMoves(m => m + 1);
    if (newGrid.flat().every(cell => !cell)) setWin(true);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-2">CHIROQLAR</h2>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Level {level} - Barcha chiroqlarni o'chiring</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[40px] border-8 border-zinc-800 shadow-2xl">
        <div className="grid grid-cols-5 gap-3">
          {grid.map((row, r) => row.map((cell, c) => (
            <motion.button
              key={`${r}-${c}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(r, c)}
              className={cn(
                "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl transition-all duration-300",
                cell 
                  ? "bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] border-b-4 border-yellow-600" 
                  : "bg-zinc-800 border-b-4 border-zinc-950"
              )}
            />
          )))}
        </div>
      </div>

      <div className="flex gap-12 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Harakatlar</p>
          <p className="text-4xl font-black">{moves}</p>
        </div>
        <button onClick={initGame} className="p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {win && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-emerald-500 mb-4 uppercase">G'alaba!</h2>
          <div className="flex gap-4 justify-center">
            <button onClick={initGame} className="px-8 py-3 bg-zinc-800 text-white font-black rounded-xl">Qayta o'ynash</button>
            <button onClick={nextLevel} className="px-8 py-3 bg-emerald-500 text-black font-black rounded-xl">Keyingi bosqich</button>
          </div>
        </div>
      )}
    </div>
  );
}
