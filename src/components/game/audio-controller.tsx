
"use client";

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/audio-context';

// This component is currently only responsible for reacting to mute changes for SFX.
// The background music functionality has been removed to prevent errors.
const AudioController = () => {
  const { isMuted } = useAudio();
  
  // This effect ensures that if we were to have a persistent audio element,
  // its mute state would be updated. For now, it doesn't do much but is
  // harmless and good for future-proofing.
  useEffect(() => {
    // Future background music element could be controlled here.
  }, [isMuted]);

  return null; // No UI needed for this controller.
};

export default AudioController;
