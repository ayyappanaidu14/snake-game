import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#39ff14';
      ctx.shadowBlur = isHead ? 12 : 8;
      ctx.shadowColor = isHead ? '#ffffff' : '#39ff14';
      ctx.strokeStyle = '#0a0b1e';
      ctx.lineWidth = 1;
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const size = cellSize;

      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative w-full group">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-[10px] text-[#888] uppercase mb-1">Current Score</div>
              <div className="text-[20px] font-[700] text-[#39ff14]">{score.toString().padStart(5, '0')}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[#888] uppercase mb-1">High Score</div>
              <div className="text-[20px] font-[700] text-[#00f3ff]">{highScore.toString().padStart(5, '0')}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(0,243,255,0.1)] hover:text-[#00f3ff] hover:border-[#00f3ff] transition-all"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetGame}
            className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,0,255,0.1)] hover:text-[#ff00ff] hover:border-[#ff00ff] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative aspect-square w-full border-2 border-[#00f3ff] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.2)] bg-[rgba(0,0,0,0.4)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full block"
        />
        
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              {gameOver ? (
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-center space-y-4"
                >
                  <Trophy className="w-16 h-16 text-[#ff00ff] mx-auto drop-shadow-[0_0_15px_#ff00ff]" />
                  <h3 className="text-4xl font-black text-white tracking-tighter">GAME OVER</h3>
                  <p className="text-[#888]">Final Score: {score}</p>
                  <Button 
                    onClick={resetGame}
                    className="bg-[#ff00ff] hover:bg-[#ff00ff]/80 text-white font-bold px-8 py-6 rounded-full shadow-[0_0_15px_#ff00ff]"
                  >
                    TRY AGAIN
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-center space-y-4"
                >
                  <h3 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_#00f3ff]">PAUSED</h3>
                  <p className="text-[#888]">Press Space or Play to resume</p>
                  <Button 
                    onClick={() => setIsPaused(false)}
                    className="bg-[#00f3ff] hover:bg-[#00f3ff]/80 text-[#0a0b1e] font-bold px-8 py-6 rounded-full shadow-[0_0_15px_#00f3ff]"
                  >
                    RESUME
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-[#888] uppercase tracking-widest">
          Use Arrow Keys to Move • Space to Pause
        </p>
      </div>
    </div>
  );
};
