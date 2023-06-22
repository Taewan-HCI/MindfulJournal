import React from 'react';
import { EventTimeLine } from 'types/diary';
import './TimeLine.css';

function TimeLine({ data }: { data: EventTimeLine[] }) {
  return (
    <ul className="timeline">
      {data.map((d) => (
        <li className="timeline-item mb-5" key={d.sessionStart}>
          <p className="text-muted">{d.date}</p>
          <h6 className="fw-bold word-break">{d.event}</h6>
          <p className="word-break bg-light p-3">{d.emotion}</p>
        </li>
      ))}
    </ul>
  );
}

export default TimeLine;
