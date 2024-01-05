import {
  currentTimerGoalState,
  timerDoneState,
  timerState,
  timerStatusState,
} from '@/libs/recoil/timer';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * 전역 타이머를 관리하는 Dummy Component
 * @returns
 */
export default function GlobalTimer() {
  const [timerSeconds, setTimerSeconds] = useRecoilState(timerState);
  const [timerStatus, setTimerStatus] = useRecoilState(timerStatusState);
  const setTimerDone = useSetRecoilState(timerDoneState);
  const currentTimerGoal = useRecoilValue(currentTimerGoalState);

  useEffect(() => {
    let intervalId = 0;
    switch (timerStatus) {
      case 'running':
        // 타이머 실행
        setTimerDone(false);
        intervalId = setInterval(() => {
          setTimerSeconds((sec) => sec - 1);
        }, 1000);
        break;
      case 'ready':
        // 타이머 정지 (초기화)
        setTimerSeconds(currentTimerGoal);
        break;
      case 'paused':
      case 'error':
        // 타이머 일시정지
        break;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentTimerGoal, setTimerDone, setTimerSeconds, timerStatus]);

  useEffect(() => {
    if (timerSeconds <= 0) {
      setTimerDone(true);
      setTimerStatus('ready');
    }
  }, [setTimerDone, setTimerStatus, timerSeconds]);

  return null;
}
