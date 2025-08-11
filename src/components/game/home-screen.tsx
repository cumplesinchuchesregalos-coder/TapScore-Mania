
"use client";

import { Button } from "@/components/ui/button";
import { Trophy, ShoppingCart, Settings, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Logo } from "./logo";

interface HomeScreenProps {
  onNavigate: (target: "shop" | "modes" | "settings" | "leaderboard") => void;
  highScore: number;
}

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
        <Logo />
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
