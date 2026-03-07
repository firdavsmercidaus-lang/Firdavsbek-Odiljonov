import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, X, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="text-center">
        <h2 className={cn(
          "text-4xl font-black mb-2 transition-colors",
          winner === 'X' ? "text-rose-500" : winner === 'O' ? "text-blue-500" : "text-white"
        )}>
          {winner === 'Draw' ? "Durang!" : winner ? `${winner} G'olib!` : `${isXNext ? 'X' : 'O'} ning navbati`}
        </h2>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Klassik X-O o'yini</p>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-zinc-900 p-4 rounded-3xl border-4 border-zinc-800 shadow-2xl">
        {board.map((square, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(i)}
            className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center text-5xl transition-all",
              !square && !winner ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-800",
              winningLine?.includes(i) ? (winner === 'X' ? "bg-rose-500/20 border-2 border-rose-500" : "bg-blue-500/20 border-2 border-blue-500") : ""
            )}
          >
            {square === 'X' && <X className="w-12 h-12 text-rose-500 stroke-[3]" />}
            {square === 'O' && <Circle className="w-10 h-10 text-blue-500 stroke-[3]" />}
          </motion.button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-10 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-xl"
      >
        <RotateCcw className="w-5 h-5" />
        Qayta boshlash
      </button>
    </div>
  );
}
