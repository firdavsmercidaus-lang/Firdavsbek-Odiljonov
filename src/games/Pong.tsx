import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WIDTH = 600;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;

export default function Pong() {
  const [ball, setBall] = useState({ x: WIDTH / 2, y: HEIGHT / 2, dx: 4, dy: 4 });
  const [paddle1, setPaddle1] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [paddle2, setPaddle2] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const requestRef = useRef<number | null>(null);

  const update = useCallback(() => {
    if (gameOver) return;

    setBall(b => {
      let nx = b.x + b.dx;
      let ny = b.y + b.dy;
      let ndx = b.dx;
      let ndy = b.dy;

      // Wall bounce
      if (ny < 0 || ny > HEIGHT - BALL_SIZE) ndy = -ndy;

      // Paddle bounce
      if (nx < PADDLE_WIDTH && ny + BALL_SIZE > paddle1 && ny < paddle1 + PADDLE_HEIGHT) {
        ndx = Math.abs(ndx) + 0.5;
        nx = PADDLE_WIDTH;
      }
      if (nx > WIDTH - PADDLE_WIDTH - BALL_SIZE && ny + BALL_SIZE > paddle2 && ny < paddle2 + PADDLE_HEIGHT) {
        ndx = -(Math.abs(ndx) + 0.5);
        nx = WIDTH - PADDLE_WIDTH - BALL_SIZE;
      }

      // Score
      if (nx < 0) {
        setScore2(s => s + 1);
        return { x: WIDTH / 2, y: HEIGHT / 2, dx: 4, dy: 4 };
      }
      if (nx > WIDTH) {
        setScore1(s => s + 1);
        return { x: WIDTH / 2, y: HEIGHT / 2, dx: -4, dy: 4 };
      }

      return { x: nx, y: ny, dx: ndx, dy: ndy };
    });

    // AI for paddle 2
    setPaddle2(p => {
      const target = ball.y - PADDLE_HEIGHT / 2;
      const diff = target - p;
      return p + diff * 0.1;
    });
  }, [ball.y, paddle1, paddle2, gameOver]);

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
      const rect = document.getElementById('pong-canvas')?.getBoundingClientRect();
      if (rect) {
        const y = e.clientY - rect.top - PADDLE_HEIGHT / 2;
        setPaddle1(Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, y)));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-24 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Player</p>
          <p className="text-6xl font-black text-white">{score1}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">CPU</p>
          <p className="text-6xl font-black text-zinc-600">{score2}</p>
        </div>
      </div>

      <div 
        id="pong-canvas"
        className="relative bg-zinc-900 border-4 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl cursor-none"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-zinc-800 -translate-x-1/2" />

        {/* Paddles */}
        <div 
          className="absolute left-0 bg-white rounded-r-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          style={{ top: paddle1, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }}
        />
        <div 
          className="absolute right-0 bg-zinc-600 rounded-l-lg"
          style={{ top: paddle2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT }}
        />

        {/* Ball */}
        <div 
          className="absolute bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
          style={{ left: ball.x, top: ball.y, width: BALL_SIZE, height: BALL_SIZE }}
        />
      </div>

      <p className="text-zinc-500 text-sm">Sichqoncha bilan raketkani boshqaring.</p>
    </div>
  );
}
