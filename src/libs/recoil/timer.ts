import { DefaultValue, atom, selector } from 'recoil';

export type TimerType = 'pomodoro' | 'short-break' | 'long-break';
export type TimerStatusType = 'paused' | 'running' | 'ready' | 'error';

export const timerTypeState = atom<TimerType>({
  key: 'timerTypeState',
  default: 'pomodoro',
});

/**
 * 전역 타이머의 진행 상태
 * 일시정지 | 진행중 | 정지됨(준비됨) | 오류상태
 */
export const timerStatusState = atom<TimerStatusType>({
  key: 'timerStatusState',
  default: 'ready',
});

/**
 * 각 상태별 목표 타이머 길이 상태
 */
export const timerGoalsState = atom<Record<TimerType, number>>({
  key: 'timerGoalsState',
  default: {
    pomodoro: 3, // 1500 25분
    'short-break': 3, // 300 5분
    'long-break': 3, // 900 15분
  },
});

/**
 * 현재 timerType에 설정된 타이머 길이 상태를 가져옴
 */
export const currentTimerGoalState = selector<number>({
  key: 'currentTimerGoalState',
  get: ({ get }) => {
    const currentTimerType = get(timerTypeState);
    const timerGoals = get(timerGoalsState);
    return timerGoals[currentTimerType];
  },
  set: ({ get, set, reset }, newVal) => {
    if (newVal instanceof DefaultValue) {
      reset(timerGoalsState);
      return;
    }

    const currentTimerType = get(timerTypeState);
    const newTimerGoalState = { ...get(timerGoalsState) };
    newTimerGoalState[currentTimerType] = newVal;
    set(timerGoalsState, { ...newTimerGoalState });
  },
});

/**
 * 초 단위로 저장되는 타이머의 전역 상태 (CORE STATE)
 */
export const timerState = atom<number>({
  key: 'timerState',
  default: 1,
});

/**
 * mm:ss 형태로 계산된 타이머 상태
 */
export const formattedTimerState = selector<string>({
  key: 'formattedTimerState',
  get: ({ get }) => {
    const seconds = get(timerState);
    return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${
      seconds % 60
    }`;
  },
});

/**
 * 타이머가 종료되었을 때 토글되는 Boolean 상태.
 * 필요한 컴포넌트에서 이 값을 useEffect로 관측해 이벤트를 탐지.
 */
export const timerDoneState = atom<boolean>({
  key: 'timerDoneState',
  default: false,
});
