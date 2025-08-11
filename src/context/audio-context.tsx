
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (sfxUrl: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const MAX_AUDIO_PLAYERS = 10;

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const audioPlayers = useRef<HTMLAudioElement[]>([]);
  const currentPlayerIndex = useRef(0);

  useEffect(() => {
    const storedMute = localStorage.getItem('tapscore_isMuted');
    if (storedMute) {
      setIsMuted(JSON.parse(storedMute));
    }
    
    // Initialize a pool of audio players
    for (let i = 0; i < MAX_AUDIO_PLAYERS; i++) {
        audioPlayers.current.push(new Audio());
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
    if (!isMuted && audioPlayers.current.length > 0) {
        const player = audioPlayers.current[currentPlayerIndex.current];
        player.src = sfxUrl;
        player.play().catch(e => console.error("Error playing SFX:", e));

        currentPlayerIndex.current = (currentPlayerIndex.current + 1) % MAX_AUDIO_PLAYERS;
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
