import TimerArea from '@/components/TimerArea';
import {
  timerDoneState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const [timerType, setTimerType] = useRecoilState(timerTypeState);
  const [timerStatus, setTimerStatus] = useRecoilState(timerStatusState);
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
      />
    </div>
  );
}

export default MainScreen;
