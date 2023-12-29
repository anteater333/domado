import TimerArea, { TimerStatusType } from '@/components/TimerArea';
import { useState } from 'react';

/**
 * MainScreen은 TimerArea를 포함하고 있다.
 * MainScreen은 현재 화면에 표시할 Timer의 정보를 조작한다.
 */
function MainScreen() {
  const [timerStatus, setTimerStatus] = useState<TimerStatusType>('pomodoro');

  return (
    <div id="app-main-screen" className="h-full w-full">
      <TimerArea
        type={timerStatus}
        onStart={() => {
          if (timerStatus === 'long-break') setTimerStatus('pomodoro');
          else if (timerStatus === 'short-break') setTimerStatus('long-break');
          else setTimerStatus('short-break');
        }}
      />
    </div>
  );
}

export default MainScreen;
