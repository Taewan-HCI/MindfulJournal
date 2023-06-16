/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Card } from 'react-bootstrap';
import { Journals } from 'react-bootstrap-icons';
import assistant from 'assets/image/assistant.png';
import user from 'assets/image/user.png';
import { Diary } from 'types/diary';
import {
  secondsToTimeFormatting,
  toStringDateByFormatting,
  toStringTimeByFormatting,
} from 'utils/date';

function ChatLog({ type, content }: { type: string; content: string }) {
  const logoImage = type === 'user' ? user : assistant;
  const nameStyle = type === 'user' ? '' : 'text-primary';
  const authorName = type === 'user' ? '사용자' : '상담사';
  return (
    <div className="d-flex my-3">
      <img src={logoImage} alt="profile img" width="50" height="50" />
      <div className="ms-4">
        <span className={nameStyle}>
          <b>{authorName}</b>
        </span>
        <span className="text-secondary ms-2"> 22:50 PM </span>

        <div>{content} </div>
      </div>
    </div>
  );
}

function EntireDiaryLogs({ diary }: { diary: Diary | undefined }) {
  const conversation = diary?.conversation ?? [];
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom">
        <div className=" py-2">
          <div className="fs-2">
            <b>
              {toStringDateByFormatting(diary?.sessionStart)}{' '}
              {toStringTimeByFormatting(diary?.sessionStart)}
            </b>
          </div>
          <div className="text-secondary">
            {secondsToTimeFormatting(diary?.duration)} 참여 · {diary?.length}자
            작성
          </div>
          <div className="text-primary"> 상담사명: {diary?.operator}</div>
        </div>

        <div className="bg-light text-primary text-center border border-white rounded px-4 py-2">
          <div>PHQ-9</div>
          <div className="fs-3">12</div>
        </div>
      </div>

      <Card bg="light" border="light">
        <Card.Body className="p-4">
          <Card.Title>
            <Journals />
            <span> 요약 </span>
          </Card.Title>
          <p className="text-secondary">{diary?.diary}</p>
        </Card.Body>
      </Card>
      {conversation.map((log) => (
        <ChatLog type={log.role} content={log.content} key={log.id} />
      ))}
    </div>
  );
}

export default EntireDiaryLogs;
