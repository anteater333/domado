import { useCallback, useEffect, useMemo } from 'react';
import TimerWorker from '@/workers/timer.worker.ts?worker';

/**
 * @param tikCallback 타이머 1초마다 실행될 콜백
 * @returns
 */
export const useTimer = (tikCallback: () => void) => {
  const timerWorker = useMemo(() => {
    return new TimerWorker({ name: 'domadoTimer' });
  }, []);

  useEffect(() => {
    const timerTikHandler = () => {
      tikCallback();
    };

    timerWorker.addEventListener('message', timerTikHandler);

    return () => {
      timerWorker.removeEventListener('message', timerTikHandler);
    };
  }, [tikCallback, timerWorker]);

  const startTimer = useCallback(() => {
    timerWorker.postMessage('start');
  }, [timerWorker]);

  const stopTimer = useCallback(() => {
    timerWorker.postMessage('stop');
  }, [timerWorker]);

  return {
    /** 타이머 시작 */
    startTimer,
    /** 타이머 정지 */
    stopTimer,
  };
};
