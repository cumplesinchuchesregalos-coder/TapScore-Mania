
"use client";

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/audio-context';

const AudioController = () => {
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(e => {
        // Autoplay is often blocked, user interaction is needed
        console.log("Waiting for user interaction to play music.");
      });
    }
  }, [isMuted]);

  // This effect ensures music starts after first user interaction
  useEffect(() => {
    const playMusic = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Error playing music:", e));
      }
      window.removeEventListener('click', playMusic);
    }

    window.addEventListener('click', playMusic);

    return () => {
        window.removeEventListener('click', playMusic);
    }
  }, []);

  return <audio ref={audioRef} src="/audio/background-music.mp3" loop />;
};

export default AudioController;
