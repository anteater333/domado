export interface TimerAreaProp {
  type: 'pomodoro' | 'short-break' | 'long-break';
}

/**
 * TimerArea는 전달받은 타이머 설정에 따라 타이머의 색상 등 표시 방법을 변경한다.
 * @param prop
 * @returns
 */
function TimerArea(prop: TimerAreaProp) {
  return (
    <>
      <div
        id="timer-area"
        className={`
        flex h-full w-full
        ${
          prop.type === 'pomodoro'
            ? 'bg-domadoRed'
            : prop.type === 'short-break'
              ? 'bg-domadoGreen'
              : 'bg-domadoSky'
        }`}
      >
        <div id="timer-upper" className="h-full w-full bg-domadoGreen"></div>
        <div id="timer-lower" className="h-full w-full bg-domadoSky"></div>
      </div>
    </>
  );
}

export default TimerArea;
