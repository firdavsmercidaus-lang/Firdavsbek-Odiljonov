import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PegSolitaire() {
  const [board, setBoard] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [win, setWin] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const checkGameOver = (currentBoard: number[][]) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (currentBoard[r][c] === 1) {
          const dirs = [[0, 2], [0, -2], [2, 0], [-2, 0]];
          for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            const mr = r + dr / 2, mc = c + dc / 2;
            if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7 && currentBoard[nr][nc] === 0 && currentBoard[mr][mc] === 1) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const initGame = useCallback(() => {
    const b = [
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1]
    ];
    setBoard(b);
    setSelected(null);
    setWin(false);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (r: number, c: number) => {
    if (board[r][c] === 1) {
      setSelected([r, c]);
    } else if (board[r][c] === 0 && selected) {
      const [sr, sc] = selected;
      const dr = r - sr;
      const dc = c - sc;
      
      if ((Math.abs(dr) === 2 && dc === 0) || (Math.abs(dc) === 2 && dr === 0)) {
        const mr = sr + dr / 2;
        const mc = sc + dc / 2;
        
        if (board[mr][mc] === 1) {
          const newBoard = [...board.map(row => [...row])];
          newBoard[sr][sc] = 0;
          newBoard[mr][mc] = 0;
          newBoard[r][c] = 1;
          setBoard(newBoard);
          setSelected(null);
          
          if (newBoard.flat().filter(cell => cell === 1).length === 1) {
            setWin(true);
          } else if (checkGameOver(newBoard)) {
            setGameOver(true);
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-2 uppercase">Peg Solitaire</h2>
        <p className="text-zinc-500 text-sm">Faqat bitta tosh qolsin.</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[40px] border-8 border-zinc-800 shadow-2xl">
        <div className="grid grid-cols-7 gap-2">
          {board.map((row, r) => row.map((cell, c) => (
            cell === -1 ? <div key={`${r}-${c}`} className="w-10 h-10 sm:w-12 sm:h-12" /> : (
              <motion.button
                key={`${r}-${c}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCellClick(r, c)}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all",
                  cell === 1 ? (selected?.[0] === r && selected?.[1] === c ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-zinc-200") : "bg-zinc-800 shadow-inner"
                )}
              />
            )
          )))}
        </div>
      </div>

      <button onClick={initGame} className="px-8 py-3 bg-zinc-900 rounded-xl flex items-center gap-2">
        <RotateCcw className="w-5 h-5" /> Qayta boshlash
      </button>

      {win && <h2 className="text-3xl font-black text-emerald-500 uppercase">G'alaba!</h2>}
      {gameOver && !win && (
        <div className="text-center">
          <h2 className="text-3xl font-black text-rose-500 uppercase mb-2">Yutqazdingiz!</h2>
          <p className="text-zinc-500">Boshqa yurishlar qolmadi.</p>
        </div>
      )}
    </div>
  );
}
