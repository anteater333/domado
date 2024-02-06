import {
  MAX_MIN,
  MAX_PERIOD,
  MIN_MIN,
  MIN_PERIOD,
  formattedTimerState,
  isTimerAutoStartState,
  longBreakPeriodState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { timerGoalsState } from '@/libs/recoil/timer';
import React, { useCallback, useState } from 'react';
import { isInteger } from '@/utils/validator';

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
  const timerStatus = useRecoilValue(timerStatusState);
  const [isTimerAutoStart, setIsTimerAutoStart] = useRecoilState(
    isTimerAutoStartState,
  );

  // input states
  const [inputPeriod, setInputPeriod] = useState(longBreakPeriod);
  const [inputPomodoro, setInputPomodoro] = useState(
    timerGoals['pomodoro'] / 60,
  );
  const [inputShort, setInputShort] = useState(timerGoals['short-break'] / 60);
  const [inputLong, setInputLong] = useState(timerGoals['long-break'] / 60);

  const [inputIsTimerAutoStart, setInputIsTimerAutoStart] =
    useState(isTimerAutoStart);

  // input validations
  const onPeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;

      if (inputVal === '') {
        setInputPeriod(0);
      } else if (!isInteger(inputVal)) {
        setInputPeriod(longBreakPeriod);
      } else {
        setInputPeriod(() => {
          const newv = +inputVal;
          return newv < MIN_PERIOD
            ? MIN_PERIOD
            : newv > MAX_PERIOD
              ? MAX_PERIOD
              : newv;
        });
      }
    },
    [longBreakPeriod],
  );
  const onPomodoroChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;

      if (inputVal === '') {
        setInputPomodoro(0);
      } else if (!isInteger(inputVal)) {
        setInputPomodoro(timerGoals['pomodoro'] / 60);
      } else {
        setInputPomodoro(() => {
          const newv = +inputVal;
          return newv < MIN_MIN ? MIN_MIN : newv > MAX_MIN ? MAX_MIN : newv;
        });
      }
    },
    [timerGoals],
  );
  const onShortChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;

      if (inputVal === '') {
        setInputShort(0);
      } else if (!isInteger(inputVal)) {
        setInputShort(timerGoals['short-break'] / 60);
      } else {
        setInputShort(() => {
          const newv = +inputVal;
          return newv < MIN_MIN ? MIN_MIN : newv > MAX_MIN ? MAX_MIN : newv;
        });
      }
    },
    [timerGoals],
  );
  const onLongChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;

      if (inputVal === '') {
        setInputLong(0);
      } else if (!isInteger(inputVal)) {
        setInputLong(timerGoals['long-break'] / 60);
      } else {
        setInputLong(() => {
          const newv = +inputVal;
          return newv < MIN_MIN ? MIN_MIN : newv > MAX_MIN ? MAX_MIN : newv;
        });
      }
    },
    [timerGoals],
  );

  const onAutoStartChange = useCallback(() => {
    setInputIsTimerAutoStart((prev) => !prev);
  }, []);

  const onSave = useCallback(() => {
    if (inputPeriod > 0) {
      setLongBreakPeriod(inputPeriod);
    }

    const newGoals = {
      pomodoro: timerGoals['pomodoro'],
      'short-break': timerGoals['short-break'],
      'long-break': timerGoals['long-break'],
    };
    if (inputPomodoro > 0) {
      newGoals['pomodoro'] = inputPomodoro * 60;
    }
    if (inputShort > 0) {
      newGoals['short-break'] = inputShort * 60;
    }
    if (inputLong > 0) {
      newGoals['long-break'] = inputLong * 60;
    }

    setTimerGoals(newGoals);

    setIsTimerAutoStart(inputIsTimerAutoStart);
  }, [
    inputIsTimerAutoStart,
    inputLong,
    inputPeriod,
    inputPomodoro,
    inputShort,
    setIsTimerAutoStart,
    setLongBreakPeriod,
    setTimerGoals,
    timerGoals,
  ]);

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
        {timerStatus !== 'ready' ? (
          <span>타이머를 정지해주세요.</span>
        ) : undefined}
      </div>

      <div
        id="preference-container"
        className="mx-16 mt-16 grid grid-cols-3 gap-16 text-2xl [&>div]:flex"
      >
        <div className="flex flex-col">
          <div>긴 휴식 주기</div>
          <div>
            {MIN_PERIOD} ~ {MAX_PERIOD}
          </div>
        </div>
        <div className="items-start justify-center">
          <input
            className="w-16 border-b-2 bg-transparent text-center focus:outline-none"
            value={inputPeriod}
            onChange={onPeriodChange}
            disabled={timerStatus !== 'ready'}
          />
        </div>
        <div className="justify-end">{longBreakPeriod}</div>

        <div className="flex flex-col">
          <div>뽀모도로 타이머</div>
          <div>
            {MIN_MIN} ~ {MAX_MIN}
          </div>
        </div>
        <div className="items-start justify-center">
          <input
            className="w-16 border-b-2 bg-transparent text-center focus:outline-none"
            value={inputPomodoro}
            onChange={onPomodoroChange}
            disabled={timerStatus !== 'ready'}
          />
          분
        </div>
        <div className="justify-end">
          {(timerGoals['pomodoro'] / 60).toFixed(0)}분
        </div>

        <div className="flex flex-col">
          <div>짧은 휴식 타이머</div>
          <div>
            {MIN_MIN} ~ {MAX_MIN}
          </div>
        </div>
        <div className="items-start justify-center">
          <input
            className="w-16 border-b-2 bg-transparent text-center focus:outline-none"
            value={inputShort}
            onChange={onShortChange}
            disabled={timerStatus !== 'ready'}
          />
          분
        </div>
        <div className="justify-end">
          {(timerGoals['short-break'] / 60).toFixed(0)}분
        </div>

        <div className="flex flex-col">
          <div>긴 휴식 타이머</div>
          <div>
            {MIN_MIN} ~ {MAX_MIN}
          </div>
        </div>
        <div className="items-start justify-center">
          <input
            className="w-16 border-b-2 bg-transparent text-center focus:outline-none"
            value={inputLong}
            onChange={onLongChange}
            disabled={timerStatus !== 'ready'}
          />
          분
        </div>
        <div className="justify-end">
          {(timerGoals['long-break'] / 60).toFixed(0)}분
        </div>

        <div className="flex flex-col">타이머 자동 시작</div>
        <div>{/* empty slot */}</div>
        <div className="justify-end">
          {/* 초라하지만 이게 체크박스입니다.*/}
          <div
            className="h-8 w-8 cursor-pointer select-none rounded-md border-4 text-center leading-6"
            onClick={onAutoStartChange}
          >
            {inputIsTimerAutoStart ? 'v' : ''}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse items-center pb-8">
        {timerStatus !== 'ready' ? undefined : (
          <button
            className={`transform rounded-3xl border-4 border-white bg-transparent text-4xl font-bold transition duration-200 hover:border-white hover:bg-white ${
              timerType === 'pomodoro'
                ? 'hover:text-domadoRed'
                : timerType === 'short-break'
                  ? 'hover:text-domadoGreen'
                  : 'hover:text-domadoSkyBottom'
            }`}
            onClick={onSave}
          >
            저장
          </button>
        )}
      </div>
    </div>
  );
}

export default PreferenceScreen;
