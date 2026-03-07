import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const COLS = 7;
const ROWS = 6;

export default function ConnectFour() {
  const [board, setBoard] = useState<(string | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [isRedNext, setIsRedNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (grid: (string | null)[][]) => {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (grid[r][c] && grid[r][c] === grid[r][c+1] && grid[r][c] === grid[r][c+2] && grid[r][c] === grid[r][c+3]) return grid[r][c];
      }
    }
    // Vertical
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] && grid[r][c] === grid[r+1][c] && grid[r][c] === grid[r+2][c] && grid[r][c] === grid[r+3][c]) return grid[r][c];
      }
    }
    // Diagonal
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (grid[r][c] && grid[r][c] === grid[r+1][c+1] && grid[r][c] === grid[r+2][c+2] && grid[r][c] === grid[r+3][c+3]) return grid[r][c];
        if (grid[r+3][c] && grid[r+3][c] === grid[r+2][c+1] && grid[r+3][c] === grid[r+1][c+2] && grid[r+3][c] === grid[r][c+3]) return grid[r+3][c];
      }
    }
    return null;
  };

  const handleDrop = (c: number) => {
    if (winner) return;

    const newBoard = [...board.map(row => [...row])];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][c]) {
        newBoard[r][c] = isRedNext ? 'Red' : 'Yellow';
        setBoard(newBoard);
        setIsRedNext(!isRedNext);
        const win = checkWinner(newBoard);
        if (win) setWinner(win);
        return;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setIsRedNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h2 className={cn(
          "text-4xl font-black mb-2 transition-colors",
          winner === 'Red' ? "text-rose-500" : winner === 'Yellow' ? "text-yellow-500" : "text-white"
        )}>
          {winner ? `${winner === 'Red' ? 'Qizil' : 'Sariq'} G'olib!` : `${isRedNext ? 'Qizil' : 'Sariq'} navbati`}
        </h2>
      </div>

      <div className="bg-blue-700 p-4 rounded-[40px] border-8 border-blue-800 shadow-2xl">
        <div className="grid grid-cols-7 gap-3">
          {Array(COLS).fill(0).map((_, c) => (
            <button
              key={c}
              onClick={() => handleDrop(c)}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-800/50 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white/20 rounded-full" />
            </button>
          ))}
          {board.map((row, r) => row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-900 rounded-full flex items-center justify-center shadow-inner"
            >
              <AnimatePresence>
                {cell && (
                  <motion.div
                    initial={{ y: -300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                      "w-10 h-10 sm:w-14 sm:h-14 rounded-full shadow-lg",
                      cell === 'Red' ? "bg-rose-500" : "bg-yellow-400"
                    )}
                  />
                )}
              </AnimatePresence>
            </div>
          )))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="px-10 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform"
      >
        <RotateCcw className="w-5 h-5" />
        Qayta boshlash
      </button>
    </div>
  );
}
