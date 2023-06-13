function leftPad(value: number) {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
}

/**
 * Unix timestamp를 넣으면 0000년 00월 00일로 변형해서 리턴
 */
export function toStringDateByFormatting(timeStamp: number | undefined) {
  if (timeStamp === undefined) {
    return '';
  }
  const source = new Date(timeStamp * 1000);
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Unix timestamp를 넣으면 00:00 (AM/PM)으로 변환해서 리턴
 */
export function toStringTimeByFormatting(timeStamp: number | undefined) {
  if (timeStamp === undefined) {
    return '';
  }

  const source = new Date(timeStamp * 1000);
  return source.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

/**
 * 값과 unit를 넣으면 값의 유무에 따라 빈 문자열 혹은 unit을 붙여서 리턴
 */
function returnWithUnit(value: number, unit = '') {
  if (value === 0) return '';
  return `${value}${unit}`;
}

/**
 * 초를 넣으면 0시 0분 0초로 변환해서 리턴
 */
export function secondsToTimeFormatting(seconds: number | undefined) {
  if (seconds === undefined) {
    return '';
  }

  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds % 3600) / 60);
  const second = (seconds % 3600) % 60;

  return `${returnWithUnit(hour, '시')} ${returnWithUnit(
    minute,
    '분',
  )} ${returnWithUnit(second, '초')}`;
}

export function DatetoUnixTimeStamp(d: Date) {
  return Math.floor(d.getTime() / 1000);
}
