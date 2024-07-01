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
      <GlobalTimer />
      <div
        id="app-body"
        className={`
  flex h-full w-full flex-col overflow-scroll
  ${
    timerType === 'pomodoro'
      ? 'bg-domadoRed'
      : timerType === 'short-break'
        ? 'bg-domadoGreen'
        : 'bg-domadoSky'
  }`}
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
