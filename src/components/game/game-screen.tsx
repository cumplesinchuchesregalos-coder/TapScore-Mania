
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play, XOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

const CIRCLE_DIAMETER = 60;
const CIRCLE_LIFESPAN = 3000;
const INITIAL_SPAWN_RATE = 1500;
const MAX_MISSES = 3;

interface Circle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

interface GameScreenProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onGameOver: (finalScore: number) => void;
  circleStyle: string;
}

export function GameScreen({ setScore, onGameOver, circleStyle }: GameScreenProps) {
    const { t } = useLanguage();
    const [internalScore, setInternalScore] = useState(0);
    const [circles, setCircles] = useState<Circle[]>([]);
    const [misses, setMisses] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number>();
    const lastSpawnTime = useRef<number>(Date.now());
    const spawnRate = useRef(INITIAL_SPAWN_RATE);

    const handleCircleClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (isPaused) return;

        setCircles(prev => prev.filter(c => c.id !== id));
        const newScore = internalScore + 1;
        setInternalScore(newScore);
        setScore(newScore);

        spawnRate.current = Math.max(400, spawnRate.current - 25);
    };

    const gameLoop = useCallback(() => {
        if (!gameAreaRef.current) {
            animationFrameId.current = requestAnimationFrame(gameLoop);
            return;
        }

        const now = Date.now();

        if (!isPaused) {
            let missedCount = 0;
            const updatedCircles = circles.filter(circle => {
                if (now - circle.createdAt > CIRCLE_LIFESPAN) {
                    missedCount++;
                    return false;
                }
                return true;
            });

            if (missedCount > 0) {
                setCircles(updatedCircles);
                setMisses(prev => Math.min(MAX_MISSES, prev + missedCount));
            }

            if (now - lastSpawnTime.current > spawnRate.current) {
                lastSpawnTime.current = now;
                const { width, height } = gameAreaRef.current.getBoundingClientRect();
                const newCircle: Circle = {
                    id: Date.now() + Math.random(),
                    x: Math.random() * (width - CIRCLE_DIAMETER),
                    y: Math.random() * (height - CIRCLE_DIAMETER - 80) + 80,
                    createdAt: Date.now(),
                };
                setCircles(prev => [...prev, newCircle]);
            }
        }
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [isPaused, circles]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameLoop]);

    useEffect(() => {
        if (misses >= MAX_MISSES) {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            onGameOver(internalScore);
        }
    }, [misses, onGameOver, internalScore]);
    
    return (
        <div ref={gameAreaRef} className="w-full h-full relative bg-background overflow-hidden" onClick={() => !isPaused && setMisses(m => m + 1)}>
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-2xl font-bold font-headline">{t.game.score}: {internalScore}</div>
            <div className="flex items-center gap-2 text-xl font-bold text-destructive">
              <XOctagon />
              <span>{misses}/{MAX_MISSES}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play /> : <Pause />}
            </Button>
          </div>

          {circles.map(circle => (
            <div
              key={circle.id}
              className={`absolute cursor-pointer animate-scale-in transition-all duration-200 hover:scale-110 active:scale-95 ${circleStyle}`}
              style={{
                left: circle.x,
                top: circle.y,
                width: CIRCLE_DIAMETER,
                height: CIRCLE_DIAMETER,
              }}
              onClick={(e) => handleCircleClick(e, circle.id)}
            />
          ))}
          
          {isPaused && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20" onClick={() => setIsPaused(false)}>
              <h2 className="text-6xl font-bold text-white mb-8 animate-pulse font-headline">{t.game.paused}</h2>
              <Button onClick={() => setIsPaused(false)} size="lg" className="rounded-full">{t.game.resume}</Button>
            </div>
          )}
        </div>
    );
}
