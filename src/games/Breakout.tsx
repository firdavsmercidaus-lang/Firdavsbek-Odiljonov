import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WIDTH = 400;
const HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 4;

export default function Breakout() {
  const [ball, setBall] = useState({ x: WIDTH / 2, y: HEIGHT - 50, dx: 3, dy: -3 });
  const [paddleX, setPaddleX] = useState(WIDTH / 2 - PADDLE_WIDTH / 2);
  const [bricks, setBricks] = useState<{ x: number, y: number, active: boolean, color: string }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const requestRef = useRef<number | null>(null);

  const initBricks = useCallback(() => {
    const colors = ['bg-rose-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-blue-500'];
    const newBricks = [];
    const w = (WIDTH - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS;
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        newBricks.push({
          x: BRICK_GAP + c * (w + BRICK_GAP),
          y: 60 + r * (BRICK_HEIGHT + BRICK_GAP),
          active: true,
          color: colors[r]
        });
      }
    }
    setBricks(newBricks);
  }, []);

  useEffect(() => {
    initBricks();
  }, [initBricks]);

  const resetGame = () => {
    setBall({ x: WIDTH / 2, y: HEIGHT - 50, dx: 3, dy: -3 });
    setPaddleX(WIDTH / 2 - PADDLE_WIDTH / 2);
    initBricks();
    setScore(0);
    setGameOver(false);
    setWin(false);
  };

  const update = useCallback(() => {
    if (gameOver || win) return;

    setBall(b => {
      let nx = b.x + b.dx;
      let ny = b.y + b.dy;
      let ndx = b.dx;
      let ndy = b.dy;

      // Wall bounce
      if (nx < 0 || nx > WIDTH - BALL_SIZE) ndx = -ndx;
      if (ny < 0) ndy = -ndy;

      // Paddle bounce
      if (ny > HEIGHT - PADDLE_HEIGHT - BALL_SIZE && nx + BALL_SIZE > paddleX && nx < paddleX + PADDLE_WIDTH) {
        ndy = -Math.abs(ndy);
        // Add some spin
        const center = paddleX + PADDLE_WIDTH / 2;
        const offset = (nx + BALL_SIZE / 2 - center) / (PADDLE_WIDTH / 2);
        ndx = offset * 5;
      }

      // Brick collision
      let hit = false;
      setBricks(prevBricks => {
        const nextBricks = prevBricks.map(brick => {
          if (brick.active && nx + BALL_SIZE > brick.x && nx < brick.x + (WIDTH / BRICK_COLS) && ny + BALL_SIZE > brick.y && ny < brick.y + BRICK_HEIGHT) {
            hit = true;
            setScore(s => s + 10);
            return { ...brick, active: false };
          }
          return brick;
        });
        return nextBricks;
      });

      if (hit) ndy = -ndy;

      // Game over
      if (ny > HEIGHT) {
        setGameOver(true);
        return b;
      }

      return { x: nx, y: ny, dx: ndx, dy: ndy };
    });

    // Check win
    if (bricks.length > 0 && bricks.every(b => !b.active)) {
      setWin(true);
    }
  }, [paddleX, gameOver, win, bricks]);

  useEffect(() => {
    const loop = () => {
      update();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('breakout-canvas')?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left - PADDLE_WIDTH / 2;
        setPaddleX(Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, x)));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Score</p>
        <p className="text-5xl font-black text-white">{score}</p>
      </div>

      <div 
        id="breakout-canvas"
        className="relative bg-zinc-900 border-4 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl cursor-none"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* Bricks */}
        {bricks.map((brick, i) => brick.active && (
          <div 
            key={i}
            className={cn("absolute rounded-sm shadow-sm", brick.color)}
            style={{ 
              left: brick.x, 
              top: brick.y, 
              width: (WIDTH - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS, 
              height: BRICK_HEIGHT 
            }}
          />
        ))}

        {/* Paddle */}
        <div 
          className="absolute bottom-0 bg-white rounded-t-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          style={{ left: paddleX, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }}
        />

        {/* Ball */}
        <div 
          className="absolute bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
          style={{ left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE }}
        />

        {(gameOver || win) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
            <h2 className="text-4xl font-black mb-2">{win ? "G'ALABA!" : "O'YIN TUGADI!"}</h2>
            <p className="text-zinc-400 mb-8">Natija: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Qayta boshlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
