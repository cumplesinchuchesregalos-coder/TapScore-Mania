
"use client";

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/audio-context';

// Silent WAV file as a Data URI to prevent "no supported sources" error if no music is provided.
const SILENT_AUDIO_SRC = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

const AudioController = () => {
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playMusic = () => {
      if (audio.paused) {
        audio.play().catch(e => console.error("Error playing music:", e));
      }
      window.removeEventListener('click', playMusic);
      window.removeEventListener('touchstart', playMusic);
    };

    const handlePlayPromise = audio.play();

    if (handlePlayPromise !== undefined) {
      handlePlayPromise.then(() => {
        // Autoplay started!
        window.removeEventListener('click', playMusic);
        window.removeEventListener('touchstart', playMusic);
      }).catch(error => {
        // Autoplay was prevented.
        console.log("Waiting for user interaction to play music.");
        window.addEventListener('click', playMusic, { once: true });
        window.addEventListener('touchstart', playMusic, { once: true });
      });
    }

    return () => {
      window.removeEventListener('click', playMusic);
      window.removeEventListener('touchstart', playMusic);
    };
  }, []);

  return <audio ref={audioRef} src={SILENT_AUDIO_SRC} loop />;
};

export default AudioController;
