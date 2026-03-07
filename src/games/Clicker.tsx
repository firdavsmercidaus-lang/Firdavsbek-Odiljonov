import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Zap, TrendingUp, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Clicker() {
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setClicks(prev => [...prev, { id, x, y }]);
    setCoins(c => c + multiplier);
    
    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== id));
    }, 1000);
  };

  const buyMultiplier = () => {
    const cost = Math.floor(10 * Math.pow(1.5, multiplier - 1));
    if (coins >= cost) {
      setCoins(c => c - cost);
      setMultiplier(m => m + 1);
    }
  };

  const buyAuto = () => {
    const cost = Math.floor(50 * Math.pow(1.5, autoClickers));
    if (coins >= cost) {
      setCoins(c => c - cost);
      setAutoClickers(a => a + 1);
    }
  };

  React.useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setCoins(c => c + autoClickers);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClickers]);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <Coins className="w-10 h-10 text-yellow-500" />
          <p className="text-7xl font-black tracking-tighter">{Math.floor(coins)}</p>
        </div>
        <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold">Tangalar to'plang</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center w-full justify-center">
        {/* Main Clicker */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.3)] border-8 border-white/20 flex items-center justify-center relative overflow-hidden"
          >
            <Coins className="w-32 h-32 text-white/50" />
            <AnimatePresence>
              {clicks.map(click => (
                <motion.span
                  key={click.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -100, scale: 1.5 }}
                  className="absolute text-3xl font-black text-white pointer-events-none"
                  style={{ left: click.x, top: click.y }}
                >
                  +{multiplier}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Upgrades */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={buyMultiplier}
            disabled={coins < Math.floor(10 * Math.pow(1.5, multiplier - 1))}
            className="group bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between hover:border-yellow-500/50 disabled:opacity-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Kuchaytirgich</p>
                <p className="text-xs text-zinc-500">Hozir: x{multiplier}</p>
              </div>
            </div>
            <p className="font-black text-yellow-500">{Math.floor(10 * Math.pow(1.5, multiplier - 1))}</p>
          </button>

          <button 
            onClick={buyAuto}
            disabled={coins < Math.floor(50 * Math.pow(1.5, autoClickers))}
            className="group bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 disabled:opacity-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Avto-klik</p>
                <p className="text-xs text-zinc-500">Hozir: {autoClickers}/sek</p>
              </div>
            </div>
            <p className="font-black text-emerald-500">{Math.floor(50 * Math.pow(1.5, autoClickers))}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
