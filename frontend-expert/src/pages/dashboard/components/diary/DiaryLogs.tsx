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
import NULL_CHRACTER from 'constants/common';
import { NAME, NAME_STYLE, USER_TYPE } from 'constants/diary';

const USER_STYLE = [user, NAME_STYLE.USER, NAME.USER];
const ASSISTANT_STYLE = [assistant, NAME_STYLE.ASSISTANT, NAME.ASSISTANT];

/** 다어어리 모달에 채팅을 나타내는 컴포넌트. */
function ChatLog({ type, content }: { type: string; content: string }) {
  const [logoImage, nameStyle, authorName] =
    type === USER_TYPE ? USER_STYLE : ASSISTANT_STYLE;

  return (
    <div className="d-flex my-3">
      <img src={logoImage} alt="profile img" width="50" height="50" />
      <div className="ms-4">
        <span className={nameStyle}>
          <b>{authorName}</b>
        </span>
        <div>{content} </div>
      </div>
    </div>
  );
}

/** 다어어리 모달 안에 들어가는 부분이다. */
function EntireDiaryLogs({ diary }: { diary: Diary }) {
  const conversation = diary.conversation ?? [];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom">
        <div className=" py-2">
          <div className="fs-2">
            <b>
              {toStringDateByFormatting(diary.sessionStart)}{' '}
              {toStringTimeByFormatting(diary.sessionStart)}
            </b>
          </div>
          <div className="text-secondary">
            {secondsToTimeFormatting(diary.duration)} 참여 · {diary.length}자
            작성
          </div>
          <div className="text-primary"> 상담사명: {diary.operator}</div>
        </div>

        <div className="bg-light text-primary text-center border border-white rounded px-4 py-2">
          <div>PHQ-9</div>
          <div className="fs-3">{diary.phq9score ?? NULL_CHRACTER}</div>
        </div>
      </div>

      <Card bg="light" border="light">
        <Card.Body className="p-4">
          <Card.Title>
            <Journals />
            <span> 요약 </span>
          </Card.Title>
          <p className="text-secondary">{diary.diary}</p>
        </Card.Body>
      </Card>
      {conversation.map((log) => (
        <ChatLog type={log.role} content={log.content} key={log.id} />
      ))}
    </div>
  );
}

export default EntireDiaryLogs;
