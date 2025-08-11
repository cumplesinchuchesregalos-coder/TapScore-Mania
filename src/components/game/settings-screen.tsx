
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Globe, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAudio } from "@/context/audio-context";
import { Label } from "@/components/ui/label";

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t, language, setLanguage } = useLanguage();
  const { isMuted, toggleMute } = useAudio();

  const handleLanguageChange = (value: string) => {
    const lang = value as 'en' | 'es';
    if (lang) {
      setLanguage(lang);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card animate-scale-in">
      <header className="flex items-center p-4 border-b shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft />
        </Button>
        <h2 className="text-2xl font-headline font-bold text-center flex-1">{t.settings.title}</h2>
        <div className="w-10"></div>
      </header>
      <div className="flex-1 p-6 space-y-8">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">{t.settings.audio.title}</h3>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <Label htmlFor="mute-button" className="text-lg">{t.settings.audio.sound}</Label>
                <Button id="mute-button" variant="outline" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
            </div>
        </div>
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">{t.settings.language.title}</h3>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <Label htmlFor="language-select" className="text-lg flex items-center gap-2"><Globe/> {t.settings.language.language}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language-select" className="w-[180px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>
    </div>
  );
}
