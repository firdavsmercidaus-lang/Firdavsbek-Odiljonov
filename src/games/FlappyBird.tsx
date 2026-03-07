import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const BIRD_SIZE = 30;
const GRAVITY = 0.6;
const JUMP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(CANVAS_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number, top: number }[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappy_highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappy_highscore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = () => {
    setBirdY(CANVAS_HEIGHT / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const jump = useCallback(() => {
    if (gameOver) {
      resetGame();
      return;
    }
    if (!gameStarted) setGameStarted(true);
    setVelocity(JUMP);
  }, [gameOver, gameStarted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') jump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const update = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setBirdY(y => {
      const newY = y + velocity;
      if (newY < 0 || newY > CANVAS_HEIGHT - BIRD_SIZE) {
        setGameOver(true);
        return y;
      }
      return newY;
    });
    setVelocity(v => v + GRAVITY);

    setPipes(prevPipes => {
      let newPipes = prevPipes.map(p => ({ ...p, x: p.x - PIPE_SPEED }));
      
      // Remove off-screen pipes
      if (newPipes.length > 0 && newPipes[0].x < -PIPE_WIDTH) {
        newPipes.shift();
        setScore(s => s + 1);
      }

      // Add new pipes
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 200) {
        newPipes.push({
          x: CANVAS_WIDTH,
          top: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50
        });
      }

      // Collision detection
      const birdRect = { x: 50, y: birdY, w: BIRD_SIZE, h: BIRD_SIZE };
      for (const p of newPipes) {
        if (
          birdRect.x < p.x + PIPE_WIDTH &&
          birdRect.x + birdRect.w > p.x &&
          (birdRect.y < p.top || birdRect.y + birdRect.h > p.top + PIPE_GAP)
        ) {
          setGameOver(true);
        }
      }

      return newPipes;
    });
  }, [gameStarted, gameOver, velocity, birdY]);

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

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-12 text-center">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Score</p>
          <p className="text-5xl font-black text-emerald-500">{score}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Best</p>
          <p className="text-5xl font-black text-zinc-300">{highScore}</p>
        </div>
      </div>

      <div 
        onClick={jump}
        className="relative bg-zinc-900 border-4 border-zinc-800 rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {/* Bird */}
        <motion.div
          animate={{ rotate: velocity * 3 }}
          className="absolute w-[30px] h-[30px] bg-yellow-400 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10 flex items-center justify-center text-xl"
          style={{ left: 50, top: birdY }}
        >
          🐥
        </motion.div>

        {/* Pipes */}
        {pipes.map((p, i) => (
          <React.Fragment key={i}>
            <div 
              className="absolute bg-emerald-600 border-x-4 border-emerald-800 rounded-b-xl"
              style={{ left: p.x, top: 0, width: PIPE_WIDTH, height: p.top }}
            />
            <div 
              className="absolute bg-emerald-600 border-x-4 border-emerald-800 rounded-t-xl"
              style={{ left: p.x, top: p.top + PIPE_GAP, width: PIPE_WIDTH, height: CANVAS_HEIGHT - (p.top + PIPE_GAP) }}
            />
          </React.Fragment>
        ))}

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <p className="text-2xl font-black uppercase tracking-widest mb-4">Boshlash uchun bosing</p>
            <p className="text-zinc-400 text-sm">Yoki Probel tugmasini bosing</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
            <h2 className="text-4xl font-black mb-2">O'YIN TUGADI!</h2>
            <p className="text-zinc-400 mb-8">Natija: {score}</p>
            <button
              onClick={(e) => { e.stopPropagation(); resetGame(); }}
              className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl flex items-center gap-2"
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
