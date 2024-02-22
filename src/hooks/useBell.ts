import bellSource from '@/assets/bell.wav';
import { useCallback, useMemo } from 'react';

export const useBell = () => {
  const bellAudio = useMemo(() => {
    return new Audio(bellSource);
  }, []);

  const playBell = useCallback(() => {
    bellAudio.play();
  }, [bellAudio]);

  const stopBell = useCallback(() => {
    bellAudio.pause();
    bellAudio.currentTime = 0;
  }, [bellAudio]);

  return {
    playBell,
    stopBell,
  };
};
