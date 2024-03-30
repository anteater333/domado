import {
  MAX_MIN,
  MAX_PERIOD,
  MIN_MIN,
  MIN_PERIOD,
  formattedTimerState,
  isAlwaysOnScreenState,
  isTimerAutoStartState,
  longBreakPeriodState,
  playAlarmOnTimerDoneState,
  timerStatusState,
  timerTypeState,
} from '@/libs/recoil/timer';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { timerGoalsState } from '@/libs/recoil/timer';
import React, { useCallback, useState } from 'react';
import { isInteger } from '@/utils/validator';
import { useToast } from '@/hooks/useToast';
import { useWakeLock } from '@/hooks/useWakeLock';

import DummyCheckbox from '@/components/DummyCheckbox'; 

/**
 * PreferenceScreen은 전체 뽀모도로 과정의 설정을 조작한다.
 * @returns
 */
function PreferenceScreen() {
  // Toast
  const toast = useToast();

  // Navigator
  const navigate = useNavigate();

  // Wake Lock 지원 여부
  const { isSupported } = useWakeLock();

  // 화면 표시용 상태값들
  const timerType = useRecoilValue(timerTypeState);
  const formattedTimer = useRecoilValue(formattedTimerState);
  const timerStatus = useRecoilValue(timerStatusState);

  // 어플리케이션 설정 전역 상태들
  const [timerGoals, setTimerGoals] = useRecoilState(timerGoalsState);
  const [longBreakPeriod, setLongBreakPeriod] =
    useRecoilState(longBreakPeriodState);
  const [isTimerAutoStart, setIsTimerAutoStart] = useRecoilState(
    isTimerAutoStartState,
  );
  const [isAlwaysOnScreen, setIsAlwaysOnScreen] = useRecoilState(
    isAlwaysOnScreenState,
  );
  const [playAlarmOnTimerDone, setPlayAlarmOnTimerDone] = useRecoilState(
    playAlarmOnTimerDoneState,
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
  const [inputIsAlwaysOnScreen, setInputIsAlwaysOnScreen] =
    useState(isAlwaysOnScreen);
  const [inputPlayAlarmOnTimerDone, setInputPlayAlarmOnTimerDone] =
    useState(playAlarmOnTimerDone);

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

  const onAlwaysOnScreenChange = useCallback(() => {
    if (timerStatus !== 'ready') return;

    if (isSupported) setInputIsAlwaysOnScreen((prev) => !prev);
    else alert('지원하지 않는 브라우저입니다.');
  }, [timerStatus, isSupported]);

  const onPlayAlarmOnTimerDoneChange = useCallback(() => {
    if (timerStatus === 'ready') setInputPlayAlarmOnTimerDone((prev) => !prev);
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
    setIsAlwaysOnScreen(inputIsAlwaysOnScreen);
    setPlayAlarmOnTimerDone(inputPlayAlarmOnTimerDone);

    toast('설정을 저장했습니다.', 'success');

    navigate('/');
  }, [
    inputPeriod,
    timerGoals,
    inputPomodoro,
    inputShort,
    inputLong,
    setTimerGoals,
    setIsTimerAutoStart,
    inputIsTimerAutoStart,
    setIsAlwaysOnScreen,
    inputIsAlwaysOnScreen,
    setPlayAlarmOnTimerDone,
    inputPlayAlarmOnTimerDone,
    toast,
    navigate,
    setLongBreakPeriod,
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

      <div className="mt-1 flex flex-col items-center justify-center font-santokki md:mt-5">
        <span className="text-2xl md:text-3xl">domado</span>
        <span className="text-6xl md:text-8xl">도마도</span>
        <span className="text-2xl md:text-4xl">설정</span>
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
                type="number"
                className="w-12 border-b-2 bg-transparent text-center [appearance:textfield] focus:outline-none md:w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                type="number"
                className="w-12 border-b-2 bg-transparent text-center [appearance:textfield] focus:outline-none md:w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                type="number"
                className="w-12 border-b-2 bg-transparent text-center [appearance:textfield] focus:outline-none md:w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                type="number"
                className="w-12 border-b-2 bg-transparent text-center [appearance:textfield] focus:outline-none md:w-16 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
          <div className="flex gap-2">다음 타이머 자동 시작</div>
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

        <div id="preference-slot-5" className="flex justify-between">
          <div className="flex gap-2">화면 자동 꺼짐 방지</div>
          <div>{/* empty slot */}</div>
          <div className={!isSupported ? 'opacity-50' : ''}>
            {/* TODO: 위에 있는 체크박스와 같이 컴포넌트화 */}
            <div
              className="h-5 w-5 cursor-pointer select-none rounded-md border-2 text-center text-sm leading-4 md:h-8 md:w-8 md:border-4 md:text-2xl md:leading-6"
              onClick={onAlwaysOnScreenChange}
            >
              {!isSupported ? 'x' : inputIsAlwaysOnScreen ? 'v' : ''}
            </div>
          </div>
        </div>

        <div id="preference-slot-6" className="flex justify-between">
          <div className="flex gap-2">타이머 종료 시 소리로 알림</div>
          <div>{/* empty slot */}</div>
          <div>
            {/* TODO: 위에 있는 체크박스와 같이 컴포넌트화 */}
            <div
              className="h-5 w-5 cursor-pointer select-none rounded-md border-2 text-center text-sm leading-4 md:h-8 md:w-8 md:border-4 md:text-2xl md:leading-6"
              onClick={onPlayAlarmOnTimerDoneChange}
            >
              {inputPlayAlarmOnTimerDone ? 'v' : ''}
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

      <DummyCheckbox />
    </div>
  );
}

export default PreferenceScreen;
