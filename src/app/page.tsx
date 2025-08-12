
"use client";


import { useState, useEffect, useCallback } from "react";
import { HomeScreen } from "@/components/game/home-screen";
import { GameScreen } from "@/components/game/game-screen";
import { GameOverScreen } from "@/components/game/game-over-screen";
import { ShopScreen } from "@/components/game/shop-screen";
import { ModesScreen } from "@/components/game/modes-screen";
import { SettingsScreen } from "@/components/game/settings-screen";
import { LeaderboardScreen } from "@/components/game/leaderboard-screen";
import { SHOP_ITEMS, type ShopItem } from "@/lib/shop-items";
import { Zap } from "lucide-react";
import { LanguageProvider } from "@/context/language-context";
import { AudioProvider } from "@/context/audio-context";
import AudioController from "@/components/game/audio-controller";
import { generateItemImage } from "@/ai/flows/generate-item-image-flow";

export type GameMode = "classic" | "survival" | "precision" | "bomb" | "duo";
export type Difficulty = "easy" | "normal" | "hard";
type GameState = "home" | "game" | "game-over" | "shop" | "modes" | "settings" | "leaderboard";

const MAX_LEADERBOARD_ENTRIES = 5;

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<number[]>([]);
  const [finalScores, setFinalScores] = useState<[number, number] | null>(null);
  const [currency, setCurrency] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>(['style_default']);
  const [activeItem, setActiveItem] = useState<string>('style_default');
  const [hydrated, setHydrated] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [survivalHighScore, setSurvivalHighScore] = useState(0);
  const [shopItems, setShopItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [isGeneratingImages, setIsGeneratingImages] = useState(true);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  useEffect(() => {
    const loadGameData = async () => {
      // Load from localStorage first
      const storedHighScores = localStorage.getItem("tapscore_highScores");
      setHighScores(storedHighScores ? JSON.parse(storedHighScores) : []);
      setCurrency(parseInt(localStorage.getItem("tapscore_currency") || "50", 10));
      setGamesPlayed(parseInt(localStorage.getItem("tapscore_gamesPlayed") || "0", 10));
      setSurvivalHighScore(parseInt(localStorage.getItem("tapscore_survivalHighScore") || "0", 10));
      const storedUnlocked = localStorage.getItem("tapscore_unlockedItems");
      setUnlockedItems(storedUnlocked ? JSON.parse(storedUnlocked) : ['style_default']);
      const storedActive = localStorage.getItem("tapscore_activeItem");
      setActiveItem(storedActive || 'style_default');

      // Generate images for shop items that have a hint
      const imageGenerationPromises = SHOP_ITEMS.map(async (item) => {
        if (item.imageHint) {
          try {
            const result = await generateItemImage({ description: item.imageHint });
            return { ...item, imageUrl: result.imageDataUri };
          } catch (error) {
            console.error(`Failed to generate image for ${item.name}:`, error);
            return item; // Return original item on failure
          }
        }
        return item;
      });

      const updatedItems = await Promise.all(imageGenerationPromises);
      setShopItems(updatedItems);
      setIsGeneratingImages(false);
      setHydrated(true);
    };
    
    loadGameData();
  }, []);

  const handleStartGame = (mode: GameMode, difficulty: Difficulty) => {
    setScore(0);
    setFinalScores(null);
    setGameMode(mode);
    setDifficulty(difficulty);
    setGameState("game");
  };

  const handleGameOver = useCallback((finalScore: number, finalScores?: [number, number]) => {
    setGameState("game-over");
    setScore(finalScore);
    if(finalScores) {
      setFinalScores(finalScores);
    }

    const newCurrency = currency + Math.floor(finalScore / 5);
    setCurrency(newCurrency);
    localStorage.setItem("tapscore_currency", newCurrency.toString());

    if (gameMode !== 'duo') {
      const newHighScores = [...highScores, finalScore]
        .sort((a, b) => b - a)
        .slice(0, MAX_LEADERBOARD_ENTRIES);
      
      setHighScores(newHighScores);
      localStorage.setItem("tapscore_highScores", JSON.stringify(newHighScores));
    }

    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem("tapscore_gamesPlayed", newGamesPlayed.toString());

    if (gameMode === 'survival' && finalScore > survivalHighScore) {
      setSurvivalHighScore(finalScore);
      localStorage.setItem("tapscore_survivalHighScore", finalScore.toString());
    }

  }, [currency, highScores, gameMode, gamesPlayed, survivalHighScore]);

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
  
  const handleNavigate = (target: GameState) => {
    setGameState(target);
  }

  const renderGameState = () => {
    const highScore = highScores[0] || 0;
    const activeItemStyle = shopItems.find(i => i.id === activeItem);

    switch (gameState) {
      case "game":
        return <GameScreen onGameOver={handleGameOver} activeItem={activeItemStyle} gameMode={gameMode} difficulty={difficulty} />;
      case "game-over":
        return <GameOverScreen score={score} highScore={highScore} onRestart={() => handleStartGame(gameMode, difficulty)} onHome={() => setGameState("home")} gameMode={gameMode} finalScores={finalScores} />;
      case "shop":
        return <ShopScreen 
                  currency={currency} 
                  shopItems={shopItems}
                  onBack={() => setGameState("home")}
                  unlockedItems={unlockedItems}
                  activeItem={activeItem}
                  onPurchase={handlePurchase}
                  onEquip={handleEquip}
                  isGeneratingImages={isGeneratingImages}
                />;
      case "modes":
        return <ModesScreen 
                  onBack={() => setGameState("home")} 
                  onSelectMode={handleStartGame} 
                  gamesPlayed={gamesPlayed}
                  survivalHighScore={survivalHighScore}
                />;
      case "settings":
        return <SettingsScreen onBack={() => setGameState("home")} />;
      case "leaderboard":
        return <LeaderboardScreen onBack={() => setGameState("home")} scores={highScores} />;
      case "home":
      default:
        return <HomeScreen onNavigate={handleNavigate} highScore={highScore} />;
    }
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
        <div className="flex flex-col items-center gap-4">
            <Zap className="h-16 w-16 animate-pulse text-primary" />
            <p className="text-muted-foreground animate-pulse">Generando items...</p>
        </div>
      </main>
    );
  }

  return (
    <LanguageProvider>
      <AudioProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-2 sm:p-4 font-body">
          <AudioController />
          <div className="relative w-full max-w-md h-[90vh] max-h-[800px] bg-card rounded-2xl shadow-2xl overflow-hidden border-4 border-primary/20 flex flex-col">
            {renderGameState()}
          </div>
          <footer className="text-center p-4 text-muted-foreground text-sm">
            <p>Built for Fun. Tap away!</p>
          </footer>
        </main>
      </AudioProvider>
    </LanguageProvider>
  );
}
