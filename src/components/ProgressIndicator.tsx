import { pomodoroState, pomodoroTotalProgressState } from '@/libs/recoil/timer';
import { useRecoilValue } from 'recoil';

function ProgressIndicator() {
  const pomodoroProgress = useRecoilValue(pomodoroState);
  const pomodoroTotal = useRecoilValue(pomodoroTotalProgressState);

  return (
    <div
      id="pomodoro-progress"
      className="flex gap-4 pt-2 opacity-80 hover:opacity-100"
    >
      {Array.from({ length: pomodoroTotal }).map((_, idx) => {
        return (
          <div
            key={`pomodoro-progress-${idx}`}
            className={`h-6 w-6 rounded-full border-2 ${
              idx < pomodoroProgress
                ? `bg-white`
                : idx === pomodoroProgress
                  ? `border-white`
                  : `border-dotted border-white`
            }`}
          ></div>
        );
      })}
    </div>
  );
}

export default ProgressIndicator;
