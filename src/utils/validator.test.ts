import { describe, expect, test } from '@jest/globals';

import { isInteger } from './validator';

describe('validator module', () => {
  describe('isNumber는 문자열이 정수인지 확인한다.', () => {
    test('"1"은 정수다.', () => {
      expect(isInteger('1')).toBeTruthy();
    });

    test('"1.5"는 정수가 아니다.', () => {
      expect(isInteger('1.5')).not.toBeTruthy();
    });

    test('".5"는 정수가 아니다.', () => {
      expect(isInteger('.5')).not.toBeTruthy();
    });

    test('"뷁"은 숫자가 아니다.', () => {
      expect(isInteger('뷁')).not.toBeTruthy();
    });

    test('"1,000,000"은 정수가 아니다.', () => {
      expect(isInteger('1,000,000')).not.toBeTruthy();
    });

    test('"-1"은 정수다.', () => {
      expect(isInteger('-1')).toBeTruthy();
    });
  });
});
