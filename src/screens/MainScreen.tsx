import TimerArea from '@/components/TimerArea';
import {
  MAX_TIME,
  timerDoneState,
  timerState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const setTimerType = useSetRecoilState(timerTypeState);
  const setTimerStatus = useSetRecoilState(timerStatusState);
  const setTimer = useSetRecoilState(timerState);
  const timerDone = useRecoilValue(timerDoneState);

  useEffect(() => {
    if (timerDone) {
      // 임시 테스트 코드
      setTimerType((prev) => {
        if (prev === 'pomodoro') return 'short-break';
        else if (prev === 'short-break') return 'long-break';
        else return 'pomodoro';
      });
    }
  }, [setTimerType, timerDone]);

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
