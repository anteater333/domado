import { formattedTimerState, timerTypeState } from '@/libs/recoil/timer';
import { useRecoilState, useRecoilValue } from 'recoil';
import NotchSlider from './NotchSlider';

interface TimerAreaProp {
  onStart: () => void;
  onPause: () => void;
}

/**
 * TimerArea는 전달받은 타이머 설정에 따라 타이머의 색상 등 표시 방법을 변경한다.
 * @param props
 * @returns
 */
function TimerArea(props: TimerAreaProp) {
  const formattedTimer = useRecoilValue(formattedTimerState);

  const [timerType, setTimerType] = useRecoilState(timerTypeState);

  return (
    <>
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
      >
        <div
          id="timer-upper"
          className="flex h-full w-full flex-col justify-end pt-8"
        >
          <div className="flex flex-1 flex-col items-center justify-center font-santokki">
            <span className="text-3xl">domado</span>
            <span className="text-8xl">도마도</span>
            <span className="text-4xl">
              {timerType === 'pomodoro'
                ? '뽀모도로'
                : timerType === 'short-break'
                  ? '짧은 휴식'
                  : '긴 휴식'}{' '}
              타이머
            </span>
          </div>
          <NotchSlider />
        </div>
        <div
          id="timer-gap"
          className="mb-1 mt-2 h-2 w-full bg-black opacity-5"
        ></div>
        <div
          id="timer-lower"
          className="flex h-full w-full flex-col items-center pb-8"
        >
          <div
            id="indicator-container"
            className="flex w-full justify-between px-8 font-sans"
          >
            <span className="cursor-default select-none text-2xl"></span>
            <span className="cursor-default select-none text-6xl">▲</span>
            <span className="cursor-default select-none text-2xl"></span>
          </div>
          <div className="mt-4">
            <span className="text-6xl font-bold">{formattedTimer}</span>
          </div>
          <div className="mt-16 flex flex-col gap-4 text-center">
            <span className="text-4xl">목표</span>
            <div className="text-4xl">
              <input className="w-24 border-b-4 bg-transparent text-center focus-visible:outline-none" />
              분
            </div>
          </div>
          <div className="flex flex-1 items-end gap-4">
            <button
              className={`transform rounded-3xl border-4 border-white bg-transparent text-4xl font-bold transition duration-200 hover:border-white hover:bg-white ${
                timerType === 'pomodoro'
                  ? 'hover:text-domadoRed'
                  : timerType === 'short-break'
                    ? 'hover:text-domadoGreen'
                    : 'hover:text-domadoSkyBottom'
              }`}
              onClick={props.onStart}
            >
              시작
            </button>
            <button
              className={`transform rounded-3xl border-4 border-white bg-transparent text-4xl font-bold transition duration-200 hover:border-white hover:bg-white ${
                timerType === 'pomodoro'
                  ? 'hover:text-domadoRed'
                  : timerType === 'short-break'
                    ? 'hover:text-domadoGreen'
                    : 'hover:text-domadoSkyBottom'
              }`}
              onClick={props.onPause}
            >
              일시정지
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimerArea;
