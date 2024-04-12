import { useCallback } from 'react';

export function usePreventLeave() {
  // NOTE: useCallback으로 감싸지 않으면
  // addEventListener와 removeEventListener가 서로 다른 함수를 추가/삭제하는 문제가 발생함

  /** 페이지 전환 전 사용자에게 확인을 요청하도록 만드는 handler 함수 */
  const handler = useCallback(
    (e: { preventDefault: () => void; returnValue: string }) => {
      e.preventDefault();
      e.returnValue = '';
    },
    [],
  );

  const enablePrevent = () => window.addEventListener('beforeunload', handler);

  const disablePrevent = () =>
    window.removeEventListener('beforeunload', handler);

  return { enablePrevent, disablePrevent };
}
