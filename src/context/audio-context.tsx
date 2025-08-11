
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (sfxUrl: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedMute = localStorage.getItem('tapscore_isMuted');
    if (storedMute) {
      setIsMuted(JSON.parse(storedMute));
    }
    setHydrated(true);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(current => {
      const newState = !current;
      localStorage.setItem('tapscore_isMuted', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const playSfx = useCallback((sfxUrl: string) => {
    if (!isMuted) {
      const audio = new Audio(sfxUrl);
      audio.play().catch(e => console.error("Error playing SFX:", e));
    }
  }, [isMuted]);
  
  const value = { isMuted, toggleMute, playSfx };

  if (!hydrated) {
      return null;
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
