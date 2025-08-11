
"use client";

import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/context/audio-context';

const AudioController = () => {
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    // We need to set the source on the client side to ensure it's loaded correctly.
    setAudioSrc("/audio/background-music.mp3");
  }, []);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
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
    
    // Autoplay is often blocked, user interaction is needed
    if (audioRef.current) {
        audioRef.current.play().then(() => {
             window.removeEventListener('click', playMusic);
        }).catch(e => {
            console.log("Waiting for user interaction to play music.");
            window.addEventListener('click', playMusic);
        });
    }


    return () => {
        window.removeEventListener('click', playMusic);
    }
  }, [audioSrc]);

  if (!audioSrc) return null;

  return <audio ref={audioRef} src={audioSrc} loop />;
};

export default AudioController;
