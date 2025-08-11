
"use client";

import { Button } from "@/components/ui/button";
import { Trophy, ShoppingCart, Settings, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface HomeScreenProps {
  onNavigate: (target: "shop" | "modes" | "settings" | "leaderboard") => void;
  highScore: number;
}

const TappingIcon = () => (
    <div className="relative w-20 h-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 100 100" className="w-24 h-24">
            <circle cx="50" cy="50" r="40" className="fill-primary" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 animate-bounce">
        <svg viewBox="0 0 100 100" className="w-12 h-12 -rotate-45">
            <path d="M73.5,49.4l-1.9-0.4c-1.3-0.3-2.3-1.4-2.6-2.7L68,41.5c-0.6-2.7-3.2-4.5-5.9-4.2l-4.9,0.5c-1.4,0.2-2.8-0.5-3.6-1.6L50,30.5c-1.9-2.5-5.6-2.5-7.5,0l-3.6,5.7c-0.8,1.2-2.2,1.8-3.6,1.6l-4.9-0.5c-2.7-0.3-5.3,1.5-5.9,4.2l-1.1,4.8c-0.3,1.3-1.3,2.4-2.6,2.7l-1.9,0.4c-2.8,0.6-4.4,3.7-3.4,6.3l2.1,5.6c0.7,1.8,2.2,3.2,4.1,3.6l3.8,0.8c1.4,0.3,2.5,1.3,2.9,2.6l1.5,5.1c0.8,2.7,3.6,4.4,6.3,3.7l4.5-1.1c1.4-0.3,2.8,0.2,3.8,1.2L50,85.5c2.1,2.1,5.6,2.1,7.8,0l4.7-4.7c1-1,2.4-1.5,3.8-1.2l4.5,1.1c2.7,0.7,5.5-1,6.3-3.7l1.5-5.1c0.4-1.3,1.5-2.3,2.9-2.6l3.8-0.8c1.9-0.4,3.4-1.8,4.1-3.6l2.1-5.6C77.9,53,76.3,50,73.5,49.4z" className="fill-foreground" />
        </svg>
      </div>
    </div>
);

export function HomeScreen({ onNavigate, highScore }: HomeScreenProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-between h-full p-8 bg-card text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground font-semibold text-lg shadow-inner">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>{highScore}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onNavigate("settings")}>
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <TappingIcon />
        <h1 className="text-6xl sm:text-7xl font-headline font-bold text-primary animate-pulse mt-4">
          {t.home.title}
        </h1>
        <p className="text-2xl text-muted-foreground font-headline">{t.home.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={() => onNavigate("modes")} size="lg" className="h-20 text-3xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          {t.home.play}
        </Button>
        <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => onNavigate("shop")} variant="secondary" size="lg" className="h-14 text-xl font-semibold rounded-full shadow-md">
                <ShoppingCart className="mr-2 h-6 w-6" />
                {t.home.shop}
            </Button>
            <Button onClick={() => onNavigate("leaderboard")} variant="secondary" size="lg" className="h-14 text-xl font-semibold rounded-full shadow-md">
                <Trophy className="mr-2 h-6 w-6" />
                {t.home.ranking}
            </Button>
        </div>
      </div>
    </div>
  );
}
