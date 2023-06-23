/* eslint-disable react-hooks/exhaustive-deps */
import { getDiary } from 'apis/diary';
import NULL_CHRACTER from 'constants/common';
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Diary as DiaryType, DiaryInfo } from 'types/diary';
import {
  secondsToTimeFormatting,
  toStringDateByFormatting,
  toStringTimeByFormatting,
} from 'utils/date';
import './diary.css';
import EntireDiaryLogs from './DiaryLogs';
import PHQTabs from './PHQTabs';
import DiarySkeleton from './Skeleton';

interface ModalProps {
  onHide: () => void;
  diaryId: string;
  show: boolean;
}

const HEART_EMOJI = '❤️';

function DiaryContentsModal(modalProps: ModalProps) {
  const [diary, setdiary] = useState<DiaryType>();
  const { diaryId, show, onHide } = modalProps;
  const EMPTY_ARRAY = Array(9).fill(null, 0, 9);

  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  const fetch = async () => {
    try {
      const diaryData = await getDiary(userId, diaryId);
      setdiary(() => diaryData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (show) {
      fetch();
    }
  }, [show]);

  return (
    <Modal
      onHide={onHide}
      show={show}
      dialogClassName="modal-vw65"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          일기 상세보기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-4">
        <Row className="gx-5">
          <Col xs={8}>
            {diary ? <EntireDiaryLogs diary={diary} /> : <DiarySkeleton />}
          </Col>
          <Col xs={4} className="ps-4">
            <Accordion className="sticky-top" defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>PHQ-9 Score</Accordion.Header>
                <Accordion.Body>
                  <PHQTabs scores={diary?.phq_item ?? EMPTY_ARRAY} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function DiaryContents({ text }: { text: string }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <Card.Text>
      <span>{isReadMore ? text.slice(0, 240) : text} </span>
      {text.length > 250 && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleReadMore();
          }}
          role="presentation"
          className="text-hover"
        >
          {isReadMore ? '...read more' : ' show less'}
        </span>
      )}
    </Card.Text>
  );
}

function Diary({ diary }: { diary: DiaryInfo }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Card
        className="mb-2 diary"
        style={{
          width: '100%',
          cursor: 'pointer',
        }}
        onClick={() => setModalShow(true)}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    {toStringDateByFormatting(diary.sessionStart)}
                  </div>
                  <div className="fs-6 me-2">
                    {toStringTimeByFormatting(diary.sessionStart)}
                  </div>
                </div>
              </Card.Title>
              <Card.Subtitle className="text-muted">
                <div className="text-primary">
                  {secondsToTimeFormatting(diary.duration)} 참여 ·{' '}
                  {diary.length}자 작성
                </div>
              </Card.Subtitle>
            </div>
            <div className="bg-light text-primary px-2 text-center border border-white rounded">
              <small>PHQ-9</small>
              <div>{diary.phq9score ?? NULL_CHRACTER}</div>
            </div>
          </div>

          <DiaryContents text={diary.diary} />
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {HEART_EMOJI}
              <b>{diary.like}</b>
            </div>
          </div>
        </Card.Body>
      </Card>
      <DiaryContentsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        diaryId={diary.sessionNumber}
      />
    </>
  );
}

export default Diary;
