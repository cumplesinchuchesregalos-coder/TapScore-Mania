"use client";

import { Button } from "@/components/ui/button";
import { Trophy, ShoppingCart, Settings, Gamepad2 } from "lucide-react";

interface HomeScreenProps {
  onPlay: () => void;
  onShop: () => void;
  highScore: number;
}

export function HomeScreen({ onPlay, onShop, highScore }: HomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-between h-full p-8 bg-card text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground font-semibold text-lg shadow-inner">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>{highScore}</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-6xl sm:text-7xl font-headline font-bold text-primary animate-pulse">
          TapScore
        </h1>
        <p className="text-2xl text-muted-foreground font-headline">Mania</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={onPlay} size="lg" className="h-20 text-3xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          PLAY
        </Button>
        <div className="grid grid-cols-2 gap-4">
            <Button onClick={onShop} variant="secondary" size="lg" className="h-14 text-xl font-semibold rounded-full shadow-md">
                <ShoppingCart className="mr-2 h-6 w-6" />
                Shop
            </Button>
            <Button variant="secondary" size="lg" className="h-14 text-xl font-semibold rounded-full shadow-md">
                <Gamepad2 className="mr-2 h-6 w-6" />
                Modes
            </Button>
        </div>
      </div>
    </div>
  );
}
