import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

type Tile = {
  id: number;
  value: number;
  x: number;
  y: number;
  mergedFrom?: [Tile, Tile];
};

export default function Game2048() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048_bestscore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [nextId, setNextId] = useState(1);

  const createTile = (x: number, y: number, value: number = Math.random() < 0.9 ? 2 : 4): Tile => {
    const id = nextId;
    setNextId(id + 1);
    return { id, value, x, y };
  };

  const initGame = useCallback(() => {
    setNextId(1);
    let t1 = { id: 1, value: 2, x: Math.floor(Math.random() * 4), y: Math.floor(Math.random() * 4) };
    let t2;
    while (true) {
      t2 = { id: 2, value: 2, x: Math.floor(Math.random() * 4), y: Math.floor(Math.random() * 4) };
      if (t1.x !== t2.x || t1.y !== t2.y) break;
    }
    setTiles([t1, t2]);
    setNextId(3);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  }, []);

  useEffect(() => {
    if (tiles.length === 0) initGame();
  }, [tiles.length, initGame]);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048_bestscore', score.toString());
    }
  }, [score, bestScore]);

  const move = useCallback((dx: number, dy: number) => {
    if (gameOver) return;

    let moved = false;
    let newScore = score;
    const newTiles: Tile[] = [];
    const mergedIds = new Set<number>();

    // Sort tiles based on direction
    const sortedTiles = [...tiles].sort((a, b) => {
      if (dx === 1) return b.x - a.x;
      if (dx === -1) return a.x - b.x;
      if (dy === 1) return b.y - a.y;
      if (dy === -1) return a.y - b.y;
      return 0;
    });

    const grid: (Tile | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null));
    tiles.forEach(t => grid[t.y][t.x] = t);

    sortedTiles.forEach(tile => {
      let nx = tile.x;
      let ny = tile.y;

      while (true) {
        const tx = nx + dx;
        const ty = ny + dy;

        if (tx < 0 || tx >= 4 || ty < 0 || ty >= 4) break;

        const other = grid[ty][tx];
        if (!other) {
          nx = tx;
          ny = ty;
          moved = true;
        } else if (other.value === tile.value && !mergedIds.has(other.id)) {
          // Merge
          nx = tx;
          ny = ty;
          mergedIds.add(other.id);
          newScore += tile.value * 2;
          moved = true;
          break;
        } else {
          break;
        }
      }

      const existingAtNew = grid[ny][nx];
      if (existingAtNew && existingAtNew !== tile) {
        // This tile merged into existingAtNew
        newTiles.push({ ...existingAtNew, value: existingAtNew.value * 2 });
        grid[ny][nx] = null; // Prevent further merges into this spot this turn
      } else {
        newTiles.push({ ...tile, x: nx, y: ny });
        grid[tile.y][tile.x] = null;
        grid[ny][nx] = newTiles[newTiles.length - 1];
      }
    });

    if (moved) {
      // Add new tile
      const emptySpots: { x: number, y: number }[] = [];
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (!newTiles.some(t => t.x === x && t.y === y)) {
            emptySpots.push({ x, y });
          }
        }
      }

      if (emptySpots.length > 0) {
        const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        newTiles.push(createTile(spot.x, spot.y));
      }

      setTiles(newTiles);
      setScore(newScore);
      
      if (newTiles.some(t => t.value === 2048) && !gameWon) {
        setGameWon(true);
      }
    }
  }, [tiles, score, bestScore, gameOver, nextId, gameWon]);

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

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      2: 'bg-zinc-200 text-zinc-800',
      4: 'bg-zinc-300 text-zinc-800',
      8: 'bg-orange-200 text-orange-900',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-400 text-white shadow-[0_0_15px_rgba(250,204,21,0.4)]',
      256: 'bg-yellow-500 text-white shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      512: 'bg-yellow-600 text-white shadow-[0_0_25px_rgba(202,138,4,0.6)]',
      1024: 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.7)]',
      2048: 'bg-emerald-600 text-white shadow-[0_0_40px_rgba(5,150,105,0.8)]',
    };
    return colors[value] || 'bg-zinc-900 text-white';
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-[400px] items-end">
        <h1 className="text-6xl font-black text-zinc-200 tracking-tighter">2048</h1>
        <div className="flex gap-2">
          <div className="bg-zinc-900 px-4 py-2 rounded-xl text-center min-w-[80px]">
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Score</p>
            <p className="text-xl font-bold">{score}</p>
          </div>
          <div className="bg-zinc-900 px-4 py-2 rounded-xl text-center min-w-[80px]">
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Best</p>
            <p className="text-xl font-bold">{bestScore}</p>
          </div>
        </div>
      </div>

      <div className="relative bg-zinc-800 p-3 rounded-2xl w-[min(90vw,400px)] aspect-square grid grid-cols-4 grid-rows-4 gap-3">
        {/* Background Grid */}
        {Array(16).fill(0).map((_, i) => (
          <div key={i} className="bg-zinc-900/50 rounded-lg" />
        ))}

        {/* Tiles */}
        <AnimatePresence>
          {tiles.map((tile) => (
            <motion.div
              key={tile.id}
              layoutId={String(tile.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                "absolute w-[calc(25%-12px)] h-[calc(25%-12px)] m-1.5 rounded-lg flex items-center justify-center text-2xl font-black",
                getTileColor(tile.value)
              )}
              style={{
                left: `${tile.x * 25}%`,
                top: `${tile.y * 25}%`,
              }}
            >
              {tile.value}
            </motion.div>
          ))}
        </AnimatePresence>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-black mb-6">O'YIN TUGADI!</h2>
            <button
              onClick={initGame}
              className="px-8 py-3 bg-zinc-200 text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-5 h-5" />
              Qayta boshlash
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={() => move(0, -1)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↑</button>
        <button onClick={() => move(0, 1)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↓</button>
        <button onClick={() => move(-1, 0)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">←</button>
        <button onClick={() => move(1, 0)} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">→</button>
      </div>
    </div>
  );
}
