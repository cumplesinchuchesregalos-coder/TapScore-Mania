
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play, Heart, Shield, Gem, Zap, Bomb, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { useAudio } from '@/context/audio-context';
import type { GameMode, Difficulty } from '@/app/page';
import { SFX } from '@/lib/sfx';

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
    { type: 'default', color: 'bg-primary', points: 1, lifespan: 2500, probability: 0.4 },
    { type: 'fast', color: 'bg-accent', points: 2, lifespan: 1500, probability: 0.3 },
    { type: 'sunburst', color: 'bg-chart-1', points: 3, lifespan: 1200, probability: 0.15 },
    { type: 'forest', color: 'bg-chart-2', points: 4, lifespan: 1000, probability: 0.1 },
    { type: 'rare', color: 'bg-chart-4', points: 10, lifespan: 800, probability: 0.05, icon: Gem },
];

const BOMB_TYPE = { type: 'bomb', color: 'bg-destructive', points: 0, lifespan: 3000, icon: Bomb };
const PRECISION_TARGET_TYPE = { type: 'precision_target', color: 'bg-primary', points: 5, lifespan: 2000, icon: Target };
const PRECISION_DECOY_TYPE = { type: 'precision_decoy', color: 'bg-muted-foreground', points: 0, lifespan: 2000 };


interface Circle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  type: typeof CIRCLE_TYPES[number] | typeof BOMB_TYPE | typeof PRECISION_TARGET_TYPE | typeof PRECISION_DECOY_TYPE;
}

interface FloatingScore {
    id: number;
    x: number;
    y: number;
    points: string;
    color: string;
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
    const { playSfx } = useAudio();
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
    
    const showFloatingScore = (points: number, circle: Circle) => {
        setFloatingScores(prev => [...prev, {
            id: Date.now(),
            x: circle.x + CIRCLE_DIAMETER / 2,
            y: circle.y,
            points: `+${points}`,
            color: "text-primary"
        }]);
        setTimeout(() => setFloatingScores(current => current.slice(1)), 1000);
    }

    const handleMiss = (missAmount = 1) => {
        if(isPaused) return;
        setMisses(m => m + missAmount);
        resetCombo();
    }

    const handleCircleClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (isPaused) return;

        const circle = circles.find(c => c.id === id);
        if (!circle) return;

        playSfx(SFX.tap);

        if (gameMode === 'bomb') {
            if (circle.type.type === 'bomb') {
                onGameOver(internalScore);
                return;
            }
        }
        
        if (gameMode === 'precision') {
            if (circle.type.type !== 'precision_target') {
                handleMiss();
                setCircles(prev => prev.filter(c => c.id !== id));
                return;
            }
        }
        
        const pointsGained = circle.type.points * combo;
        const newScore = internalScore + pointsGained;

        setInternalScore(newScore);
        setScore(newScore);

        showFloatingScore(pointsGained, circle);

        setCircles(prev => prev.filter(c => c.id !== id));
        
        const newHits = consecutiveHits + 1;
        setConsecutiveHits(newHits);

        if (newHits > 0 && newHits % 5 === 0) {
            setCombo(prev => {
                const newCombo = prev + 1;
                playSfx(SFX.combo);
                return newCombo;
            });
        }

        let rateDecrement = settings.rateDecrement;
        if (gameMode === 'survival') {
          rateDecrement *= 1.5;
        }

        spawnRate.current = Math.max(300, spawnRate.current - rateDecrement);
    };
    
    const handleGameAreaClick = () => {
        if(isPaused) return;
        if (gameMode !== 'precision') {
            handleMiss();
        }
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
                const isExpired = now - circle.createdAt > circle.type.lifespan;
                if (isExpired) {
                    // In precision, only letting targets disappear is a miss
                    if (gameMode === 'precision' && circle.type.type === 'precision_target') {
                        missedCount++;
                    }
                    // In other modes, any circle disappearing is a miss
                    else if (gameMode !== 'precision' && circle.type.type !== 'bomb') {
                        missedCount++;
                    }
                    return false;
                }
                return true;
            });

            if (missedCount > 0) {
                setCircles(updatedCircles);
                handleMiss(missedCount);
            } else {
                setCircles(updatedCircles);
            }

            if (now - lastSpawnTime.current > spawnRate.current) {
                lastSpawnTime.current = now;
                const { width, height } = gameAreaRef.current.getBoundingClientRect();
                let newCircle: Circle | null = null;
                
                const baseCircle = {
                    id: Date.now() + Math.random(),
                    x: Math.random() * (width - CIRCLE_DIAMETER),
                    y: Math.random() * (height - CIRCLE_DIAMETER - 80) + 80,
                    createdAt: Date.now(),
                };

                if (gameMode === 'bomb') {
                    const type = Math.random() < 0.2 ? BOMB_TYPE : (CIRCLE_TYPES.find(ct => Math.random() <= ct.probability) || CIRCLE_TYPES[0]);
                    newCircle = { ...baseCircle, type };
                } else if (gameMode === 'precision') {
                    const type = Math.random() < 0.4 ? PRECISION_TARGET_TYPE : PRECISION_DECOY_TYPE;
                    newCircle = { ...baseCircle, type };
                } else {
                    const rand = Math.random();
                    let cumulativeProb = 0;
                    const circleType = CIRCLE_TYPES.find(ct => {
                        cumulativeProb += ct.probability;
                        return rand <= cumulativeProb;
                    }) || CIRCLE_TYPES[0];
                    newCircle = { ...baseCircle, type: circleType };
                }

                if (newCircle) {
                    setCircles(prev => [...prev, newCircle!]);
                }
            }
        }
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [isPaused, circles, maxMisses, difficulty, gameMode]);

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
        <div ref={gameAreaRef} className="w-full h-full relative bg-background overflow-hidden" onClick={handleGameAreaClick}>
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
                  className={`absolute text-2xl font-bold ${score.color} animate-float-up`}
                  style={{
                      left: score.x,
                      top: score.y,
                      pointerEvents: 'none'
                  }}
              >
                  {score.points}
              </div>
          ))}

          {circles.map(circle => {
            const Icon = circle.type.icon;
            const finalCircleStyle = circle.type.type === 'default' ? circleStyle : circle.type.color;
            
            return (
              <div
                key={circle.id}
                className={`absolute cursor-pointer animate-scale-in transition-all duration-200 hover:scale-110 active:scale-95 rounded-full flex items-center justify-center text-white font-bold text-sm ${Icon ? circle.type.color : finalCircleStyle}`}
                style={{
                  left: circle.x,
                  top: circle.y,
                  width: CIRCLE_DIAMETER,
                  height: CIRCLE_DIAMETER,
                }}
                onClick={(e) => handleCircleClick(e, circle.id)}
              >
                {Icon ? <Icon className="h-8 w-8" /> : (circle.type.points > 0 ? `+${circle.type.points}`: '')}
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
