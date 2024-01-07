import {
  currentTimerGoalState,
  pomodoroState,
  pomodoroTotalProgressState,
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
  const currentTimerGoal = useRecoilValue(currentTimerGoalState);
  const pomodoroTotal = useRecoilValue(pomodoroTotalProgressState);
  const setPomodoroProgress = useSetRecoilState(pomodoroState);

  useEffect(() => {
    let intervalId = 0;
    switch (timerStatus) {
      case 'running':
        // 타이머 실행
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
  }, [currentTimerGoal, setTimerSeconds, timerStatus]);

  useEffect(() => {
    if (timerSeconds <= 0) {
      // 타이머 종료 시 뽀모도로 진행도를 1 올리고 타이머 초기화\
      setPomodoroProgress((prev) => {
        const newv = prev + 1;
        if (newv >= pomodoroTotal) return 0;
        else return newv;
      });
      setTimerStatus('ready');
    }
  }, [pomodoroTotal, setPomodoroProgress, setTimerStatus, timerSeconds]);
  return null;
}
