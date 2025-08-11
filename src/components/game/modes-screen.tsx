
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Gamepad2, Shield, Target, Bomb, Lock } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { GameMode, Difficulty } from "@/app/page";
import { Badge } from '@/components/ui/badge';

interface ModesScreenProps {
  onBack: () => void;
  onSelectMode: (mode: GameMode, difficulty: Difficulty) => void;
}

export function ModesScreen({ onBack, onSelectMode }: ModesScreenProps) {
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  const modes = [
    { id: 'classic', icon: Gamepad2, title: t.modes.classic.title, description: t.modes.classic.description, enabled: true },
    { id: 'survival', icon: Shield, title: t.modes.survival.title, description: t.modes.survival.description, enabled: true },
    { id: 'precision', icon: Target, title: t.modes.precision.title, description: t.modes.precision.description, enabled: true },
    { id: 'bomb', icon: Bomb, title: t.modes.bomb.title, description: t.modes.bomb.description, enabled: true },
  ];

  const difficulties: {id: Difficulty, label: string}[] = [
      { id: 'easy', label: t.modes.difficulty.easy },
      { id: 'normal', label: t.modes.difficulty.normal },
      { id: 'hard', label: t.modes.difficulty.hard },
  ]

  const handleModeClick = (mode: GameMode) => {
    if (modes.find(m => m.id === mode)?.enabled) {
      setSelectedMode(current => current === mode ? null : mode);
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
                className={`transition-all ${mode.enabled ? 'cursor-pointer hover:border-primary' : 'opacity-60 bg-muted'}`}
                onClick={() => handleModeClick(mode.id as GameMode)}
              >
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle>{mode.title}</CardTitle>
                        <CardDescription className="text-xs">{mode.description}</CardDescription>
                    </div>
                    {!mode.enabled && (
                      <div className="flex flex-col items-center gap-1">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                        <Badge variant="outline">{t.modes.comingSoon}</Badge>
                      </div>
                    )}
                </CardHeader>
                {selectedMode === mode.id && mode.enabled && (
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
