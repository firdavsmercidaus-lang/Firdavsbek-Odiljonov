import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  Trophy, 
  History, 
  Star, 
  Filter,
  ArrowLeft,
  Maximize2,
  RotateCcw,
  Play,
  LayoutGrid,
  Zap,
  Brain,
  Hash,
  Grid3X3,
  Bomb,
  Bird,
  Target,
  Type,
  MousePointer2,
  Puzzle,
  CircleDot,
  Lightbulb,
  Dna,
  Layers,
  Dices,
  Compass,
  ArrowUpCircle,
  Keyboard,
  Shapes
} from 'lucide-react';
import { cn } from './lib/utils';

import Snake from './games/Snake';
import Tetris from './games/Tetris';
import Game2048 from './games/Game2048';
import MemoryMatch from './games/MemoryMatch';
import TicTacToe from './games/TicTacToe';
import Minesweeper from './games/Minesweeper';
import Sudoku from './games/Sudoku';
import FlappyBird from './games/FlappyBird';
import Pong from './games/Pong';
import Breakout from './games/Breakout';
import Wordle from './games/Wordle';
import ColorMatch from './games/ColorMatch';
import TowerStack from './games/TowerStack';
import WhackAMole from './games/WhackAMole';
import SimonSays from './games/SimonSays';
import Hangman from './games/Hangman';
import RockPaperScissors from './games/RockPaperScissors';
import Maze from './games/Maze';
import Clicker from './games/Clicker';
import ReactionTime from './games/ReactionTime';
import AimTrainer from './games/AimTrainer';
import TypingSpeed from './games/TypingSpeed';
import Puzzle15 from './games/Puzzle15';
import ConnectFour from './games/ConnectFour';
import LightsOut from './games/LightsOut';
import Mastermind from './games/Mastermind';
import PegSolitaire from './games/PegSolitaire';
import TowerOfHanoi from './games/TowerOfHanoi';
import SlidePuzzle from './games/SlidePuzzle';
import DoodleJump from './games/DoodleJump';

// Game Types
export type GameCategory = 'Arcade' | 'Puzzle' | 'Logic' | 'Action' | 'Classic';

export interface GameMetadata {
  id: string;
  title: string;
  description: string;
  howToPlay: string;
  category: GameCategory;
  icon: React.ReactNode;
  color: string;
  previewImage: string;
  component: React.ComponentType<{ onBack: () => void }>;
}

