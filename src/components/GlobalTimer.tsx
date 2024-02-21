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
import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

/** Custom hooks */
import { useToast } from '@/hooks/useToast';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useTimer } from '@/hooks/useTimer';

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

  const { requestPermission: notiPermRequest, fire: fireNotif } =
    useNotification();
  const toast = useToast();
  const { releaseWakeLock, requestWakeLock } = useWakeLock();
  const { startTimer, stopTimer } = useTimer(() =>
    setTimerSeconds((sec) => sec - 1),
  );

  /**
   * 진행 상태를 증가시키는 함수
   */
  const increaseProgress = useCallback(() => {
    setPomodoroProgress((prev) => (prev + 1) % pomodoroTotal);
  }, [pomodoroTotal, setPomodoroProgress]);

  /**
   * 타이머 상태 변화를 감지하는 useEffect 훅
   */
  useEffect(() => {
    switch (timerStatus) {
      case 'restart':
        // 타이머 자동 시작을 위한 중간 상태
        setTimerSeconds(currentTimerGoal);
        setTimerStatus('running');
        break;
      case 'skip':
        // 사용자에 의한 타이머 스킵 상태 (Noti, 자동 재시작 동작하지 않음)
        increaseProgress();
        toast('타이머를 건너 뛰었습니다.');
        setTimerStatus('ready');
        break;
      case 'running':
        // 타이머 실행
        startTimer();

        // 화면 항상 켜두기 (기능 테스트 중, 추후 옵션 추가 필요)
        requestWakeLock();

        // Notification 기능을 위한 권한 요청
        notiPermRequest();
        break;
      case 'ready':
        // 타이머 정지 (초기화)
        setTimerSeconds(currentTimerGoal);
        break;
      case 'done':
        // 타이머 완료
        // 타이머 종료를 알림 (Notification API)
        fireNotif('도마도 타이머 종료', { body: '타이머가 종료되었습니다.' });
        toast('타이머가 종료되었습니다.');
        setTimerStatus(isTimerAutoStart ? 'restart' : 'ready');
        break;
      case 'paused':
      case 'error':
        // 타이머 일시정지
        break;
    }

    return () => {
      if (timerStatus === 'running') {
        stopTimer();
        releaseWakeLock();
      }
    };
  }, [
    currentTimerGoal,
    fireNotif,
    increaseProgress,
    isTimerAutoStart,
    notiPermRequest,
    releaseWakeLock,
    requestWakeLock,
    setTimerSeconds,
    setTimerStatus,
    startTimer,
    stopTimer,
    timerStatus,
    toast,
  ]);

  /**
   * 타이머 시간 종료를 감지하는 useEffect 훅
   */
  useEffect(() => {
    if (timerSeconds <= 0) {
      increaseProgress();

      setTimerStatus('done');
    }
  }, [increaseProgress, setTimerStatus, timerSeconds]);

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
