import MainScreen from '@/screens/MainScreen';
import GlobalTimer from '@/components/GlobalTimer';
import { Routes, Route } from 'react-router-dom';
import PreferenceScreen from './screens/PreferenceScreen';

function App() {
  return (
    <>
      <GlobalTimer />
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/preference" element={<PreferenceScreen />} />
      </Routes>
    </>
  );
}

export default App;
