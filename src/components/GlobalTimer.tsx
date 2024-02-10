import { useNotification } from '@/hooks/useNotification';
import {
  currentTimerGoalState,
  isTimerAutoStartState,
  pomodoroState,
  pomodoroTotalProgressState,
  timerState,
  timerStatusState,
  timerTypeState,
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
  const [pomodoroProgress, setPomodoroProgress] = useRecoilState(pomodoroState);

  const isTimerAutoStart = useRecoilValue(isTimerAutoStartState);
  const currentTimerGoal = useRecoilValue(currentTimerGoalState);
  const pomodoroTotal = useRecoilValue(pomodoroTotalProgressState);

  const setTimerType = useSetRecoilState(timerTypeState);

  const { fire: fireNotif } = useNotification();

  useEffect(() => {
    let intervalId: 0 | NodeJS.Timeout = 0;
    switch (timerStatus) {
      case 'restart':
        setTimerSeconds(currentTimerGoal);

        setTimerStatus('running');
        break;
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
      case 'done':
        // 타이머 완료

        // 타이머 종료를 알림 (Notification API)
        fireNotif('도마도 타이머 종료', { body: '타이머가 종료되었습니다.' });

        setTimerStatus(isTimerAutoStart ? 'restart' : 'ready');

        break;
      case 'paused':
      case 'error':
        // 타이머 일시정지
        break;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    currentTimerGoal,
    setTimerSeconds,
    timerStatus,
    setTimerStatus,
    fireNotif,
    isTimerAutoStart,
  ]);

  useEffect(() => {
    if (timerSeconds <= 0) {
      // 타이머 종료 시 뽀모도로 진행도를 1 올리고 타이머 초기화
      setPomodoroProgress((prev) => {
        const newv = prev + 1;
        if (newv >= pomodoroTotal) return 0;
        else return newv;
      });

      setTimerStatus('done');
    }
  }, [pomodoroTotal, setPomodoroProgress, setTimerStatus, timerSeconds]);

  /*
   * 진행상태에 따라 타이머 타입을 변경
   * NOTE. 진행상태는 0에서 시작함
   */
  useEffect(() => {
    if (pomodoroProgress % 2 === 0) {
      // 뽀모도로 타이머
      setTimerType('pomodoro');
    } else if (pomodoroProgress < pomodoroTotal - 1) {
      // 짧은 휴식 타이머
      setTimerType('short-break');
    } else {
      // 긴 휴식 타이머
      setTimerType('long-break');
    }
  }, [pomodoroProgress, pomodoroTotal, setTimerType]);

  return null;
}
