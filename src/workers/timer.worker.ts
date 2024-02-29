// timer.worker.ts

let tickerId: 0 | NodeJS.Timeout = 0;

self.onmessage = ({ data }) => {
  switch (data.command) {
    case 'start':
      // 1초마다 메인 스레드에 메시지를 전달
      tickerId = setInterval(() => {
        postMessage('tik');
      }, 1000);
      break;
    case 'stop':
      clearInterval(tickerId);
      break;
  }
};
