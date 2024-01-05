import TimerArea from '@/components/TimerArea';
import {
  MAX_TIME,
  pomodoroState,
  pomodoroTotalProgressState,
  timerDoneState,
  timerState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const setTimerType = useSetRecoilState(timerTypeState);
  const setTimerStatus = useSetRecoilState(timerStatusState);
  const setTimer = useSetRecoilState(timerState);

  const [pomodoroProgress, setPomodoroProgress] = useRecoilState(pomodoroState);

  const pomodoroTotal = useRecoilValue(pomodoroTotalProgressState);
  const timerDone = useRecoilValue(timerDoneState);

  /* timerDone이 트리거될 때 진행 상태를 1 올림 */
  useEffect(() => {
    if (timerDone) {
      setPomodoroProgress((prev) => {
        const newv = prev + 1;
        if (newv >= pomodoroTotal) return 0;
        else return newv;
      });
    }
  }, [pomodoroTotal, setPomodoroProgress, setTimerType, timerDone]);

  /*
   * 진행상태에 따라 타이머 타입을 변경
  NOTE. 진행상태는 0에서 시작함
    
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

  return (
    <div id="app-main-screen" className="h-full w-full">
      <TimerArea
        onStart={() => {
          setTimerStatus('running');
        }}
        onPause={() => {
          setTimerStatus('paused');
        }}
        onStop={() => {
          setTimerStatus('ready');
        }}
        onOneMoreMin={() => {
          // 1분 더!
          setTimer((prev) => {
            const newVal = prev + 60;
            if (newVal > MAX_TIME) return MAX_TIME;
            else return newVal;
          });
        }}
      />
    </div>
  );
}

export default MainScreen;
