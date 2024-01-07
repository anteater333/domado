import {
  formattedTimerState,
  longBreakPeriodState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { timerGoalsState } from '@/libs/recoil/timer';

/**
 * PreferenceScreen은 전체 뽀모도로 과정의 설정을 조작한다.
 * @returns
 */
function PreferenceScreen() {
  const timerType = useRecoilValue(timerTypeState);
  const formattedTimer = useRecoilValue(formattedTimerState);
  const [timerGoals, setTimerGoals] = useRecoilState(timerGoalsState);
  const [longBreakPeriod, setLongBreakPeriod] =
    useRecoilState(longBreakPeriodState);

  return (
    <div
      id="preference-screen-body"
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
      <div id="header-area" className="flex justify-center pt-5">
        <Link to={'/'}>
          <span className="text-4xl font-bold text-white opacity-80 hover:opacity-100">
            {formattedTimer}
          </span>
        </Link>
      </div>

      <div className="mt-5 flex flex-col items-center justify-center font-santokki">
        <span className="text-3xl">domado</span>
        <span className="text-8xl">도마도</span>
        <span className="text-4xl">설정</span>
      </div>

      <div
        id="preference-container"
        className="mx-16 mt-16 grid grid-cols-3 gap-16 text-2xl [&>div]:flex"
      >
        <div>긴 휴식 주기</div>
        <div className="justify-center">
          <input className="w-16 border-b-2 bg-transparent text-center focus:outline-none" />
        </div>
        <div className="justify-end">{longBreakPeriod}</div>

        <div>뽀모도로 타이머</div>
        <div className="justify-center">
          <input className="w-16 border-b-2 bg-transparent text-center focus:outline-none" />
          분
        </div>
        <div className="justify-end">
          {(timerGoals['pomodoro'] / 60).toFixed(0)}분
        </div>

        <div>짧은 휴식 타이머</div>
        <div className="justify-center">
          <input className="w-16 border-b-2 bg-transparent text-center focus:outline-none" />
          분
        </div>
        <div className="justify-end">
          {(timerGoals['short-break'] / 60).toFixed(0)}분
        </div>

        <div>긴 휴식 타이머</div>
        <div className="justify-center">
          <input className="w-16 border-b-2 bg-transparent text-center focus:outline-none" />
          분
        </div>
        <div className="justify-end">
          {(timerGoals['long-break'] / 60).toFixed(0)}분
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse items-center pb-8">
        <button
          className={`transform rounded-3xl border-4 border-white bg-transparent text-4xl font-bold transition duration-200 hover:border-white hover:bg-white ${
            timerType === 'pomodoro'
              ? 'hover:text-domadoRed'
              : timerType === 'short-break'
                ? 'hover:text-domadoGreen'
                : 'hover:text-domadoSkyBottom'
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default PreferenceScreen;
