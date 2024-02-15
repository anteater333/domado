import { useCallback, useEffect, useState } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  /** 각 callback들이 직접 조작하지 않고 useEffect 훅에서 WakeLock을 조작할 수 있도록 별도 상태 선언 */
  const [wakeLockStatus, setWakeLockStatus] = useState<
    'requested' | 'released' | 'idle'
  >('idle');

  const isSupported = 'wakeLock' in navigator;

  /** 경고 문구 출력 hook (개발자 참고용) */
  useEffect(() => {
    if (!isSupported)
      console.log(
        'DoMaDo: 현재 브라우저는 Screen Wake Lock API를 지원하지 않습니다.\nhttps://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API',
      );
  }, [isSupported]);

  /** 실질적으로 Wake Lock을 변경하는 useEffect 훅 (core 로직) */
  useEffect(() => {
    // known issue.
    // requested case가 발생한 순간에 웹 페이지의 탭이 백그라운드에 위치할 시 DOMException을 발생시킴.
    // 에러 타입에 대한 조사 후 handling 필요.
    switch (wakeLockStatus) {
      case 'requested':
        if (!isSupported) setWakeLockStatus('idle');
        else
          navigator.wakeLock.request('screen').then((newWakeLock) => {
            setWakeLock((prevWakeLock) => {
              prevWakeLock?.release();
              setWakeLockStatus('idle');
              return newWakeLock;
            });
          });
        break;
      case 'released':
        if (!wakeLock) setWakeLockStatus('idle');
        else
          wakeLock.release().then(() => {
            setWakeLock(null);
            setWakeLockStatus('idle');
          });
        break;
    }
  }, [wakeLock, wakeLockStatus, isSupported]);

  /** Wake Lock을 사용하는 상태로 변경, API 형태로 포장 */
  const requestWakeLock = useCallback(() => {
    setWakeLockStatus('requested');
  }, []);

  /** Wake Lock을 사용하지 않는 상태로 변경, API 형태로 포장 */
  const releaseWakeLock = useCallback(() => {
    setWakeLockStatus('released');
  }, []);

  return {
    /** Wake Lock 사용 */
    requestWakeLock,
    /** Wake Lock 해제 */
    releaseWakeLock,
    /** 현재 웹 브라우저의 기능 지원 여부 */
    isSupported,
  };
};
