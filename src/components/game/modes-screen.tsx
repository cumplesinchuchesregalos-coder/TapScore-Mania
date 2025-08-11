
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Gamepad2, Shield, Target, Bomb, Lock, Check, Users } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { GameMode, Difficulty } from "@/app/page";

interface ModesScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameMode, difficulty: Difficulty) => void;
  gamesPlayed: number;
  survivalHighScore: number;
}

export function ModesScreen({ onBack, onSelectMode, gamesPlayed, survivalHighScore }: ModesScreenProps) {
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const precisionUnlocked = gamesPlayed >= 3;
  const bombUnlocked = survivalHighScore >= 50;

  const modes = [
    { id: 'classic', icon: Gamepad2, title: t.modes.classic.title, description: t.modes.classic.description, enabled: true },
    { id: 'survival', icon: Shield, title: t.modes.survival.title, description: t.modes.survival.description, enabled: true },
    { id: 'duo', icon: Users, title: t.modes.duo.title, description: t.modes.duo.description, enabled: true },
    { id: 'precision', icon: Target, title: t.modes.precision.title, description: t.modes.precision.description, enabled: precisionUnlocked, unlockCondition: t.modes.unlockConditions.precision },
    { id: 'bomb', icon: Bomb, title: t.modes.bomb.title, description: t.modes.bomb.description, enabled: bombUnlocked, unlockCondition: t.modes.unlockConditions.bomb },
  ];

  const difficulties: {id: Difficulty, label: string}[] = [
      { id: 'easy', label: t.modes.difficulty.easy },
      { id: 'normal', label: t.modes.difficulty.normal },
      { id: 'hard', label: t.modes.difficulty.hard },
  ]

  const handleModeClick = (modeId: GameMode) => {
    const mode = modes.find(m => m.id === modeId);
    if (mode?.enabled) {
      if (mode.id === 'duo') {
        onSelectMode('duo', 'normal'); // Duo mode doesn't need difficulty selection
      } else {
        setSelectedMode(current => current === modeId ? null : modeId);
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-card animate-scale-in">
      <header className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-headline font-bold text-center flex-1">{t.modes.title}</h2>
        <div className="w-10"></div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {modes.map(mode => {
            const Icon = mode.icon;
            return (
              <Card 
                key={mode.id} 
                className={`transition-all ${mode.enabled ? 'cursor-pointer hover:border-primary' : 'opacity-70 bg-muted/50'}`}
                onClick={() => handleModeClick(mode.id as GameMode)}
              >
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                    <div className="bg-primary/10 p-3 rounded-full mt-2">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle>{mode.title}</CardTitle>
                        <CardDescription className="text-xs leading-tight">{mode.enabled ? mode.description : mode.unlockCondition}</CardDescription>
                    </div>
                    <div className="p-2">
                      {mode.enabled ? <Check className="w-6 h-6 text-green-500" /> : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                </CardHeader>
                {selectedMode === mode.id && mode.id !== 'duo' && mode.enabled && (
                    <CardFooter className="flex justify-around bg-muted/50 p-2">
                        {difficulties.map(d => (
                            <Button 
                                key={d.id}
                                variant="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectMode(mode.id as GameMode, d.id)
                                }}
                            >
                                {d.label}
                            </Button>
                        ))}
                    </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
