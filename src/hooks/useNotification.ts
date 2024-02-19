import { useCallback } from 'react';

export const useNotification = () => {
  const fire = useCallback(
    async (title: string, options?: NotificationOptions) => {
      try {
        const registration = await navigator.serviceWorker.ready;

        registration.showNotification(title, options);
      } catch (err) {
        console.error('error from Notification', err);
      }
    },
    [],
  );

  return { fire };
};
