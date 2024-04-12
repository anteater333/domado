import TimerArea from '@/components/TimerArea';
import { useNotification } from '@/hooks/useNotification';
import {
  MAX_TIME,
  pomodoroState,
  timeRemainingState,
  timerState,
  timerStatusState,
} from '@/libs/recoil/timer';
import { useRecoilState, useSetRecoilState } from 'recoil';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const [timerStatus, setTimerStatus] = useRecoilState(timerStatusState);
  const setTimer = useSetRecoilState(timerState);
  const setTimeRemaining = useSetRecoilState(timeRemainingState);
  const setPomodoroProgress = useSetRecoilState(pomodoroState);

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
          if (timerStatus === 'running') setTimerStatus('paused');
          setTimeout(() => {
            if (confirm('현재 타이머를 건너 뜁니다.')) setTimerStatus('skip');
          });
        }}
        onToDefault={() => {
          if (timerStatus === 'running') setTimerStatus('paused');
          setTimeout(() => {
            if (confirm('진행 상태를 초기화합니다.')) {
              setPomodoroProgress(0);
              setTimerStatus('ready');
            }
          });
        }}
      />
    </div>
  );
}

export default MainScreen;
