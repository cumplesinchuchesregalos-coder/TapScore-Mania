"use client";

import { Button } from "@/components/ui/button";
import { Award, Home, RotateCw } from "lucide-react";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOverScreen({ score, highScore, onRestart, onHome }: GameOverScreenProps) {
  const isNewHighScore = score > 0 && score === highScore;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-card text-center animate-scale-in">
      <h2 className="text-5xl sm:text-6xl font-headline font-bold text-destructive mb-4">GAME OVER</h2>
      
      {isNewHighScore && (
        <div className="flex items-center gap-2 text-2xl font-bold text-primary animate-pulse mb-4">
          <Award className="h-8 w-8" />
          <span>New High Score!</span>
        </div>
      )}

      <div className="bg-muted rounded-lg p-4 mb-8 w-full max-w-xs">
        <div className="text-xl font-semibold mb-2">Your Score</div>
        <div className="text-5xl font-bold text-primary">{score}</div>
        <div className="border-t my-3"></div>
        <div className="text-md text-muted-foreground">High Score: {highScore}</div>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={onRestart} size="lg" className="h-16 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          <RotateCw className="mr-2 h-6 w-6" />
          RETRY
        </Button>
        <Button onClick={onHome} variant="secondary" size="lg" className="h-12 text-lg rounded-full shadow-md">
          <Home className="mr-2 h-5 w-5" />
          Home
        </Button>
      </div>
    </div>
  );
}
