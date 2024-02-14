import {
  formattedTimerState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';

import NotchSlider from './NotchSlider';
import ProgressIndicator from './ProgressIndicator';

interface TimerAreaProp {
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onOneMoreMin: () => void;
  onSkip: () => void;
}

/**
 * TimerArea는 전달받은 타이머 설정에 따라 타이머의 색상 등 표시 방법을 변경한다.
 * @param props
 * @returns
 */
function TimerArea(props: TimerAreaProp) {
  const formattedTimer = useRecoilValue(formattedTimerState);

  const timerType = useRecoilValue(timerTypeState);
  const timerStatus = useRecoilValue(timerStatusState);

  return (
    <>
      <div id="timer-area" className="flex h-full w-full flex-col">
        <div
          id="timer-upper"
          className="flex h-full w-full flex-col justify-end pt-4"
        >
          <div id="header-area" className="flex justify-center">
            <Link to={'/preference'}>
              <ProgressIndicator />
            </Link>
          </div>
          <div className="mt-8 flex flex-1 flex-col items-center font-santokki">
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
          <div className="mt-4 cursor-pointer" onClick={props.onSkip}>
            <span className="select-none text-6xl font-bold">
              {formattedTimer}
            </span>
          </div>
          <div className="flex w-full flex-1 flex-col-reverse items-center gap-4">
            <div
              id="play-button-container"
              className="flex w-full items-end justify-center gap-4 px-4  md:text-4xl"
            >
              <button
                className={`max-w-64 flex-1 transform rounded-2xl border-4 border-white bg-transparent font-bold transition duration-200 hover:border-white hover:bg-white md:rounded-3xl ${
                  timerType === 'pomodoro'
                    ? 'hover:text-domadoRed'
                    : timerType === 'short-break'
                      ? 'hover:text-domadoGreen'
                      : 'hover:text-domadoSkyBottom'
                }`}
                onClick={
                  timerStatus === 'running' ? props.onPause : props.onStart
                }
              >
                {timerStatus !== 'running' ? '시작' : '일시정지'}
              </button>
              {timerStatus === 'paused' ? (
                <button
                  className={`max-w-64 flex-1 transform rounded-2xl border-4 border-white bg-transparent font-bold transition duration-200 hover:border-white hover:bg-white md:rounded-3xl ${
                    timerType === 'pomodoro'
                      ? 'hover:text-domadoRed'
                      : timerType === 'short-break'
                        ? 'hover:text-domadoGreen'
                        : 'hover:text-domadoSkyBottom'
                  }`}
                  onClick={props.onStop}
                >
                  초기화
                </button>
              ) : undefined}
            </div>
            {timerStatus !== 'ready' ? (
              <span
                id="one-more-min-button"
                className="cursor-pointer select-none text-xl"
                onClick={props.onOneMoreMin}
              >
                +1:00
              </span>
            ) : undefined}
          </div>
        </div>
      </div>
    </>
  );
}

export default TimerArea;
