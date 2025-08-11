
"use client";

import { useState, useEffect, useCallback } from "react";
import { HomeScreen } from "@/components/game/home-screen";
import { GameScreen } from "@/components/game/game-screen";
import { GameOverScreen } from "@/components/game/game-over-screen";
import { ShopScreen } from "@/components/game/shop-screen";
import { SHOP_ITEMS, type ShopItem } from "@/lib/shop-items";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { LanguageProvider } from "@/context/language-context";

type GameState = "home" | "game" | "game-over" | "shop";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currency, setCurrency] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['style_default']);
  const [activeItem, setActiveItem] = useState<string>('style_default');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHighScore(parseInt(localStorage.getItem("tapscore_highScore") || "0", 10));
    setCurrency(parseInt(localStorage.getItem("tapscore_currency") || "50", 10));
    setUnlockedItems(JSON.parse(localStorage.getItem("tapscore_unlockedItems") || "[\"style_default\"]"));
    setActiveItem(localStorage.getItem("tapscore_activeItem") || "style_default");
    setHydrated(true);
  }, []);

  const handleStartGame = () => {
    setScore(0);
    setGameState("game");
  };

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState("game-over");
    const newCurrency = currency + Math.floor(finalScore / 5);
    setCurrency(newCurrency);
    localStorage.setItem("tapscore_currency", newCurrency.toString());

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem("tapscore_highScore", finalScore.toString());
    }
  }, [currency, highScore]);

  const handlePurchase = (item: ShopItem) => {
    if (currency >= item.price && !unlockedItems.includes(item.id)) {
      const newCurrency = currency - item.price;
      setCurrency(newCurrency);
      localStorage.setItem("tapscore_currency", newCurrency.toString());

      const newUnlockedItems = [...unlockedItems, item.id];
      setUnlockedItems(newUnlockedItems);
      localStorage.setItem("tapscore_unlockedItems", JSON.stringify(newUnlockedItems));
    }
  };

  const handleEquip = (itemId: string) => {
    if (unlockedItems.includes(itemId)) {
      setActiveItem(itemId);
      localStorage.setItem("tapscore_activeItem", itemId);
    }
  };
  
  const activeItemStyle = SHOP_ITEMS.find(i => i.id === activeItem)?.className || 'bg-primary rounded-full';

  const renderGameState = () => {
    switch (gameState) {
      case "game":
        return <GameScreen setScore={setScore} onGameOver={handleGameOver} circleStyle={activeItemStyle} />;
      case "game-over":
        return <GameOverScreen score={score} highScore={highScore} onRestart={handleStartGame} onHome={() => setGameState("home")} />;
      case "shop":
        return <ShopScreen 
                  currency={currency} 
                  onBack={() => setGameState("home")}
                  unlockedItems={unlockedItems}
                  activeItem={activeItem}
                  onPurchase={handlePurchase}
                  onEquip={handleEquip}
                />;
      case "home":
      default:
        return <HomeScreen onPlay={handleStartGame} onShop={() => setGameState("shop")} highScore={highScore} />;
    }
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Zap className="h-16 w-16 animate-pulse text-primary" />
      </main>
    );
  }

  return (
    <LanguageProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-2 sm:p-4 font-body">
        <div className="relative w-full max-w-md h-[90vh] max-h-[800px] bg-card rounded-2xl shadow-2xl overflow-hidden border-4 border-primary/20 flex flex-col">
          {renderGameState()}
        </div>
        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p>Built for Fun. Tap away!</p>
        </footer>
      </main>
    </LanguageProvider>
  );
}
