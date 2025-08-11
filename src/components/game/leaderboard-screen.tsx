
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface LeaderboardScreenProps {
  onBack: () => void;
  scores: number[];
}

export function LeaderboardScreen({ onBack, scores }: LeaderboardScreenProps) {
  const { t } = useLanguage();
  
  const rankColors = [
    "text-yellow-400", // 1st
    "text-gray-400",  // 2nd
    "text-yellow-600",  // 3rd
    "text-foreground/80", // 4th
    "text-foreground/70", // 5th
  ];

  return (
    <div className="flex flex-col h-full bg-card animate-scale-in">
      <header className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-headline font-bold text-center flex-1">{t.leaderboard.title}</h2>
        <div className="w-10"></div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        {scores.length > 0 ? (
          <ul className="space-y-3">
            {scores.map((score, index) => (
              <li key={index} className="flex items-center justify-between bg-muted/50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <Trophy className={`w-8 h-8 ${rankColors[index] || 'text-muted-foreground'}`} />
                  <span className={`text-2xl font-bold ${rankColors[index] || 'text-muted-foreground'}`}>
                    #{index + 1}
                  </span>
                </div>
                <span className="text-3xl font-bold text-primary">{score}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Trophy className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold">{t.leaderboard.noScores.title}</h3>
            <p>{t.leaderboard.noScores.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
