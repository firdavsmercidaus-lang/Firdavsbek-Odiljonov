import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper to generate a Sudoku puzzle (simplified)
const generateSudoku = () => {
  const board = Array(9).fill(0).map(() => Array(9).fill(0));
  // Very basic solver/generator for demo
  const fill = (r: number, c: number): boolean => {
    if (c === 9) { r++; c = 0; }
    if (r === 9) return true;
    const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
    for (let n of nums) {
      if (isValid(board, r, c, n)) {
        board[r][c] = n;
        if (fill(r, c + 1)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  };
  fill(0, 0);
  
  // Remove some numbers
  const puzzle = board.map(row => [...row]);
  for (let i = 0; i < 40; i++) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    puzzle[r][c] = 0;
  }
  return { puzzle, solution: board };
};

const isValid = (board: number[][], r: number, c: number, n: number) => {
  for (let i = 0; i < 9; i++) if (board[r][i] === n || board[i][c] === n) return false;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[br + i][bc + j] === n) return false;
  return true;
};

export default function Sudoku() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const initGame = useCallback(() => {
    const { puzzle, solution } = generateSudoku();
    setGrid(puzzle);
    setInitialGrid(puzzle.map(row => [...row]));
    setSolution(solution);
    setSelected(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r][c] === 0) setSelected([r, c]);
  };

  const handleInput = (n: number) => {
    if (!selected) return;
    const [r, c] = selected;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c] = n;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full items-center">
        <h2 className="text-3xl font-black">SUDOKU</h2>
        <button onClick={initGame} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-zinc-800 p-1 rounded-xl border-4 border-zinc-700 shadow-2xl">
        <div className="grid grid-cols-9 grid-rows-9 bg-zinc-700 gap-px">
          {grid.map((row, r) => row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={cn(
                "w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-bold transition-all",
                (r % 3 === 0 && r !== 0) ? "border-t-2 border-zinc-500" : "",
                (c % 3 === 0 && c !== 0) ? "border-l-2 border-zinc-500" : "",
                initialGrid[r][c] !== 0 ? "bg-zinc-900 text-zinc-400" : "bg-zinc-800 text-white",
                selected?.[0] === r && selected?.[1] === c ? "bg-emerald-500 text-black" : "hover:bg-zinc-700"
              )}
            >
              {cell !== 0 && cell}
            </button>
          )))}
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => handleInput(n)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-900 rounded-xl font-bold hover:bg-emerald-500 hover:text-black transition-all"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleInput(0)}
          className="col-span-2 sm:col-span-1 bg-zinc-900 rounded-xl font-bold hover:bg-rose-500 transition-all"
        >
          C
        </button>
      </div>
    </div>
  );
}
