/**
 * 문자열 데이터가 정수로 변환 가능한지 확인하는 유틸 함수.
 * @param strValue
 * @returns
 */
export function isInteger(strValue: number | string): boolean {
  if (!strValue) return true;

  const numValue = +strValue;

  return !isNaN(numValue) && Number.isInteger(numValue);
}
