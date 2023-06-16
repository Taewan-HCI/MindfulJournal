/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Badge, Button, Card, Modal } from 'react-bootstrap';
import EntireDiaryLogs from './EntireDiaryLogs';

interface ModalProps {
  onHide: () => void;
  show: boolean;
}
function DiaryContentsModal(modalProps: ModalProps) {
  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          일기 상세보기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-4">
        <EntireDiaryLogs />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={{ ...modalProps }.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Diary({
  createdAt,
  content,
  like,
}: {
  createdAt: number;
  content: string;
  like: number;
}) {
  const [modalShow, setModalShow] = useState(false);

  function leftPad(value: number) {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  }

  function toStringDateByFormatting(timeStamp: number) {
    const source = new Date(timeStamp * 1000);
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());
    return `${year}년 ${month}월 ${day}일`;
  }

  function toStringTimeByFormatting(timeStamp: number) {
    const source = new Date(timeStamp * 1000);
    return source.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  return (
    <>
      <Card
        className="my-2"
        style={{
          width: '100%',
        }}
        onClick={() => setModalShow(true)}
      >
        <Card.Body>
          <Card.Title className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-2">{toStringDateByFormatting(createdAt)}</div>
              <div className="fs-6 me-2">
                {toStringTimeByFormatting(createdAt)}
              </div>
            </div>
            <Badge bg="primary">8분 44초 </Badge>
          </Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            <div className="text-primary">우울함, 당황, 두려움</div>
          </Card.Subtitle>
          <Card.Text>{content}</Card.Text>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              ❤️
              <b>{like}</b>
            </div>
            <div className="fs-6 text-secondary">홍길동 상담사</div>
          </div>
        </Card.Body>
      </Card>
      <DiaryContentsModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default Diary;
