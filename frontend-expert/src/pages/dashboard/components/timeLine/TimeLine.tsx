import React from 'react';
import './TimeLine.css';

function TimeLine() {
  const data = [
    {
      contents: '바쁜 업무와 가족 행사 일정을 조화시키는 것에 대한 압박감',
      date: '23년 3월 11일',
      timestamp: 1,
    },
    {
      contents: '긴장감과 안정되지 못한 환경에 대한 불안함',
      date: '23년 3월 12일',
      timestamp: 2,
    },
    {
      contents: '우중충한 날씨와 우천으로 인한 우울한 기분',
      date: '23년 3월 13일',
      timestamp: 3,
    },
  ];
  return (
    <ul className="timeline">
      {data.map((d) => (
        <li className="timeline-item mt-2" key={d.timestamp}>
          <h6 className="fw-bold">{d.contents}</h6>
          <p className="text-muted">{d.date}</p>
        </li>
      ))}
    </ul>
  );
}

export default TimeLine;
