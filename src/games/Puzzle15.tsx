import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Puzzle15() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);

  const initGame = useCallback(() => {
    let newTiles = Array.from({ length: 16 }, (_, i) => i);
    // Shuffle
    for (let i = 0; i < 1000; i++) {
      const emptyIdx = newTiles.indexOf(0);
      const neighbors = [];
      if (emptyIdx % 4 > 0) neighbors.push(emptyIdx - 1);
      if (emptyIdx % 4 < 3) neighbors.push(emptyIdx + 1);
      if (emptyIdx >= 4) neighbors.push(emptyIdx - 4);
      if (emptyIdx < 12) neighbors.push(emptyIdx + 4);
      const targetIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      [newTiles[emptyIdx], newTiles[targetIdx]] = [newTiles[targetIdx], newTiles[emptyIdx]];
    }
    setTiles(newTiles);
    setMoves(0);
    setWin(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleTileClick = (idx: number) => {
    if (win) return;
    const emptyIdx = tiles.indexOf(0);
    const isNeighbor = 
      (Math.abs(idx - emptyIdx) === 1 && Math.floor(idx / 4) === Math.floor(emptyIdx / 4)) ||
      Math.abs(idx - emptyIdx) === 4;

    if (isNeighbor) {
      const newTiles = [...tiles];
      [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      
      // Check win
      if (newTiles.slice(0, 15).every((t, i) => t === i + 1)) {
        setWin(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex justify-between w-full items-center">
        <div className="text-left">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Moves</p>
          <p className="text-4xl font-black">{moves}</p>
        </div>
        <button onClick={initGame} className="p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-zinc-900 p-4 rounded-[40px] border-8 border-zinc-800 shadow-2xl">
        <div className="grid grid-cols-4 gap-3">
          {tiles.map((tile, i) => (
            <motion.button
              key={i}
              layout
              onClick={() => handleTileClick(i)}
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-2xl font-black transition-all",
                tile === 0 ? "bg-zinc-950 shadow-inner" : "bg-zinc-800 border-b-4 border-zinc-950 hover:bg-zinc-700 text-white"
              )}
            >
              {tile !== 0 && tile}
            </motion.button>
          ))}
        </div>
      </div>

      {win && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-emerald-500 mb-4 uppercase">G'alaba!</h2>
          <p className="text-zinc-500 mb-6">Siz {moves} ta harakatda bajardingiz.</p>
          <button onClick={initGame} className="px-8 py-3 bg-white text-black font-black rounded-xl">Yana o'ynash</button>
        </div>
      )}
    </div>
  );
}
