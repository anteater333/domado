// timer.worker.ts

/**
 * 타이머 워커에게 데이터를 전달할 때 사용하는 Object 포맷
 */
type TimerWorkerDTO =
  | {
      command: 'start';
      time: number;
    }
  | {
      command: 'stop';
    };

let tickerId: 0 | NodeJS.Timeout = 0;
let timerId: 0 | NodeJS.Timeout = 0;

self.onmessage = ({ data }: { data: TimerWorkerDTO }) => {
  console.log(data);

  switch (data.command) {
    case 'start':
      // 1초마다 메인 스레드에 메시지를 전달
      tickerId = setInterval(() => {
        postMessage('tik');
      }, 1000);

      // 백그라운드용 별도 타이머
      timerId = setTimeout(() => {
        // 타이머 종료
        console.log('TIMER END');
      }, data.time * 1000);
      break;
    case 'stop':
      clearInterval(tickerId);
      clearTimeout(timerId);
      break;
  }
};
