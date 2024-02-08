import { timerState } from '@/libs/recoil/timer';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

function NotchSlider() {
  const timerSeconds = useRecoilValue(timerState);

  const notchWidth = 1; // rem
  const notchMarginRight = 5; // rem
  const translateBySeconds = useMemo(
    () => (timerSeconds * (notchWidth + notchMarginRight)) / 60,
    [timerSeconds],
  );

  return (
    <div id="notch-slider" className="overflow-hidden">
      <div
        id="notch-container"
        className="relative left-1/2 -ml-2 flex items-end transition-transform"
        style={{
          transform: `translateX(-${translateBySeconds}rem)`,
        }}
      >
        {Array.from({ length: 101 }).map((_, i: number) => {
          if (i % 5 === 0)
            return (
              <div
                key={`notch-${i}`}
                className="mr-20 flex w-4 min-w-4 flex-col items-center"
              >
                <span className="mb-2 select-none text-6xl font-bold">{i}</span>
                <div
                  id={`notch-${i}`}
                  className="h-8 w-2 rounded-md bg-white"
                ></div>
              </div>
            );
          else
            return (
              <div
                key={`notch-${i}`}
                className="mr-20 flex w-4 min-w-4 flex-col items-center"
              >
                <div
                  id={`notch-${i}`}
                  className="h-4 w-1 rounded-sm bg-white"
                ></div>
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default NotchSlider;
