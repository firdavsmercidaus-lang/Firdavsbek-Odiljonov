import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Bomb, Flag } from 'lucide-react';
import { cn } from '../lib/utils';

const GRID_SIZE = 10;
const MINES_COUNT = 15;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      setGameOver(true);
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
    } else {
      const floodFill = (row: number, col: number) => {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
        newGrid[row][col].isRevealed = true;
        if (newGrid[row][col].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              floodFill(row + dr, col + dc);
            }
          }
        }
      };
      floodFill(r, c);
    }

    setGrid(newGrid);

    // Check win
    const unrevealedNonMines = newGrid.flat().filter(cell => !cell.isMine && !cell.isRevealed);
    if (unrevealedNonMines.length === 0) {
      setWin(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-12 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Minalar</p>
          <p className="text-4xl font-black text-rose-500">{MINES_COUNT}</p>
        </div>
        <button onClick={initGrid} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-zinc-800 p-2 rounded-2xl border-4 border-zinc-700 shadow-2xl">
        <div 
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {grid.map((row, r) => row.map((cell, c) => (
            <motion.button
              key={`${r}-${c}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all",
                cell.isRevealed 
                  ? (cell.isMine ? "bg-rose-500" : "bg-zinc-900 text-zinc-400") 
                  : "bg-zinc-700 hover:bg-zinc-600 shadow-inner"
              )}
            >
              {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && cell.neighborMines}
              {cell.isRevealed && cell.isMine && <Bomb className="w-5 h-5 text-black" />}
              {!cell.isRevealed && cell.isFlagged && <Flag className="w-5 h-5 text-rose-500" />}
            </motion.button>
          )))}
        </div>
      </div>

      <div className="text-center">
        {gameOver && <h2 className="text-3xl font-black text-rose-500 mb-4 uppercase">Mina portladi!</h2>}
        {win && <h2 className="text-3xl font-black text-emerald-500 mb-4 uppercase">G'alaba!</h2>}
        <p className="text-zinc-500 text-sm">O'ng tugma bilan bayroqcha qo'ying.</p>
      </div>
    </div>
  );
}
