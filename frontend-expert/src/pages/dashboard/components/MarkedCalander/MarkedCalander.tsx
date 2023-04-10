/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MarkedCalander.css';

function CalanderMark({ mark, date }: { mark: Date[]; date: Date }) {
  if (new Date().getTime() < date.getTime()) {
    return;
  }

  const html = [];
  if (mark.find((x) => x.toDateString() === date.toDateString())) {
    html.push(<div className="dot" />);
  }

  if (html.length === 0) {
    html.push(<div className="close" />);
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
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
      tileContent={({ date }) => CalanderMark({ mark, date })}
    />
  );
}

export default MarkedCalander;
