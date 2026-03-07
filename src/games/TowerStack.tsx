import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WIDTH = 350;
const HEIGHT = 500;
const INITIAL_BLOCK_WIDTH = 150;
const BLOCK_HEIGHT = 40;
const SPEED = 2;

type Block = {
  id: number;
  x: number;
  y: number;
  width: number;
  color: string;
};

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function TowerStack() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [nextId, setNextId] = useState(1);

  const requestRef = useRef<number | null>(null);

  const initGame = useCallback(() => {
    const firstBlock = {
      id: 0,
      x: (WIDTH - INITIAL_BLOCK_WIDTH) / 2,
      y: HEIGHT - BLOCK_HEIGHT,
      width: INITIAL_BLOCK_WIDTH,
      color: COLORS[0]
    };
    setBlocks([firstBlock]);
    setScore(0);
    setGameOver(false);
    setNextId(1);
    spawnBlock(INITIAL_BLOCK_WIDTH, HEIGHT - BLOCK_HEIGHT * 2);
  }, []);

  const spawnBlock = (width: number, y: number) => {
    setCurrentBlock({
      id: nextId,
      x: 0,
      y: y,
      width: width,
      color: COLORS[nextId % COLORS.length]
    });
    setNextId(id => id + 1);
  };

  useEffect(() => {
    initGame();
  }, [initGame]);

  const update = useCallback(() => {
    if (gameOver || !currentBlock) return;

    setCurrentBlock(b => {
      if (!b) return null;
      let nx = b.x + direction * SPEED;
      if (nx < 0 || nx > WIDTH - b.width) {
        setDirection(d => -d);
        nx = b.x;
      }
      return { ...b, x: nx };
    });
  }, [direction, gameOver, currentBlock]);

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

  const handleStack = () => {
    if (gameOver || !currentBlock) return;

    const lastBlock = blocks[blocks.length - 1];
    const left = Math.max(currentBlock.x, lastBlock.x);
    const right = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width);
    const newWidth = right - left;

    if (newWidth <= 0) {
      setGameOver(true);
      return;
    }

    const newBlock = { ...currentBlock, x: left, width: newWidth };
    setBlocks(prev => [...prev, newBlock]);
    setScore(s => s + 1);
    
    // Shift view if needed
    if (newBlock.y < HEIGHT / 2) {
      setBlocks(prev => prev.map(b => ({ ...b, y: b.y + BLOCK_HEIGHT })));
      spawnBlock(newWidth, newBlock.y);
    } else {
      spawnBlock(newWidth, newBlock.y - BLOCK_HEIGHT);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Qavatlar</p>
        <p className="text-5xl font-black text-white">{score}</p>
      </div>

      <div 
        onClick={handleStack}
        className="relative bg-zinc-900 border-4 border-zinc-800 rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* Blocks */}
        {blocks.map((block) => (
          <div 
            key={block.id}
            className="absolute rounded-sm shadow-lg border border-white/10"
            style={{ 
              left: block.x, 
              top: block.y, 
              width: block.width, 
              height: BLOCK_HEIGHT,
              backgroundColor: block.color
            }}
          />
        ))}

        {/* Current Moving Block */}
        {currentBlock && !gameOver && (
          <div 
            className="absolute rounded-sm shadow-lg border border-white/10"
            style={{ 
              left: currentBlock.x, 
              top: currentBlock.y, 
              width: currentBlock.width, 
              height: BLOCK_HEIGHT,
              backgroundColor: currentBlock.color
            }}
          />
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
            <h2 className="text-4xl font-black mb-2">O'YIN TUGADI!</h2>
            <p className="text-zinc-400 mb-8">Natija: {score} qavat</p>
            <button
              onClick={(e) => { e.stopPropagation(); initGame(); }}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Qayta boshlash
            </button>
          </div>
        )}
      </div>
      <p className="text-zinc-500 text-sm">Blokni qo'yish uchun bosing.</p>
    </div>
  );
}
