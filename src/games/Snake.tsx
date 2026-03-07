import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current > 100) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-8 max-w-full">
      <div className="flex gap-12 items-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Score</p>
          <p className="text-4xl font-black text-emerald-500">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Best</p>
          <p className="text-4xl font-black text-zinc-400">{highScore}</p>
        </div>
      </div>

      <div 
        className="relative bg-zinc-900 border-4 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          width: 'min(80vw, 400px)', 
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={cn(
              "rounded-sm transition-all duration-100",
              i === 0 ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10" : "bg-emerald-600/80"
            )}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
            <h2 className="text-3xl font-black mb-2">O'YIN TUGADI!</h2>
            <p className="text-zinc-400 mb-8">Sizning natijangiz: {score}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-5 h-5" />
              Qayta boshlash
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
            <p className="text-2xl font-black tracking-widest uppercase">To'xtatildi</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↑</button>
        <div />
        <button onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">←</button>
        <button onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">↓</button>
        <button onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })} className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">→</button>
      </div>

      <p className="text-zinc-600 text-xs hidden md:block">
        Yo'nalishni o'zgartirish uchun yo'nalish tugmalaridan foydalaning. <br/>
        To'xtatish uchun Probel tugmasini bosing.
      </p>
    </div>
  );
}
