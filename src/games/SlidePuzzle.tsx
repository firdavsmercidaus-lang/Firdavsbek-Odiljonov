import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SlidePuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);

  const initGame = useCallback(() => {
    let newTiles = Array.from({ length: 9 }, (_, i) => i);
    // Shuffle
    for (let i = 0; i < 500; i++) {
      const emptyIdx = newTiles.indexOf(0);
      const neighbors = [];
      if (emptyIdx % 3 > 0) neighbors.push(emptyIdx - 1);
      if (emptyIdx % 3 < 2) neighbors.push(emptyIdx + 1);
      if (emptyIdx >= 3) neighbors.push(emptyIdx - 3);
      if (emptyIdx < 6) neighbors.push(emptyIdx + 3);
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
      (Math.abs(idx - emptyIdx) === 1 && Math.floor(idx / 3) === Math.floor(emptyIdx / 3)) ||
      Math.abs(idx - emptyIdx) === 3;

    if (isNeighbor) {
      const newTiles = [...tiles];
      [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      if (newTiles.slice(0, 8).every((t, i) => t === i + 1)) setWin(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex justify-between w-full items-center">
        <div className="text-left">
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Harakatlar</p>
          <p className="text-4xl font-black">{moves}</p>
        </div>
        <button onClick={initGame} className="p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-zinc-900 p-4 rounded-[40px] border-8 border-zinc-800 shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((tile, i) => (
            <motion.button
              key={i}
              layout
              onClick={() => handleTileClick(i)}
              className={cn(
                "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-3xl font-black transition-all overflow-hidden relative",
                tile === 0 ? "bg-zinc-950 shadow-inner" : "bg-zinc-800 border-b-4 border-zinc-950 hover:bg-zinc-700 text-white"
              )}
            >
              {tile !== 0 && (
                <>
                  <img 
                    src={`https://picsum.photos/seed/game${tile}/300/300`} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <span className="relative z-10">{tile}</span>
                </>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {win && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-emerald-500 mb-4 uppercase">G'alaba!</h2>
          <button onClick={initGame} className="px-8 py-3 bg-white text-black font-black rounded-xl">Yana o'ynash</button>
        </div>
      )}
    </div>
  );
}
