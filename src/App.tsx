import MainScreen from '@/screens/MainScreen';
import GlobalTimer from '@/components/GlobalTimer';
import { Routes, Route } from 'react-router-dom';
import PreferenceScreen from './screens/PreferenceScreen';
import { useRecoilValue } from 'recoil';
import { timerTypeState } from './libs/recoil/timer';

function App() {
  const timerType = useRecoilValue(timerTypeState);

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
