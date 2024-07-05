import MainScreen from '@/screens/MainScreen';
import GlobalTimer from '@/components/GlobalTimer';
import { Routes, Route } from 'react-router-dom';
import PreferenceScreen from './screens/PreferenceScreen';
import { useRecoilValue } from 'recoil';
import { timerTypeState } from './libs/recoil/timer';
import { useEffect } from 'react';

function App() {
  const timerType = useRecoilValue(timerTypeState);

  /**
   * 타이머 타입 변경에 맞춰 theme-color 속성을 변경
   */
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        timerType === 'short-break'
          ? '#2e922c'
          : timerType === 'long-break'
            ? '#188bff'
            : '#f14d30',
      );
  }, [timerType]);

  return (
    <>
      <div
        id="bg-long-break"
        className={`ease-in-out duration-300 transition-opacity absolute left-0 top-0 -z-50 h-full w-full bg-domadoSky ${timerType === 'long-break' ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        id="bg-short-break"
        className={`ease-in-out duration-300 transition-opacity absolute left-0 top-0 -z-50 h-full w-full bg-domadoGreen ${timerType === 'short-break' ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        id="bg-pomodoro"
        className={`ease-in-out duration-300 transition-opacity absolute left-0 top-0 -z-50 h-full w-full bg-domadoRed ${timerType === 'pomodoro' ? 'opacity-100' : 'opacity-0'}`}
      />
      <GlobalTimer />
      <div
        id="app-body"
        className="flex h-full w-full flex-col overflow-scroll"
      >
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/preference" element={<PreferenceScreen />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
