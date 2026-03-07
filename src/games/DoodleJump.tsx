import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WIDTH = 350;
const HEIGHT = 500;
const PLAYER_SIZE = 40;
const PLATFORM_WIDTH = 60;
const PLATFORM_HEIGHT = 10;
const GRAVITY = 0.4;
const JUMP = -12;

export default function DoodleJump() {
  const [player, setPlayer] = useState({ x: WIDTH / 2, y: HEIGHT - 100, vy: 0 });
  const [platforms, setPlatforms] = useState<{ x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const requestRef = useRef<number | null>(null);
  const keys = useRef<Record<string, boolean>>({});

  const initGame = useCallback(() => {
    const initialPlatforms = [];
    for (let i = 0; i < 6; i++) {
      initialPlatforms.push({
        x: Math.random() * (WIDTH - PLATFORM_WIDTH),
        y: HEIGHT - i * 100
      });
    }
    setPlatforms(initialPlatforms);
    setPlayer({ x: WIDTH / 2, y: HEIGHT - 150, vy: 0 });
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const update = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setPlayer(p => {
      let nx = p.x;
      let ny = p.y + p.vy;
      let nvy = p.vy + GRAVITY;

      if (keys.current['ArrowLeft']) nx -= 5;
      if (keys.current['ArrowRight']) nx += 5;
      
      // Wrap around
      if (nx < -PLAYER_SIZE) nx = WIDTH;
      if (nx > WIDTH) nx = -PLAYER_SIZE;

      // Platform collision
      if (nvy > 0) {
        for (const plat of platforms) {
          if (
            p.x + PLAYER_SIZE > plat.x &&
            p.x < plat.x + PLATFORM_WIDTH &&
            p.y + PLAYER_SIZE <= plat.y &&
            ny + PLAYER_SIZE >= plat.y
          ) {
            nvy = JUMP;
            ny = plat.y - PLAYER_SIZE;
            break;
          }
        }
      }

      // Camera follow
      if (ny < HEIGHT / 2) {
        const diff = HEIGHT / 2 - ny;
        ny = HEIGHT / 2;
        setPlatforms(prev => {
          const next = prev.map(plat => ({ ...plat, y: plat.y + diff }));
          if (next[next.length - 1].y > 100) {
            next.push({
              x: Math.random() * (WIDTH - PLATFORM_WIDTH),
              y: next[next.length - 1].y - 100
            });
            setScore(s => s + 10);
          }
          return next.filter(plat => plat.y < HEIGHT);
        });
      }

      if (ny > HEIGHT) setGameOver(true);

      return { x: nx, y: ny, vy: nvy };
    });
  }, [gameStarted, gameOver, platforms]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if (!gameStarted) setGameStarted(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => keys.current[e.key] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Score</p>
        <p className="text-5xl font-black text-white">{score}</p>
      </div>

      <div 
        className="relative bg-zinc-900 border-4 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* Platforms */}
        {platforms.map((p, i) => (
          <div 
            key={i}
            className="absolute bg-emerald-500 rounded-full shadow-lg"
            style={{ left: p.x, top: p.y, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }}
          />
        ))}

        {/* Player */}
        <motion.div
          animate={{ rotate: player.vy * 2 }}
          className="absolute flex items-center justify-center text-3xl"
          style={{ left: player.x, top: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE }}
        >
          🚀
        </motion.div>

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <p className="text-2xl font-black uppercase tracking-widest mb-4">Boshlash uchun bosing</p>
            <p className="text-zinc-400 text-sm">Yo'nalish tugmalaridan foydalaning</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
            <h2 className="text-4xl font-black mb-2">O'YIN TUGADI!</h2>
            <p className="text-zinc-400 mb-8">Natija: {score}</p>
            <button
              onClick={initGame}
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