// Main App Component
export default function App() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All');

  const games: GameMetadata[] = [
    {
      id: 'snake',
      title: "Iloncha (Snake)",
      description: "Klassik iloncha o'yini, neon uslubida.",
      howToPlay: "Yo'nalish tugmalari (Arrow keys) orqali ilonni boshqaring. Ovqatni yeb ball to'plang va o'zingizga urilib ketmang.",
      category: 'Arcade',
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Snake
    },
    {
      id: 'tetris',
      title: "Tetris",
      description: "Bloklarni to'g'ri joylashtiring va qatorlarni yo'qoting.",
      howToPlay: "Bloklarni chapga/o'ngga suring, aylantiring va pastga tushiring. To'liq qatorlarni yig'ib ball to'plang.",
      category: 'Puzzle',
      icon: <LayoutGrid className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Tetris
    },
    {
      id: '2048',
      title: "2048",
      description: "Sonlarni birlashtirib 2048 ga yetib boring.",
      howToPlay: "Bloklarni surish orqali bir xil sonlarni birlashtiring. Maqsad 2048 soniga yetish.",
      category: 'Logic',
      icon: <Hash className="w-6 h-6" />,
      color: 'from-orange-400 to-rose-500',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Game2048
    },
    {
      id: 'memory',
      title: "Xotira (Memory)",
      description: "Juftliklarni toping va xotirangizni sinang.",
      howToPlay: "Kartalarni ochib, bir xil rasmlarni toping. Barcha juftliklarni topishga harakat qiling.",
      category: 'Puzzle',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: MemoryMatch
    },
    {
      id: 'tictactoe',
      title: "X-O (Tic-Tac-Toe)",
      description: "Klassik X-O o'yini, do'stingiz yoki CPU bilan.",
      howToPlay: "Uchta bir xil belgini (X yoki O) bir qatorga, ustunga yoki diagonalga joylashtiring.",
      category: 'Classic',
      icon: <Grid3X3 className="w-6 h-6" />,
      color: 'from-rose-500 to-orange-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: TicTacToe
    },
    {
      id: 'minesweeper',
      title: "Mina (Minesweeper)",
      description: "Minalarni toping va maydonni tozalang.",
      howToPlay: "Minalar bo'lmagan kataklarni oching. Sonlar atrofda nechta mina borligini ko'rsatadi.",
      category: 'Logic',
      icon: <Bomb className="w-6 h-6" />,
      color: 'from-zinc-500 to-zinc-700',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Minesweeper
    },
    {
      id: 'sudoku',
      title: "Sudoku",
      description: "Raqamlarni to'g'ri joylashtiring.",
      howToPlay: "Har bir qator, ustun va 3x3 blokda 1 dan 9 gacha raqamlar takrorlanmasligi kerak.",
      category: 'Logic',
      icon: <Hash className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Sudoku
    },
    {
      id: 'flappy',
      title: "Uchar Qush",
      description: "To'siqlardan o'tib, eng uzoqqa boring.",
      howToPlay: "Sichqoncha yoki Probel orqali qushni uchiring. Quvurlarga urilib ketmang.",
      category: 'Arcade',
      icon: <Bird className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: FlappyBird
    },
    {
      id: 'pong',
      title: "Ping-Pong",
      description: "Klassik stol tennisi o'yini.",
      howToPlay: "Raketkani boshqarib to'pni qaytaring. Raqibingizga gol urishga harakat qiling.",
      category: 'Arcade',
      icon: <CircleDot className="w-6 h-6" />,
      color: 'from-zinc-400 to-zinc-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Pong
    },
    {
      id: 'breakout',
      title: "G'isht Buzar",
      description: "Barcha g'ishtlarni to'p bilan buzing.",
      howToPlay: "To'pni qaytarib, barcha g'ishtlarni yo'qoting. To'pni tushirib yubormang.",
      category: 'Arcade',
      icon: <Shapes className="w-6 h-6" />,
      color: 'from-emerald-400 to-green-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Breakout
    },
    {
      id: 'wordle',
      title: "So'z Top",
      description: "Yashirin so'zni toping.",
      howToPlay: "5 harfli so'zni toping. Ranglar harflar to'g'ri yoki noto'g'ri joydaligini ko'rsatadi.",
      category: 'Puzzle',
      icon: <Keyboard className="w-6 h-6" />,
      color: 'from-zinc-700 to-zinc-900',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Wordle
    },
    {
      id: 'colormatch',
      title: "Rang Moslash",
      description: "Rang nomini to'g'ri tanlang.",
      howToPlay: "Yozilgan so'zning rangi uning ma'nosiga mos kelishini tekshiring.",
      category: 'Logic',
      icon: <Dna className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: ColorMatch
    },
    {
      id: 'tower',
      title: "Minora",
      description: "Bloklarni ustma-ust taxlang.",
      howToPlay: "Bloklarni bir-birining ustiga aniq tushiring. Minora qanchalik baland bo'lsa, shuncha yaxshi.",
      category: 'Arcade',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-cyan-400 to-blue-500',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: TowerStack
    },
    {
      id: 'mole',
      title: "Mole",
      description: "Mollarni urib ball to'plang.",
      howToPlay: "Teshiklardan chiqayotgan mollarni tezda urib ball to'plang.",
      category: 'Arcade',
      icon: <MousePointer2 className="w-6 h-6" />,
      color: 'from-amber-600 to-orange-700',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: WhackAMole
    },
    {
      id: 'simon',
      title: "Simon Says",
      description: "Ketma-ketlikni eslab qoling.",
      howToPlay: "Ranglar va tovushlar ketma-ketligini eslab qoling va ularni qaytaring.",
      category: 'Logic',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-blue-400 to-indigo-500',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: SimonSays
    },
    {
      id: 'hangman',
      title: "Hangman",
      description: "So'zni toping yoki odamcha osiladi.",
      howToPlay: "Harflarni tanlab yashirin so'zni toping. Xatolar soni cheklangan.",
      category: 'Puzzle',
      icon: <Puzzle className="w-6 h-6" />,
      color: 'from-zinc-400 to-zinc-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Hangman
    },
    {
      id: 'rps',
      title: "Tosh-Qaychi-Qog'oz",
      description: "CPU bilan klassik o'yin.",
      howToPlay: "Tosh, qaychi yoki qog'ozni tanlang. Tosh qaychini, qaychi qog'ozni, qog'oz toshni yengadi.",
      category: 'Classic',
      icon: <Dices className="w-6 h-6" />,
      color: 'from-rose-400 to-red-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: RockPaperScissors
    },
    {
      id: 'maze',
      title: "Labirint",
      description: "Chiqish yo'lini toping.",
      howToPlay: "Labirint ichida yo'l topib, marraga yetib boring.",
      category: 'Puzzle',
      icon: <Compass className="w-6 h-6" />,
      color: 'from-emerald-600 to-teal-700',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Maze
    },
    {
      id: 'clicker',
      title: "Clicker",
      description: "Tanga to'plang va rivojlaning.",
      howToPlay: "Tanga ustiga bosing va ko'proq tanga to'plang. Yangilanishlarni sotib oling.",
      category: 'Arcade',
      icon: <MousePointer2 className="w-6 h-6" />,
      color: 'from-yellow-400 to-amber-500',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Clicker
    },
    {
      id: 'reaction',
      title: "Reaksiya Testi",
      description: "Tezligingizni tekshiring.",
      howToPlay: "Ekran yashil bo'lishini kuting va darhol bosing.",
      category: 'Logic',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-rose-500 to-red-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: ReactionTime
    },
    {
      id: 'aim',
      title: "Nishon",
      description: "Nishonlarni aniq urishni mashq qiling.",
      howToPlay: "Paydo bo'layotgan nishonlarni tezda urib ball to'plang.",
      category: 'Action',
      icon: <Target className="w-6 h-6" />,
      color: 'from-red-500 to-rose-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: AimTrainer
    },
    {
      id: 'typing',
      title: "Yozish Tezligi",
      description: "Matnni qanchalik tez yozasiz?",
      howToPlay: "Berilgan matnni xatosiz va tez yozishga harakat qiling.",
      category: 'Classic',
      icon: <Type className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: TypingSpeed
    },
    {
      id: 'puzzle15',
      title: "15-Puzzle",
      description: "Raqamlarni tartib bilan joylang.",
      howToPlay: "Raqamlarni surish orqali 1 dan 15 gacha tartibda joylashtiring.",
      category: 'Logic',
      icon: <Grid3X3 className="w-6 h-6" />,
      color: 'from-zinc-700 to-zinc-900',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Puzzle15
    },
    {
      id: 'connect4',
      title: "To'rtlik",
      description: "To'rtta bir xil rangni birlashtiring.",
      howToPlay: "To'rtta tangangizni bir qatorga (gorizontal, vertikal yoki diagonal) joylashtiring.",
      category: 'Logic',
      icon: <CircleDot className="w-6 h-6" />,
      color: 'from-blue-600 to-indigo-700',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: ConnectFour
    },
    {
      id: 'lightsout',
      title: "Chiroqlar",
      description: "Barcha chiroqlarni o'chirishga harakat qiling.",
      howToPlay: "Chiroqni bossangiz, u va uning atrofidagilar holati o'zgaradi. Maqsad: hammasini o'chirish.",
      category: 'Logic',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: LightsOut
    },
    {
      id: 'mastermind',
      title: "Mastermind",
      description: "Rangli kodni mantiq bilan toping.",
      howToPlay: "Yashirin rangli kodni toping. Maslahatlar sizga qanchalik yaqinligingizni aytadi.",
      category: 'Logic',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-700',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: Mastermind
    },
    {
      id: 'peg',
      title: "Peg Solitaire",
      description: "Faqat bitta tosh qoldiring.",
      howToPlay: "Toshlar ustidan sakrab ularni yo'qoting. Oxirida bitta tosh qolishi kerak.",
      category: 'Logic',
      icon: <CircleDot className="w-6 h-6" />,
      color: 'from-zinc-200 to-zinc-400',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: PegSolitaire
    },
    {
      id: 'hanoi',
      title: "Hanoi Minorasi",
      description: "Disklarni boshqa ustunga o'tkazing.",
      howToPlay: "Disklarni birma-bir boshqa ustunga o'tkazing. Kattasi kichigining ustida bo'lmasligi kerak.",
      category: 'Logic',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: TowerOfHanoi
    },
    {
      id: 'slide',
      title: "Slayd Puzzle",
      description: "Rasmni bo'laklardan yig'ing.",
      howToPlay: "Rasm bo'laklarini surish orqali butun rasmni yig'ing.",
      category: 'Puzzle',
      icon: <Puzzle className="w-6 h-6" />,
      color: 'from-teal-500 to-emerald-600',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: SlidePuzzle
    },
    {
      id: 'doodle',
      title: "Sakrash",
      description: "Yuqoriga sakrab rekord o'rnating.",
      howToPlay: "Platformalardan sakrab yuqoriga ko'tariling. Pastga tushib ketmang.",
      category: 'Arcade',
      icon: <ArrowUpCircle className="w-6 h-6" />,
      color: 'from-emerald-400 to-green-500',
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s',
      component: DoodleJump
    }
  ];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedGame = games.find(g => g.id === selectedGameId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {!selectedGameId ? (
          <motion.div 
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
            {/* Header */}
            <header className="flex flex-col items-center text-center gap-8 mb-16">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-8"
                >
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAX-PIdE_CMDCIT-zLVT9lIbvBK7ZfYcX7oQ&s" 
                    alt="Najot Games Logo" 
                    className="w-32 h-32 rounded-[32px] shadow-2xl shadow-emerald-500/20 border-2 border-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-4"
                >
                  Najot <span className="text-emerald-500">Games</span>
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-zinc-500 text-lg max-w-xl mx-auto"
                >
                  30 ta eng zo'r va chiroyli o'yinlar to'plami. 
                  O'zingizga yoqqanini tanlang va zavqlaning.
                </motion.p>
              </div>
              
              <div className="flex justify-center w-full">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-3 focus-within:border-emerald-500/50 transition-colors">
                  <Search className="w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="O'yin qidirish..."
                    className="bg-transparent border-none outline-none text-sm w-48 md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </header>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {['All', 'Arcade', 'Puzzle', 'Logic', 'Action', 'Classic'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all border",
                    activeCategory === cat 
                      ? "bg-emerald-500 border-emerald-500 text-black" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  )}
                >
                  {cat === 'All' ? 'Barchasi' : cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedGameId(game.id)}
                  className="group relative bg-zinc-900/30 border border-zinc-800 rounded-3xl cursor-pointer hover:border-emerald-500/50 transition-all overflow-hidden"
                >
                  {/* Preview Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={game.previewImage} 
                      alt={game.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  </div>

                  <div className="p-6 relative">
                    <div className={cn(
                      "absolute -top-10 right-6 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg z-10",
                      game.color
                    )}>
                      {game.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">
                        {game.category}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-24">
                <p className="text-zinc-500">Hech qanday o'yin topilmadi.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="game-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedGameId(null)}
                  className="p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="font-bold text-lg">{selectedGame?.title}</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{selectedGame?.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 flex items-center justify-center overflow-auto p-6">
                {selectedGame && (
                  <selectedGame.component onBack={() => setSelectedGameId(null)} />
                )}
              </div>

              {/* Sidebar Info */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/30 p-8 overflow-auto">
                <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">Qanday o'ynaladi?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  {selectedGame?.howToPlay}
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Janr</h4>
                    <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">{selectedGame?.category}</span>
                  </div>
                  <div>
                    <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Tavsif</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">{selectedGame?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
