/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Badge, Button, Card, Modal } from 'react-bootstrap';
import { DiaryInfo } from 'types/diary';
import { toStringDateByFormatting, toStringTimeByFormatting } from 'utils/date';
import EntireDiaryLogs from '../EntireDiaryLogs';
import './diary.css';

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

function Diary({ diary }: { diary: DiaryInfo }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Card
        className="my-2 diary"
        style={{
          width: '100%',
          cursor: 'pointer',
        }}
        onClick={() => setModalShow(true)}
      >
        <Card.Body>
          <Card.Title className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-2">
                {toStringDateByFormatting(diary.sessionStart)}
              </div>
              <div className="fs-6 me-2">
                {toStringTimeByFormatting(diary.sessionStart)}
              </div>
            </div>
            <Badge bg="primary">홍길동 상담사 </Badge>
          </Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            <div className="text-primary">8분 30초 참여 · 3032자 작성</div>
          </Card.Subtitle>
          <Card.Text>{diary.diary}</Card.Text>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              ❤️
              <b>{diary.like}</b>
            </div>
          </div>
        </Card.Body>
      </Card>
      <DiaryContentsModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

export default Diary;
