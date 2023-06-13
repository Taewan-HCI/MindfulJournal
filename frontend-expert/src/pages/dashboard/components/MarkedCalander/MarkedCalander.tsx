/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MarkedCalander.css';

function CalanderMark({
  mark,
  date,
  view,
}: {
  mark: Date[];
  date: Date;
  view: string;
}) {
  if (view !== 'month' || new Date().getTime() < date.getTime()) {
    //  달력 보기가 month view가 아닌 경우에 리턴
    //  타일을 순회하며 날짜가 일치하는지 확인하는데 진료일 이후의 기록은 체크하지 않으므로 리턴
    return;
  }

  const html = [];
  if (mark.find((x) => x.toDateString() === date.toDateString())) {
    html.push(<div className="dot" />);
  }

  return (
    <div className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100">
      {html}
    </div>
  );
}

function MarkedCalander({ mark }: { mark: Date[] }) {
  return (
    <Calendar
      locale="ko-KO" // 한글버전
      next2Label={null}
      prev2Label={null}
      formatDay={(locale, date) => `${date.getDate()}`}
      showWeekNumbers={false}
      tileDisabled={({ date }) => date.getTime() > new Date().getTime()}
      tileContent={({ date, view }) => CalanderMark({ mark, date, view })}
    />
  );
}

export default MarkedCalander;
