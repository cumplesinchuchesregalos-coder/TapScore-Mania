
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSfx: (sfxUrl: string) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  sfxVolume: number;
  setSfxVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const MAX_AUDIO_PLAYERS = 10;

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolumeState] = useState(1);
  const [sfxVolume, setSfxVolumeState] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const audioPlayers = useRef<HTMLAudioElement[]>([]);
  const currentPlayerIndex = useRef(0);

  useEffect(() => {
    const storedMute = localStorage.getItem('tapscore_isMuted');
    if (storedMute) {
      setIsMuted(JSON.parse(storedMute));
    }

    const storedMusicVolume = localStorage.getItem('tapscore_musicVolume');
    if (storedMusicVolume) {
      setMusicVolumeState(JSON.parse(storedMusicVolume));
    }

    const storedSfxVolume = localStorage.getItem('tapscore_sfxVolume');
    if (storedSfxVolume) {
      setSfxVolumeState(JSON.parse(storedSfxVolume));
    }
    
    // Initialize a pool of audio players
    for (let i = 0; i < MAX_AUDIO_PLAYERS; i++) {
        const audio = new Audio();
        audioPlayers.current.push(audio);
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

  const setMusicVolume = useCallback((volume: number) => {
    setMusicVolumeState(volume);
    localStorage.setItem('tapscore_musicVolume', JSON.stringify(volume));
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    setSfxVolumeState(volume);
    localStorage.setItem('tapscore_sfxVolume', JSON.stringify(volume));
  }, []);

  const playSfx = useCallback((sfxUrl: string) => {
    if (sfxUrl && !isMuted && audioPlayers.current.length > 0) {
        try {
            const player = audioPlayers.current[currentPlayerIndex.current];
            player.src = sfxUrl;
            player.volume = sfxVolume;
            player.play().catch(e => console.error("Error playing SFX:", (e as Error).message));

            currentPlayerIndex.current = (currentPlayerIndex.current + 1) % MAX_AUDIO_PLAYERS;
        } catch (e) {
            console.error("Caught error playing SFX:", (e as Error).message);
        }
    }
  }, [isMuted, sfxVolume]);
  
  const value = { isMuted, toggleMute, playSfx, musicVolume, setMusicVolume, sfxVolume, setSfxVolume };

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
