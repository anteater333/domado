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

  const startTimer = useCallback(
    (time: number) => {
      timerWorker.postMessage({ command: 'start', time: time });
    },
    [timerWorker],
  );

  const stopTimer = useCallback(() => {
    timerWorker.postMessage({ command: 'stop' });
  }, [timerWorker]);

  return {
    /**
     * 타이머 시작
     * @param time 종료까지 필요한 시간(초)
     */
    startTimer,
    /** 타이머 정지 */
    stopTimer,
  };
};
