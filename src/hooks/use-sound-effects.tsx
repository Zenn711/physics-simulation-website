
import { useState, useEffect, useCallback } from 'react';

interface SoundEffects {
  projectileLaunch: HTMLAudioElement | null;
  pendulumSwing: HTMLAudioElement | null;
  springOscillation: HTMLAudioElement | null;
}

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [sounds, setSounds] = useState<SoundEffects>({
    projectileLaunch: null,
    pendulumSwing: null,
    springOscillation: null
  });

  useEffect(() => {
    // Load sound effects
    const projectileLaunch = new Audio('/sounds/projectile-launch.mp3');
    projectileLaunch.volume = 0.5;
    
    const pendulumSwing = new Audio('/sounds/pendulum-swing.mp3');
    pendulumSwing.volume = 0.3;
    
    const springOscillation = new Audio('/sounds/spring-oscillation.mp3');
    springOscillation.volume = 0.4;
    
    setSounds({
      projectileLaunch,
      pendulumSwing,
      springOscillation
    });
    
    // Try to load the user's preference
    const savedPreference = localStorage.getItem('soundEnabled');
    if (savedPreference) {
      setSoundEnabled(savedPreference === 'true');
    }
    
    // Cleanup
    return () => {
      if (projectileLaunch) projectileLaunch.pause();
      if (pendulumSwing) pendulumSwing.pause();
      if (springOscillation) springOscillation.pause();
    };
  }, []);
  
  const toggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('soundEnabled', newState.toString());
  }, [soundEnabled]);
  
  const playProjectileLaunch = useCallback(() => {
    if (soundEnabled && sounds.projectileLaunch) {
      sounds.projectileLaunch.currentTime = 0;
      sounds.projectileLaunch.play().catch(e => console.error('Error playing sound:', e));
    }
  }, [soundEnabled, sounds.projectileLaunch]);
  
  const playPendulumSwing = useCallback(() => {
    if (soundEnabled && sounds.pendulumSwing) {
      sounds.pendulumSwing.currentTime = 0;
      sounds.pendulumSwing.play().catch(e => console.error('Error playing sound:', e));
    }
  }, [soundEnabled, sounds.pendulumSwing]);
  
  const playSpringOscillation = useCallback(() => {
    if (soundEnabled && sounds.springOscillation) {
      sounds.springOscillation.currentTime = 0;
      sounds.springOscillation.play().catch(e => console.error('Error playing sound:', e));
    }
  }, [soundEnabled, sounds.springOscillation]);
  
  return {
    soundEnabled,
    toggleSound,
    playProjectileLaunch,
    playPendulumSwing,
    playSpringOscillation
  };
}
