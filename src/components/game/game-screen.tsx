
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play, Heart, Shield, Gem, Zap, Bomb, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { useAudio } from '@/context/audio-context';
import type { GameMode, Difficulty } from '@/app/page';
import { SFX } from '@/lib/sfx';
import { cn } from '@/lib/utils';

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
  player?: 1 | 2;
}

interface FloatingScore {
    id: number;
    x: number;
    y: number;
    points: string;
    color: string;
}

interface GameState {
    score: number;
    misses: number;
    combo: number;
    consecutiveHits: number;
}
interface GameScreenProps {
  onGameOver: (finalScore: number, finalScores?: [number, number]) => void;
  circleStyle: string;
  gameMode: GameMode;
  difficulty: Difficulty;
}

export function GameScreen({ onGameOver, circleStyle, gameMode, difficulty }: GameScreenProps) {
    const { t } = useLanguage();
    const { playSfx } = useAudio();
    
    // Single player state
    const [gameState, setGameState] = useState<GameState>({ score: 0, misses: 0, combo: 1, consecutiveHits: 0 });
    
    // Duo mode state
    const [p1State, setP1State] = useState<GameState>({ score: 0, misses: 0, combo: 1, consecutiveHits: 0 });
    const [p2State, setP2State] = useState<GameState>({ score: 0, misses: 0, combo: 1, consecutiveHits: 0 });
    
    const [circles, setCircles] = useState<Circle[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const p1GameAreaRef = useRef<HTMLDivElement>(null);
    const p2GameAreaRef = useRef<HTMLDivElement>(null);
    
    const animationFrameId = useRef<number>();
    const lastSpawnTime = useRef<number>(Date.now());
    const spawnRate = useRef(DIFFICULTY_SETTINGS[difficulty].initialSpawn);

    const settings = DIFFICULTY_SETTINGS[difficulty];
    const maxMisses = gameMode === 'survival' ? 1 : 3;

    const resetCombo = (player?: 1 | 2) => {
        if (gameMode === 'duo') {
            const setState = player === 1 ? setP1State : setP2State;
            setState(s => ({ ...s, combo: 1, consecutiveHits: 0 }));
        } else {
            setGameState(s => ({ ...s, combo: 1, consecutiveHits: 0 }));
        }
    }
    
    const showFloatingScore = (points: number, circle: Circle) => {
        const yOffset = gameMode === 'duo' && circle.player === 2 ? (p2GameAreaRef.current?.offsetTop || 0) : 0;
        setFloatingScores(prev => [...prev, {
            id: Date.now(),
            x: circle.x + CIRCLE_DIAMETER / 2,
            y: circle.y + yOffset,
            points: `+${points}`,
            color: "text-primary"
        }]);
        setTimeout(() => setFloatingScores(current => current.slice(1)), 1000);
    }

    const handleMiss = (missAmount = 1, player?: 1 | 2) => {
        if(isPaused) return;
        playSfx(SFX.miss);
        if (gameMode === 'duo') {
            const setState = player === 1 ? setP1State : setP2State;
            setState(s => ({...s, misses: s.misses + missAmount}));
        } else {
            setGameState(s => ({ ...s, misses: s.misses + missAmount }));
        }
        resetCombo(player);
    }

    const handleCircleClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (isPaused) return;

        const circle = circles.find(c => c.id === id);
        if (!circle) return;

        const isDuo = gameMode === 'duo';
        const player = circle.player;
        const currentState = isDuo ? (player === 1 ? p1State : p2State) : gameState;
        const setState = isDuo ? (player === 1 ? setP1State : setP2State) : setGameState;

        if (gameMode === 'bomb') {
            if (circle.type.type === 'bomb') {
                playSfx(SFX.miss);
                onGameOver(gameState.score);
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
        
        playSfx(SFX.tap);
        const pointsGained = circle.type.points * currentState.combo;

        showFloatingScore(pointsGained, circle);
        
        setState(s => {
            const newScore = s.score + pointsGained;
            const newHits = s.consecutiveHits + 1;
            let newCombo = s.combo;

            if (newHits > 0 && newHits % 5 === 0) {
                newCombo = s.combo + 1;
                playSfx(SFX.combo);
            }
            
            let rateDecrement = settings.rateDecrement;
            if (gameMode === 'survival') {
              rateDecrement *= 1.5;
            }
    
            spawnRate.current = Math.max(300, spawnRate.current - rateDecrement);

            return {...s, score: newScore, consecutiveHits: newHits, combo: newCombo };
        });

        setCircles(prev => prev.filter(c => c.id !== id));
    };
    
    const handleGameAreaClick = (player?: 1 | 2) => {
        if(isPaused) return;
        if (gameMode !== 'precision') {
            handleMiss(1, player);
        }
    }

    const gameLoop = useCallback(() => {
        if (!gameAreaRef.current) {
            animationFrameId.current = requestAnimationFrame(gameLoop);
            return;
        }

        const now = Date.now();
        const isDuo = gameMode === 'duo';

        if (!isPaused) {
            let p1Missed = 0;
            let p2Missed = 0;
            let singleMissed = 0;

            const updatedCircles = circles.filter(circle => {
                const isExpired = now - circle.createdAt > circle.type.lifespan;
                if (isExpired) {
                    if (isDuo) {
                        if (circle.player === 1) p1Missed++;
                        else p2Missed++;
                    } else {
                        if (gameMode === 'precision' && circle.type.type === 'precision_target') {
                            singleMissed++;
                        } else if (gameMode !== 'precision' && circle.type.type !== 'bomb') {
                            singleMissed++;
                        }
                    }
                    return false;
                }
                return true;
            });
            
            if (isDuo) {
                if (p1Missed > 0) handleMiss(p1Missed, 1);
                if (p2Missed > 0) handleMiss(p2Missed, 2);
            } else if (singleMissed > 0) {
                setGameState(s => ({...s, misses: s.misses + singleMissed}));
                resetCombo();
            }
            
            setCircles(updatedCircles);

            if (now - lastSpawnTime.current > spawnRate.current) {
                lastSpawnTime.current = now;
                
                const spawnCircle = (player?: 1 | 2) => {
                    const areaRef = player === 1 ? p1GameAreaRef : (player === 2 ? p2GameAreaRef : gameAreaRef);
                    if (!areaRef.current) return;
                    
                    const { width, height } = areaRef.current.getBoundingClientRect();
                    const topOffset = isDuo ? 0 : 80;

                    let newCircle: Circle | null = null;
                    
                    const baseCircle = {
                        id: Date.now() + Math.random(),
                        x: Math.random() * (width - CIRCLE_DIAMETER),
                        y: Math.random() * (height - CIRCLE_DIAMETER - topOffset) + topOffset,
                        createdAt: Date.now(),
                        player: player,
                    };
                    
                    if (gameMode === 'bomb') {
                        const type = Math.random() < 0.2 ? BOMB_TYPE : (CIRCLE_TYPES.find(ct => Math.random() <= ct.probability) || CIRCLE_TYPES[0]);
                        newCircle = { ...baseCircle, type };
                    } else if (gameMode === 'precision') {
                        const type = Math.random() < 0.4 ? PRECISION_TARGET_TYPE : PRECISION_DECOY_TYPE;
                        newCircle = { ...baseCircle, type };
                    } else { // Classic, Survival, Duo
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

                if (isDuo) {
                    spawnCircle(1);
                    spawnCircle(2);
                } else {
                    spawnCircle();
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
        if (gameMode === 'duo') {
            if(p1State.misses >= maxMisses || p2State.misses >= maxMisses) {
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                onGameOver(Math.max(p1State.score, p2State.score), [p1State.score, p2State.score]);
            }
        } else {
            if (gameState.misses >= maxMisses) {
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                onGameOver(gameState.score);
            }
        }
    }, [gameState, p1State, p2State, onGameOver, maxMisses, gameMode]);
    
    const renderLives = (misses: number) => {
      if (gameMode === 'survival' || gameMode === 'duo') {
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

    const renderHeader = (player?: 1 | 2) => {
        const isDuo = gameMode === 'duo';
        const currentState = isDuo ? (player === 1 ? p1State : p2State) : gameState;
        
        return (
            <div className={cn("absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm z-10", isDuo && "relative")}>
                <div className="text-2xl font-bold font-headline flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Gem className="text-primary" />
                    <span>{currentState.score}</span>
                  </div>
                  {currentState.combo > 1 && (
                    <div className="flex items-center gap-1 text-yellow-500 animate-scale-in">
                        <Zap className="h-6 w-6" />
                        <span className="font-bold text-2xl">x{currentState.combo}</span>
                    </div>
                  )}
                </div>
                
                {renderLives(currentState.misses)}

                {!isDuo &&
                    <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)}>
                      {isPaused ? <Play /> : <Pause />}
                    </Button>
                }
            </div>
        )
    }

    const renderCircles = (player?: 1 | 2) => {
        return circles.filter(c => c.player === player).map(circle => {
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
          })
    }
    
    if (gameMode === 'duo') {
        return (
            <div ref={gameAreaRef} className="w-full h-full flex flex-col relative bg-background overflow-hidden">
                <div className='absolute top-1/2 left-0 right-0 z-20'>
                    <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 bg-card rounded-full border'>
                        {isPaused ? <Play /> : <Pause />}
                    </Button>
                </div>
                <div ref={p1GameAreaRef} className="w-full h-1/2 relative overflow-hidden border-b-4 border-blue-500" onClick={() => handleGameAreaClick(1)}>
                    {renderHeader(1)}
                    {renderCircles(1)}
                </div>
                <div ref={p2GameAreaRef} className="w-full h-1/2 relative overflow-hidden border-t-4 border-red-500" onClick={() => handleGameAreaClick(2)}>
                    {renderHeader(2)}
                    {renderCircles(2)}
                </div>
                
                {/* Floating scores need to be in the main container to be positioned correctly */}
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
                
                {isPaused && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20" onClick={() => setIsPaused(false)}>
                    <h2 className="text-6xl font-bold text-white mb-8 animate-pulse font-headline">{t.game.paused}</h2>
                    <Button onClick={() => setIsPaused(false)} size="lg" className="rounded-full">{t.game.resume}</Button>
                  </div>
                )}
            </div>
        )
    }

    return (
        <div ref={gameAreaRef} className="w-full h-full relative bg-background overflow-hidden" onClick={() => handleGameAreaClick()}>
          {renderHeader()}
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

          {renderCircles(undefined)}
          
          {isPaused && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20" onClick={() => setIsPaused(false)}>
              <h2 className="text-6xl font-bold text-white mb-8 animate-pulse font-headline">{t.game.paused}</h2>
              <Button onClick={() => setIsPaused(false)} size="lg" className="rounded-full">{t.game.resume}</Button>
            </div>
          )}
        </div>
    );
}
