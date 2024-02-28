import { useCallback, useState } from 'react';

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission,
  );

  const requestPermission = useCallback(() => {
    if (Notification.permission !== 'granted')
      Notification.requestPermission().then((newPermission) => {
        setPermission(newPermission);
      });
  }, []);

  const fire = useCallback(
    async (title: string, options?: NotificationOptions) => {
      try {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification(title, options);
      } catch (err) {
        console.error('error from Notification', err);
      }
    },
    [],
  );

  return { permission, requestPermission, fire };
};
