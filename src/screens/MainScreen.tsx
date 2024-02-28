import TimerArea from '@/components/TimerArea';
import { useNotification } from '@/hooks/useNotification';
import {
  MAX_TIME,
  timeRemainingState,
  timerState,
  timerStatusState,
} from '@/libs/recoil/timer';
import { useSetRecoilState } from 'recoil';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const setTimerStatus = useSetRecoilState(timerStatusState);
  const setTimer = useSetRecoilState(timerState);
  const setTimeRemaining = useSetRecoilState(timeRemainingState);

  const { requestPermission: requestNotiPerm } = useNotification();

  return (
    <div id="app-main-screen" className="h-full w-full">
      <TimerArea
        onStart={() => {
          setTimerStatus('running');
          // Notification 기능을 위한 권한 요청
          requestNotiPerm();
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
          setTimeRemaining((prev) => {
            const newVal = prev + 60;
            if (newVal > MAX_TIME) return MAX_TIME;
            else return newVal;
          });
        }}
        onSkip={() => {
          setTimerStatus('paused');
          setTimeout(() => {
            if (confirm('현재 타이머를 건너 뜁니다.\n(취소할 수 없습니다.)'))
              setTimerStatus('skip');
            else setTimerStatus('running');
          });
        }}
      />
    </div>
  );
}

export default MainScreen;
