// useToast.ts
/**
 * toast 관련 설정들을 미리 정의해 hook으로 묶어둬
 * 다른 컴포넌트에서 설정에 직접 관여할 필요 없도록 함
 */

import { useCallback } from 'react';
import { toast, ToastOptions, TypeOptions } from 'react-toastify';

export const useToast = () => {
  return useCallback((msg: string, type: TypeOptions = 'success') => {
    const options: ToastOptions = {
      autoClose: 2500,
      icon: false,
      type,
    };

    toast(msg, options);
  }, []);
};
