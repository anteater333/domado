import TimerArea, { TimerAreaProp } from '@/components/TimerArea';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const timerProp: TimerAreaProp = { type: 'pomodoro' };

  return (
    <div id="app-main-screen" className="h-full w-full">
      <TimerArea {...timerProp} />
    </div>
  );
}

export default MainScreen;
