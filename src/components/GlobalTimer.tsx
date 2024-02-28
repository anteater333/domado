import { useNotification } from '@/hooks/useNotification';
import {
  currentTimerGoalState,
  isTimerAutoStartState,
  playAlarmOnTimerDoneState,
  pomodoroState,
  pomodoroTotalProgressState,
  timeRemainingState,
  timerState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

/** Custom hooks */
import { useToast } from '@/hooks/useToast';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useTimer } from '@/hooks/useTimer';
import { useBell } from '@/hooks/useBell';

/**
 * 전역 타이머를 관리하는 Dummy Component
 * @returns
 */
export default function GlobalTimer() {
  // Global States
  const [timerSeconds, setTimerSeconds] = useRecoilState(timerState);
  const [timerStatus, setTimerStatus] = useRecoilState(timerStatusState);
  const [pomodoroProgress, setPomodoroProgress] = useRecoilState(pomodoroState);
  const [timeRemaining, setTimeRemaining] = useRecoilState(timeRemainingState);

  const isTimerAutoStart = useRecoilValue(isTimerAutoStartState);
  const playAlarmOnTimerDone = useRecoilValue(playAlarmOnTimerDoneState);
  const currentTimerGoal = useRecoilValue(currentTimerGoalState);
  const pomodoroTotal = useRecoilValue(pomodoroTotalProgressState);

  const setTimerType = useSetRecoilState(timerTypeState);

  // 정교한 타이머 계산을 위한 Local State 및 Hook
  /* 타이머 실행시간 */
  const [timerStartedAt, setTimerStartedAt] = useState<number>(Date.now());
  const calcTimePassed = useCallback(() => {
    setTimerSeconds(
      timeRemaining - Math.floor((Date.now() - timerStartedAt) / 1000),
    );
  }, [setTimerSeconds, timerStartedAt, timeRemaining]);

  /** 다음 단계로 넘어가 currentTimerGoal이 바꼈을 때 */
  useEffect(() => {
    setTimeRemaining(currentTimerGoal);
  }, [currentTimerGoal, setTimeRemaining]);

  /** paused 상태에서 정지된 시간 기록 */
  useEffect(() => {
    if (timerStatus === 'paused')
      setTimeRemaining(
        currentTimerGoal - Math.floor((Date.now() - timerStartedAt) / 1000),
      );
  }, [setTimeRemaining, timerStatus, timerStartedAt, currentTimerGoal]);

  // Custom Hooks
  const { fire: fireNotif } = useNotification();
  const toast = useToast();
  const { releaseWakeLock, requestWakeLock } = useWakeLock();
  const { startTimer, stopTimer } = useTimer(calcTimePassed);
  const { playBell, stopBell } = useBell();

  /**
   * 진행 상태를 증가시키는 함수
   */
  const increaseProgress = useCallback(() => {
    setPomodoroProgress((prev) => (prev + 1) % pomodoroTotal);
  }, [pomodoroTotal, setPomodoroProgress]);

  /**
   * 타이머 상태 변화를 감지하는 useEffect 훅
   * TBD: 훅 하나가 너무 큰것은 아닌가, 미래에 너무 커질 가능성이 있는건 아닌가 검토 필요 (리펙토링)
   */
  useEffect(() => {
    switch (timerStatus) {
      case 'restart':
        // 타이머 자동 시작을 위한 중간 상태
        setTimeRemaining(currentTimerGoal);
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
        // 실행 시간 기록
        setTimerStartedAt(Date.now());

        // 타이머 실행
        startTimer();

        // 화면 항상 켜두기 (기능 테스트 중, 추후 옵션 추가 필요)
        requestWakeLock();

        // 재생중이던 알람벨을 끄기
        if (!isTimerAutoStart) stopBell();
        break;
      case 'ready':
        // 타이머 정지 (초기화)
        setTimeRemaining(currentTimerGoal);
        setTimerSeconds(currentTimerGoal);
        break;
      case 'done':
        // 타이머 완료

        // 타이머 종료를 알림 (Notification API)
        fireNotif('도마도 타이머 종료', { body: '타이머가 종료되었습니다.' });
        // 토스트 알림
        toast('타이머가 종료되었습니다.');
        // 소리로 알림
        if (playAlarmOnTimerDone) playBell();

        // 알림들 수행 후 다음 상태로 전환
        setTimerStatus(isTimerAutoStart ? 'restart' : 'ready');
        break;
      case 'paused':
        break;
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
    playBell,
    stopBell,
    playAlarmOnTimerDone,
    currentTimerGoal,
    fireNotif,
    increaseProgress,
    isTimerAutoStart,
    releaseWakeLock,
    requestWakeLock,
    setTimerSeconds,
    setTimerStatus,
    startTimer,
    stopTimer,
    timerStatus,
    toast,
    setTimeRemaining,
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
