import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const SIZE = 15;

export default function Maze() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [win, setWin] = useState(false);

  const generateMaze = useCallback(() => {
    const maze = Array(SIZE).fill(0).map(() => Array(SIZE).fill(1));
    
    const walk = (x: number, y: number) => {
      maze[y][x] = 0;
      const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]].sort(() => Math.random() - 0.5);
      for (let [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (nx > 0 && nx < SIZE - 1 && ny > 0 && ny < SIZE - 1 && maze[ny][nx] === 1) {
          maze[y + dy / 2][x + dx / 2] = 0;
          walk(nx, ny);
        }
      }
    };
    
    walk(1, 1);
    maze[SIZE - 2][SIZE - 2] = 0; // Ensure exit
    setGrid(maze);
    setPlayer({ x: 1, y: 1 });
    setWin(false);
  }, []);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  const move = useCallback((dx: number, dy: number) => {
    if (win) return;
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] === 0) {
      setPlayer({ x: nx, y: ny });
      if (nx === SIZE - 2 && ny === SIZE - 2) setWin(true);
    }
  }, [player, grid, win]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move(0, -1);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full items-center">
        <h2 className="text-3xl font-black">LABIRINT</h2>
        <button onClick={generateMaze} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-zinc-800 p-2 rounded-2xl border-4 border-zinc-700 shadow-2xl">
        <div className="grid gap-px bg-zinc-700" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {grid.map((row, y) => row.map((cell, x) => (
            <div 
              key={`${x}-${y}`}
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
                cell === 1 ? "bg-zinc-900" : "bg-zinc-800",
                x === player.x && y === player.y ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full scale-75" : "",
                x === SIZE - 2 && y === SIZE - 2 ? "bg-rose-500/50 flex items-center justify-center text-[10px]" : ""
              )}
            >
              {x === SIZE - 2 && y === SIZE - 2 && "🏁"}
            </div>
          )))}
        </div>
      </div>

      {win && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-emerald-500 mb-4 uppercase">Chiqish yo'li topildi!</h2>
          <button onClick={generateMaze} className="px-8 py-3 bg-white text-black font-black rounded-xl">Yana o'ynash</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={() => move(0, -1)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↑</button>
        <div />
        <button onClick={() => move(-1, 0)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">←</button>
        <button onClick={() => move(0, 1)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↓</button>
        <button onClick={() => move(1, 0)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">→</button>
      </div>
    </div>
  );
}
