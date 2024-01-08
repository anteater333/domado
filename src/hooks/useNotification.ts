import { useCallback } from 'react';

export const useNotification = () => {
  if (Notification.permission !== 'granted') {
    // Hook 처음 선언 시 권한을 물을 수 있도록 한 번 호출
    try {
      Notification.requestPermission().then(() => {});
    } catch (error) {
      if (error instanceof TypeError) {
        // for Safari
        Notification.requestPermission(() => {});
      } else {
        console.error(error);
      }
    }
  }

  const fire = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
      // Notification API를 지원하지 않는 브라우저 처리
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
      return;
    }

    // Notification 권한 설정이 되어있지 않은 경우 재문의
    try {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') new Notification(title, options);
      });
    } catch (error) {
      if (error instanceof TypeError) {
        // for Safari
        Notification.requestPermission((permission) => {
          if (permission === 'granted') new Notification(title, options);
        });
      } else {
        console.error(error);
      }
    }
  }, []);

  return { fire };
};
