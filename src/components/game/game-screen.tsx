
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play, Heart, Shield, Gem, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import type { GameMode, Difficulty } from '@/app/page';

const CIRCLE_DIAMETER = 60;

const DIFFICULTY_SETTINGS = {
  easy: {
    initialSpawn: 2000,
    rateDecrement: 15,
  },
  normal: {
    initialSpawn: 1500,
    rateDecrement: 25,
  },
  hard: {
    initialSpawn: 1000,
    rateDecrement: 35,
  },
};

const CIRCLE_TYPES = [
    { type: 'default', color: 'bg-primary', points: 1, lifespan: 2500, probability: 0.5 },
    { type: 'fast', color: 'bg-accent', points: 2, lifespan: 1500, probability: 0.3 },
    { type: 'very_fast', color: 'bg-chart-2', points: 3, lifespan: 1000, probability: 0.15 },
    { type: 'rare', color: 'bg-chart-4', points: 10, lifespan: 800, probability: 0.05, icon: Gem },
];

interface Circle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  type: typeof CIRCLE_TYPES[number];
}

interface FloatingScore {
    id: number;
    x: number;
    y: number;
    points: number;
}

interface GameScreenProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onGameOver: (finalScore: number) => void;
  circleStyle: string;
  gameMode: GameMode;
  difficulty: Difficulty;
}

export function GameScreen({ setScore, onGameOver, circleStyle, gameMode, difficulty }: GameScreenProps) {
    const { t } = useLanguage();
    const [internalScore, setInternalScore] = useState(0);
    const [circles, setCircles] = useState<Circle[]>([]);
    const [misses, setMisses] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [combo, setCombo] = useState(1);
    const [consecutiveHits, setConsecutiveHits] = useState(0);
    const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number>();
    const lastSpawnTime = useRef<number>(Date.now());
    const spawnRate = useRef(DIFFICULTY_SETTINGS[difficulty].initialSpawn);

    const settings = DIFFICULTY_SETTINGS[difficulty];
    const maxMisses = gameMode === 'survival' ? 1 : 3;

    const resetCombo = () => {
        setConsecutiveHits(0);
        setCombo(1);
    }

    const handleCircleClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (isPaused) return;

        const circle = circles.find(c => c.id === id);
        if (!circle) return;

        const pointsGained = circle.type.points * combo;
        const newScore = internalScore + pointsGained;

        setInternalScore(newScore);
        setScore(newScore);

        setFloatingScores(prev => [...prev, {
            id: Date.now(),
            x: circle.x + CIRCLE_DIAMETER / 2,
            y: circle.y,
            points: pointsGained,
        }]);

        setTimeout(() => {
            setFloatingScores(currentScores => currentScores.slice(1));
        }, 1000);

        setCircles(prev => prev.filter(c => c.id !== id));
        
        const newHits = consecutiveHits + 1;
        setConsecutiveHits(newHits);

        if (newHits > 0 && newHits % 5 === 0) {
            setCombo(prev => prev + 1);
        }

        let rateDecrement = settings.rateDecrement;
        if (gameMode === 'survival') {
          rateDecrement *= 1.5;
        }

        spawnRate.current = Math.max(300, spawnRate.current - rateDecrement);
    };
    
    const handleMiss = () => {
        if(isPaused) return;
        setMisses(m => m + 1);
        resetCombo();
    }

    const gameLoop = useCallback(() => {
        if (!gameAreaRef.current) {
            animationFrameId.current = requestAnimationFrame(gameLoop);
            return;
        }

        const now = Date.now();

        if (!isPaused) {
            let missedCount = 0;
            const updatedCircles = circles.filter(circle => {
                if (now - circle.createdAt > circle.type.lifespan) {
                    missedCount++;
                    return false;
                }
                return true;
            });

            if (missedCount > 0) {
                setCircles(updatedCircles);
                setMisses(prev => {
                    const newMisses = prev + missedCount;
                    if (newMisses > prev) {
                        resetCombo();
                    }
                    return Math.min(maxMisses, newMisses);
                });
            }

            if (now - lastSpawnTime.current > spawnRate.current) {
                lastSpawnTime.current = now;
                
                const rand = Math.random();
                let cumulativeProb = 0;
                const circleType = CIRCLE_TYPES.find(ct => {
                    cumulativeProb += ct.probability;
                    return rand <= cumulativeProb;
                }) || CIRCLE_TYPES[0];

                const { width, height } = gameAreaRef.current.getBoundingClientRect();
                const newCircle: Circle = {
                    id: Date.now() + Math.random(),
                    x: Math.random() * (width - CIRCLE_DIAMETER),
                    y: Math.random() * (height - CIRCLE_DIAMETER - 80) + 80,
                    createdAt: Date.now(),
                    type: circleType,
                };
                setCircles(prev => [...prev, newCircle]);
            }
        }
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [isPaused, circles, maxMisses, difficulty]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameLoop]);

    useEffect(() => {
        if (misses >= maxMisses) {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            onGameOver(internalScore);
        }
    }, [misses, onGameOver, internalScore, maxMisses]);
    
    const renderLives = () => {
      if (gameMode === 'survival') {
        return (
          <div className="flex items-center gap-2 text-xl font-bold text-destructive">
            <Shield />
            <span>{maxMisses - misses}/{maxMisses}</span>
          </div>
        )
      }
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: maxMisses }).map((_, i) => (
            <Heart key={i} className={`h-6 w-6 ${i < maxMisses - misses ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
          ))}
        </div>
      )
    }
    
    return (
        <div ref={gameAreaRef} className="w-full h-full relative bg-background overflow-hidden" onClick={handleMiss}>
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-2xl font-bold font-headline flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Gem className="text-primary" />
                <span>{internalScore}</span>
              </div>
              {combo > 1 && (
                <div className="flex items-center gap-1 text-yellow-500 animate-scale-in">
                    <Zap className="h-6 w-6" />
                    <span className="font-bold text-2xl">x{combo}</span>
                </div>
              )}
            </div>
            
            {renderLives()}

            <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play /> : <Pause />}
            </Button>
          </div>

          {floatingScores.map(score => (
              <div
                  key={score.id}
                  className="absolute text-2xl font-bold text-primary animate-float-up"
                  style={{
                      left: score.x,
                      top: score.y,
                      pointerEvents: 'none'
                  }}
              >
                  +{score.points}
              </div>
          ))}

          {circles.map(circle => {
            const Icon = circle.type.icon;
            return (
              <div
                key={circle.id}
                className={`absolute cursor-pointer animate-scale-in transition-all duration-200 hover:scale-110 active:scale-95 rounded-full flex items-center justify-center text-white font-bold text-sm ${circle.type.color}`}
                style={{
                  left: circle.x,
                  top: circle.y,
                  width: CIRCLE_DIAMETER,
                  height: CIRCLE_DIAMETER,
                }}
                onClick={(e) => handleCircleClick(e, circle.id)}
              >
                {Icon ? <Icon className="h-6 w-6" /> : `+${circle.type.points}`}
              </div>
            )
          })}
          
          {isPaused && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20" onClick={() => setIsPaused(false)}>
              <h2 className="text-6xl font-bold text-white mb-8 animate-pulse font-headline">{t.game.paused}</h2>
              <Button onClick={() => setIsPaused(false)} size="lg" className="rounded-full">{t.game.resume}</Button>
            </div>
          )}
        </div>
    );
}
