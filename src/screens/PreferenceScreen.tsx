import { timerTypeState } from '@/libs/recoil/timer';
import { useRecoilValue } from 'recoil';

function PreferenceScreen() {
  const timerType = useRecoilValue(timerTypeState);

  return (
    <div
      id="timer-area"
      className={`
  flex h-full w-full flex-col
  ${
    timerType === 'pomodoro'
      ? 'bg-domadoRed'
      : timerType === 'short-break'
        ? 'bg-domadoGreen'
        : 'bg-domadoSky'
  }`}
    ></div>
  );
}

export default PreferenceScreen;
