import { DefaultValue, atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'localStorage',
  storage: localStorage,
});

export const MAX_PERIOD = 16;
export const MIN_PERIOD = 1;
export const MAX_MIN = 100;
export const MIN_MIN = 1;

export const MIN_TIME = 1;
export const MAX_TIME = MAX_MIN * 60;

export type TimerType = 'pomodoro' | 'short-break' | 'long-break';

export const timerTypeState = atom<TimerType>({
  key: 'timerTypeState',
  default: 'pomodoro',
});

export type TimerStatusType =
  | 'paused'
  | 'running'
  | 'ready'
  | 'error'
  | 'done'
  | 'restart';

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
    pomodoro: 1500, // 1500 25분
    'short-break': 300, // 300 5분
    'long-break': 900, // 900 15분
  },
  effects_UNSTABLE: [persistAtom],
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
 * 뽀모도로의 현재 진행 상태 (전체 뽀모도로 중 현재 몇 번째 단계를 지나고 있는가?)
 */
export const pomodoroState = atom<number>({
  key: 'pomodoroState',
  default: 0,
});

/**
 * 긴 휴식 주기 (뽀모도로 N번 진행 시 다음 휴식은 긴 휴식)
 */
export const longBreakPeriodState = atom<number>({
  key: 'longBreakPeriodState',
  default: 4,
  effects_UNSTABLE: [persistAtom],
});

/**
 * 뽀모도로의 전체 구조 (긴 휴식 주기 * 2)
 */
export const pomodoroTotalProgressState = selector<number>({
  key: 'pomodoroTotalProgressState',
  get: ({ get }) => {
    return get(longBreakPeriodState) * 2;
  },
});

/**
 * 타이머 종료 시 다음 타이머를 자동으로 실행하는 설정 상태
 */
export const isTimerAutoStartState = atom<boolean>({
  key: 'isTimerAutoStartState',
  default: false,
});
