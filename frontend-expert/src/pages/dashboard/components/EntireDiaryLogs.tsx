/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Card } from 'react-bootstrap';
import { Journals } from 'react-bootstrap-icons';
import assistant from '../../../assets/image/assistant.png';
import user from '../../../assets/image/user.png';

function ChatLog({
  type,
  contents,
}: {
  type: 'assistant' | 'user';
  contents: string;
}) {
  const logoImage = type === 'user' ? user : assistant;
  const nameStyle = type === 'user' ? '' : 'text-primary';
  return (
    <div className="d-flex my-3">
      <img src={logoImage} alt="profile img" width="50" height="50" />
      <div className="ms-4">
        <span className={nameStyle}>
          <b>{type}</b>
        </span>
        <span className="text-secondary ms-2"> 22:50 PM </span>

        <div>{contents} </div>
      </div>
    </div>
  );
}

function EntireDiaryLogs() {
  return (
    <div className="mb-4">
      <div className="border-bottom mb-4 py-2">
        <div className="fs-2">
          <b>자전거타기, 기쁨, 상쾌함</b>
        </div>
        <div className="text-secondary">
          2023년 3월 10일 18:44 , 8분 44초 소요
        </div>
        <div className="text-primary"> 상담사명: 홍길동</div>
      </div>
      <Card bg="light" border="light">
        <Card.Body className="p-4">
          <Card.Title>
            <Journals />
            <span> 요약 </span>
          </Card.Title>
          <p className="text-secondary">
            오늘은 금요일이라서 기분이 평소보다는 좋았다. 하지만, 특별한 일은
            없었고 그냥 마무리하려는 느낌으로 하루를 보냈다. 하지만, 가장 기억에
            남는 일은 집에 돌아오는 길이었다. 특별한 일은 없었고 그냥
            마무리하려는 느낌으로 하루를 보냈
          </p>
        </Card.Body>
      </Card>
      <ChatLog type="assistant" contents="날이 화창하군" />
      <ChatLog type="user" contents="날이 화창하군" />
      <ChatLog type="assistant" contents="날이 화창하군" />
      <ChatLog type="assistant" contents="날이 화창하군" />
      <ChatLog type="assistant" contents="날이 화창하군" />{' '}
      <ChatLog type="assistant" contents="날이 화창하군" />
      <ChatLog
        type="user"
        contents="오늘은 금요일이라서 기분이 평소보다는 좋았다. 하지만, 특별한 일은
            없었고 그냥 마무리하려는 느낌으로 하루를 보냈다. 하지만, 가장 기억에
            남는 일은 집에 돌아오는 길이었다. 특별한 일은 없었고 그냥
            마무리하려는 느낌으로 하루를 보냈"
      />
    </div>
  );
}

export default EntireDiaryLogs;
