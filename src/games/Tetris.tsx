import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const COLS = 10;
const ROWS = 20;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS = {
  I: 'bg-cyan-400',
  J: 'bg-blue-500',
  L: 'bg-orange-500',
  O: 'bg-yellow-400',
  S: 'bg-green-500',
  T: 'bg-purple-500',
  Z: 'bg-red-500',
};

export default function Tetris() {
  const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(0).map(() => Array(COLS).fill('')));
  const [activePiece, setActivePiece] = useState<{ shape: number[][], x: number, y: number, type: string } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const spawnPiece = useCallback(() => {
    const keys = Object.keys(SHAPES);
    const type = keys[Math.floor(Math.random() * keys.length)];
    const shape = SHAPES[type as keyof typeof SHAPES];
    const piece = { shape, x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0, type };
    
    if (checkCollision(piece.shape, piece.x, piece.y)) {
      setGameOver(true);
    } else {
      setActivePiece(piece);
    }
  }, [grid]);

  const checkCollision = (shape: number[][], x: number, y: number) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (shape: number[][]) => {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  };

  const lockPiece = () => {
    if (!activePiece) return;
    const newGrid = [...grid.map(row => [...row])];
    activePiece.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const y = activePiece.y + r;
          const x = activePiece.x + c;
          if (y >= 0) newGrid[y][x] = activePiece.type;
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newGrid[r].every(cell => cell !== '')) {
        newGrid.splice(r, 1);
        newGrid.unshift(Array(COLS).fill(''));
        linesCleared++;
        r++;
      }
    }

    if (linesCleared > 0) {
      setScore(s => s + [0, 100, 300, 500, 800][linesCleared]);
    }

    setGrid(newGrid);
    spawnPiece();
  };

  const move = (dx: number, dy: number) => {
    if (!activePiece || gameOver || isPaused) return;
    if (!checkCollision(activePiece.shape, activePiece.x + dx, activePiece.y + dy)) {
      setActivePiece({ ...activePiece, x: activePiece.x + dx, y: activePiece.y + dy });
    } else if (dy > 0) {
      lockPiece();
    }
  };

  const handleRotate = () => {
    if (!activePiece || gameOver || isPaused) return;
    const rotated = rotate(activePiece.shape);
    if (!checkCollision(rotated, activePiece.x, activePiece.y)) {
      setActivePiece({ ...activePiece, shape: rotated });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') handleRotate();
      if (e.key === ' ') setIsPaused(p => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePiece, gameOver, isPaused]);

  useEffect(() => {
    if (!activePiece && !gameOver) spawnPiece();
  }, [activePiece, gameOver, spawnPiece]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current > 800) {
        move(0, 1);
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [activePiece, gameOver, isPaused]);

  const resetGame = () => {
    setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill('')));
    setScore(0);
    setGameOver(false);
    setActivePiece(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-12 items-end">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Score</p>
          <p className="text-4xl font-black text-blue-500">{score}</p>
        </div>
        <button onClick={resetGame} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="relative bg-zinc-900 border-4 border-zinc-800 rounded-2xl overflow-hidden p-1 shadow-2xl flex">
        <div className="grid grid-cols-10 grid-rows-20 gap-px bg-zinc-800 w-[200px] h-[400px]">
          {grid.map((row, r) => row.map((cell, c) => {
            let colorClass = cell ? COLORS[cell as keyof typeof COLORS] : 'bg-[#0a0a0a]';
            
            // Draw active piece
            if (activePiece) {
              const pr = r - activePiece.y;
              const pc = c - activePiece.x;
              if (pr >= 0 && pr < activePiece.shape.length && pc >= 0 && pc < activePiece.shape[0].length && activePiece.shape[pr][pc]) {
                colorClass = COLORS[activePiece.type as keyof typeof COLORS];
              }
            }

            return (
              <div key={`${r}-${c}`} className={cn("w-full h-full rounded-[2px]", colorClass)} />
            );
          }))}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4 text-center">
            <h2 className="text-2xl font-black mb-4">O'YIN TUGADI!</h2>
            <button onClick={resetGame} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg">Qayta boshlash</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={handleRotate} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↻</button>
        <div />
        <button onClick={() => move(-1, 0)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">←</button>
        <button onClick={() => move(0, 1)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↓</button>
        <button onClick={() => move(1, 0)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">→</button>
      </div>
    </div>
  );
}
