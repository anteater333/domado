// timer.worker.ts

let timerId: 0 | NodeJS.Timeout = 0;

self.onmessage = ({ data }) => {
  switch (data) {
    case 'start':
      timerId = setInterval(() => {
        postMessage('tik');
      }, 1000);
      break;
    case 'stop':
      clearInterval(timerId);
      break;
  }
};
