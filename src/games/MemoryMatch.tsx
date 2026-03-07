import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

const EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🥝', '🍍', '🥑', '🥦', '🥕', '🌽'];

export default function MemoryMatch() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const initGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setTime(0);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && !gameOver) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, gameOver]);

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    if (!isActive) setIsActive(true);

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches(m => m + 1);
          
          if (matches + 1 === EMOJIS.length) {
            setGameOver(true);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      <div className="flex justify-between w-full items-center px-4">
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Harakatlar</p>
            <p className="text-3xl font-black text-white">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Vaqt</p>
            <p className="text-3xl font-black text-white">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Topildi</p>
            <p className="text-3xl font-black text-emerald-500">{matches}/{EMOJIS.length}</p>
          </div>
        </div>
        <button 
          onClick={initGame}
          className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 w-full">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
            className="aspect-square cursor-pointer perspective-1000"
          >
            <div className={cn(
              "relative w-full h-full transition-all duration-500 preserve-3d",
              (card.flipped || card.matched) ? "rotate-y-180" : ""
            )}>
              {/* Front */}
              <div className="absolute inset-0 bg-zinc-900 border-2 border-zinc-800 rounded-2xl backface-hidden flex items-center justify-center">
                <Brain className="w-8 h-8 text-zinc-700" />
              </div>
              {/* Back */}
              <div className={cn(
                "absolute inset-0 border-2 rounded-2xl backface-hidden rotate-y-180 flex items-center justify-center text-4xl",
                card.matched ? "bg-emerald-500/20 border-emerald-500" : "bg-zinc-800 border-zinc-700"
              )}>
                {card.emoji}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {gameOver && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl"
        >
          <h2 className="text-3xl font-black text-emerald-400 mb-2">TABRIKLAYMIZ!</h2>
          <p className="text-zinc-400 mb-6">Siz barcha juftliklarni {moves} ta harakatda topdingiz.</p>
          <button
            onClick={initGame}
            className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Yana o'ynash
          </button>
        </motion.div>
      )}
    </div>
  );
}
