import TimerArea from '@/components/TimerArea';
import { MAX_TIME, timerState, timerStatusState } from '@/libs/recoil/timer';
import { useSetRecoilState } from 'recoil';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const setTimerStatus = useSetRecoilState(timerStatusState);
  const setTimer = useSetRecoilState(timerState);

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
        onSkip={() => {
          if (confirm('현재 타이머를 건너 뜁니다.\n(취소할 수 없습니다.)'))
            setTimerStatus('skip');
        }}
      />
    </div>
  );
}

export default MainScreen;
