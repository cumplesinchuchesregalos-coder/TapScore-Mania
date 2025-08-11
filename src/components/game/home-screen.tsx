
"use client";

import { Button } from "@/components/ui/button";
import { Trophy, ShoppingCart, Settings, Gamepad2, HandMetal } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface HomeScreenProps {
  onPlay: () => void;
  onShop: () => void;
  highScore: number;
}

const TappingIcon = () => (
  <div className="relative inline-block w-16 h-16">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full" />
    <HandMetal className="absolute top-0 right-0 w-8 h-8 text-foreground transform -rotate-45" />
  </div>
);

export function HomeScreen({ onPlay, onShop, highScore }: HomeScreenProps) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-between h-full p-8 bg-card text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground font-semibold text-lg shadow-inner">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>{highScore}</span>
        </div>
        <div className="flex gap-2">
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'es')}>
              <SelectTrigger className="w-auto gap-2 bg-muted/50 rounded-full shadow-inner border-0">
                  <Globe className="w-5 h-5" />
                  <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-6 h-6" />
            </Button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <TappingIcon />
        <h1 className="text-6xl sm:text-7xl font-headline font-bold text-primary animate-pulse mt-4">
          {t.home.title}
        </h1>
        <p className="text-2xl text-muted-foreground font-headline">{t.home.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={onPlay} size="lg" className="h-20 text-3xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          {t.home.play}
        </Button>
        <div className="grid grid-cols-2 gap-4">
            <Button onClick={onShop} variant="secondary" size="lg" className="h-14 text-xl font-semibold rounded-full shadow-md">
                <ShoppingCart className="mr-2 h-6 w-6" />
                {t.home.shop}
            </Button>
            <Button variant="secondary" size="lg" className="h-14 text-xl font-semibold rounded-full shadow-md">
                <Gamepad2 className="mr-2 h-6 w-6" />
                {t.home.modes}
            </Button>
        </div>
      </div>
    </div>
  );
}
