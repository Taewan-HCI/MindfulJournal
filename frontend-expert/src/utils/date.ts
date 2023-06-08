function leftPad(value: number) {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
}

/**
 * timestamp를 넣으면 0000년 00월 00일로 변형해서 리턴
 */
export function toStringDateByFormatting(timeStamp: number) {
  const source = new Date(timeStamp * 1000);
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * timestamp를 넣으면 00:00 (AM/PM)으로 변환해서 리턴
 */
export function toStringTimeByFormatting(timeStamp: number) {
  const source = new Date(timeStamp * 1000);
  return source.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}
