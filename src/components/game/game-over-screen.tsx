
"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { useAudio } from "@/context/audio-context";
import { Award, Home, RotateCw, Users } from "lucide-react";
import { useEffect } from "react";
import { SFX } from "@/lib/sfx";
import type { GameMode } from "@/app/page";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
  gameMode: GameMode;
  finalScores: [number, number] | null;
}

export function GameOverScreen({ score, highScore, onRestart, onHome, gameMode, finalScores }: GameOverScreenProps) {
  const { t } = useLanguage();
  const { playSfx } = useAudio();
  const isNewHighScore = score > 0 && score === highScore && gameMode !== 'duo';
  
  useEffect(() => {
    if (isNewHighScore) {
      playSfx(SFX.combo); // Play a celebratory sound for new high scores
    }
  }, [isNewHighScore, playSfx]);

  const renderDuoResult = () => {
    if (!finalScores) return null;
    const [p1Score, p2Score] = finalScores;
    const winner = p1Score > p2Score ? t.gameOver.duo.player1 : (p2Score > p1Score ? t.gameOver.duo.player2 : t.gameOver.duo.tie);

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-card text-center animate-scale-in">
        <h2 className="text-5xl sm:text-6xl font-headline font-bold text-primary mb-4">{t.gameOver.duo.title}</h2>
        <div className="flex items-center gap-2 text-3xl font-bold text-yellow-500 animate-pulse mb-4">
          <Award className="h-10 w-10" />
          <span>{winner} {t.gameOver.duo.wins}</span>
        </div>

        <div className="bg-muted rounded-lg p-4 mb-8 w-full max-w-xs flex justify-around">
            <div className="text-center">
                <div className="text-lg font-semibold text-blue-500">{t.gameOver.duo.player1}</div>
                <div className="text-4xl font-bold">{p1Score}</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-semibold text-red-500">{t.gameOver.duo.player2}</div>
                <div className="text-4xl font-bold">{p2Score}</div>
            </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button onClick={onRestart} size="lg" className="h-16 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
            <RotateCw className="mr-2 h-6 w-6" />
            {t.gameOver.duo.rematch}
          </Button>
          <Button onClick={onHome} variant="secondary" size="lg" className="h-12 text-lg rounded-full shadow-md">
            <Home className="mr-2 h-5 w-5" />
            {t.gameOver.home}
          </Button>
        </div>
      </div>
    );
  }

  if (gameMode === 'duo') {
      return renderDuoResult();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-card text-center animate-scale-in">
      <h2 className="text-5xl sm:text-6xl font-headline font-bold text-destructive mb-4">{t.gameOver.title}</h2>
      
      {isNewHighScore && (
        <div className="flex items-center gap-2 text-2xl font-bold text-primary animate-pulse mb-4">
          <Award className="h-8 w-8" />
          <span>{t.gameOver.newHighScore}</span>
        </div>
      )}

      <div className="bg-muted rounded-lg p-4 mb-8 w-full max-w-xs">
        <div className="text-xl font-semibold mb-2">{t.gameOver.yourScore}</div>
        <div className="text-5xl font-bold text-primary">{score}</div>
        <div className="border-t my-3"></div>
        <div className="text-md text-muted-foreground">{t.gameOver.highScore}: {highScore}</div>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={onRestart} size="lg" className="h-16 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
          <RotateCw className="mr-2 h-6 w-6" />
          {t.gameOver.retry}
        </Button>
        <Button onClick={onHome} variant="secondary" size="lg" className="h-12 text-lg rounded-full shadow-md">
          <Home className="mr-2 h-5 w-5" />
          {t.gameOver.home}
        </Button>
      </div>
    </div>
  );
}
