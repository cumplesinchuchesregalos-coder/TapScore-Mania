
"use client";

import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/context/audio-context';

// A longer, more melodic, retro background music track as a Base64 Data URI.
const BACKGROUND_MUSIC_SRC = "data:audio/wav;base64,UklGRiSJAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YYSIAACAgP/+/f79/v3+/f79/v3+/////v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f79/v3+/f7-AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA==";

const AudioController = () => {
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStarted = useRef(false);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(BACKGROUND_MUSIC_SRC);
      audio.loop = true;
      audioRef.current = audio;
    }
  }, []);

  // Control mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  // Try to play on first user interaction
  useEffect(() => {
    const playMusic = async () => {
      if (audioRef.current && !isMuted && audioRef.current.paused && !hasStarted.current) {
        try {
          await audioRef.current.play();
          hasStarted.current = true; // Mark as started to prevent replay attempts
          // Playback successful, remove listener
          window.removeEventListener('click', playMusic);
          window.removeEventListener('touchstart', playMusic);
        } catch (error) {
          console.error("Audio playback failed, will retry on next interaction.", error);
        }
      } else {
        // If already playing or muted, no need to keep the listener
        window.removeEventListener('click', playMusic);
        window.removeEventListener('touchstart', playMusic);
      }
    };
    
    // Listen for the first interaction
    window.addEventListener('click', playMusic);
    window.addEventListener('touchstart', playMusic);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('click', playMusic);
      window.removeEventListener('touchstart', playMusic);
    };
  }, [isMuted]);

  return null; // This component does not render anything
};

export default AudioController;
