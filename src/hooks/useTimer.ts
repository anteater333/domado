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
    const timerTikHandler = (event: { data: 'tik' }) => {
      switch (event.data) {
        case 'tik':
          tikCallback();
          break;
      }
    };

    timerWorker.addEventListener('message', timerTikHandler);

    return () => {
      timerWorker.removeEventListener('message', timerTikHandler);
    };
  }, [tikCallback, timerWorker]);

  const startTimer = useCallback(
    (time: number) => {
      // Web Worker에게 전달 (1초마다 tik 발생 Interval 생성)
      timerWorker.postMessage({ command: 'start', time: time });

      // Service Worker에게 전달 (백그라운드 타이머 생성)
      navigator.serviceWorker.controller?.postMessage({
        command: 'start',
        time: time,
      });
    },
    [timerWorker],
  );

  const stopTimer = useCallback(() => {
    timerWorker.postMessage({ command: 'stop' });
    navigator.serviceWorker.controller?.postMessage({ command: 'stop' });
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
