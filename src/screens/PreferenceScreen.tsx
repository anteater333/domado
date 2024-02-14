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
import { useToast } from '@/hooks/useToast';

/**
 * PreferenceScreen은 전체 뽀모도로 과정의 설정을 조작한다.
 * @returns
 */
function PreferenceScreen() {
  // Toast
  const toast = useToast();

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
    if (timerStatus === 'ready') setInputIsTimerAutoStart((prev) => !prev);
  }, [timerStatus]);

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

    toast('설정을 저장했습니다.', 'success');
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
    toast,
  ]);

  return (
    <div id="preference-screen" className="flex h-full w-full flex-col">
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
        className="mx-4 mb-8 mt-16 flex flex-col gap-4 text-sm md:mx-16 md:h-full md:justify-around md:text-2xl [&>div]:flex"
      >
        <div id="preference-slot-1" className="flex justify-between">
          <div className="flex gap-2">
            <div>긴 휴식 주기</div>
            <div>
              ({MIN_PERIOD} ~ {MAX_PERIOD})
            </div>
          </div>
          <div className="flex gap-1 md:gap-4">
            <div className="items-start justify-center">
              <input
                className="w-12 border-b-2 bg-transparent text-center focus:outline-none md:w-16"
                value={inputPeriod}
                onChange={onPeriodChange}
                disabled={timerStatus !== 'ready'}
              />
              회
            </div>
            <div className="w-12 justify-end text-right md:w-16">
              {longBreakPeriod}회
            </div>
          </div>
        </div>

        <div id="preference-slot-2" className="flex justify-between">
          <div className="flex gap-2">
            <div>뽀모도로 타이머</div>
            <div>
              ({MIN_MIN} ~ {MAX_MIN})
            </div>
          </div>
          <div className="flex gap-1 md:gap-4">
            <div className="items-start justify-center">
              <input
                className="w-12 border-b-2 bg-transparent text-center focus:outline-none md:w-16"
                value={inputPomodoro}
                onChange={onPomodoroChange}
                disabled={timerStatus !== 'ready'}
              />
              분
            </div>
            <div className="w-12 justify-end text-right md:w-16">
              {(timerGoals['pomodoro'] / 60).toFixed(0)}분
            </div>
          </div>
        </div>

        <div id="preference-slot-3" className="flex justify-between">
          <div className="flex gap-2">
            <div>짧은 휴식 타이머</div>
            <div>
              ({MIN_MIN} ~ {MAX_MIN})
            </div>
          </div>
          <div className="flex gap-1 md:gap-4">
            <div className="items-start justify-center">
              <input
                className="w-12 border-b-2 bg-transparent text-center focus:outline-none md:w-16"
                value={inputShort}
                onChange={onShortChange}
                disabled={timerStatus !== 'ready'}
              />
              분
            </div>
            <div className="w-12 justify-end text-right md:w-16">
              {(timerGoals['short-break'] / 60).toFixed(0)}분
            </div>
          </div>
        </div>

        <div id="preference-slot-4" className="flex justify-between">
          <div className="flex gap-2">
            <div>긴 휴식 타이머</div>
            <div>
              ({MIN_MIN} ~ {MAX_MIN})
            </div>
          </div>
          <div className="flex gap-1 md:gap-4">
            <div className="items-start justify-center">
              <input
                className="w-12 border-b-2 bg-transparent text-center focus:outline-none md:w-16"
                value={inputLong}
                onChange={onLongChange}
                disabled={timerStatus !== 'ready'}
              />
              분
            </div>
            <div className="w-12 justify-end text-right md:w-16">
              {(timerGoals['long-break'] / 60).toFixed(0)}분
            </div>
          </div>
        </div>

        <div id="preference-slot-5" className="flex justify-between">
          <div className="flex gap-2">타이머 자동 시작</div>
          <div>{/* empty slot */}</div>
          <div>
            {/* 초라하지만 이게 체크박스입니다.*/}
            <div
              className="h-5 w-5 cursor-pointer select-none rounded-md border-2 text-center text-sm leading-4 md:h-8 md:w-8 md:border-4 md:text-2xl md:leading-6"
              onClick={onAutoStartChange}
            >
              {inputIsTimerAutoStart ? 'v' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center pb-8">
        {timerStatus !== 'ready' ? undefined : (
          <button
            className={`transform rounded-2xl border-4 border-white bg-transparent font-bold transition duration-200 hover:border-white hover:bg-white md:rounded-3xl md:text-4xl ${
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
