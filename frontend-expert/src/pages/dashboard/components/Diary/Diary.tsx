/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { getDiary } from 'apis/diary';
import Skeleton from 'components/Skeleton';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Diary as DiaryTepe, DiaryInfo } from 'types/diary';
import {
  secondsToTimeFormatting,
  toStringDateByFormatting,
  toStringTimeByFormatting,
} from 'utils/date';
import EntireDiaryLogs from '../EntireDiaryLogs';
import './diary.css';

interface ModalProps {
  onHide: () => void;
  diaryId: string;
  show: boolean;
}

function DiarySkeletonLog() {
  return (
    <div className="d-flex my-4">
      <Skeleton.Avatar />
      <div className="w-75 ms-3 d-flex flex-column gap-2 ">
        <div className="w-25">
          <Skeleton.Text />
        </div>
        <Skeleton.Text />
        <Skeleton.Text />
      </div>
    </div>
  );
}

function DiarySkeleton() {
  return (
    <>
      <div className="border-bottom mb-4 py-2">
        <Skeleton.Title className="mb-3" />
        <Skeleton.Title className="mb-2" />
      </div>
      <Skeleton
        backgroundColor="#f8f9fa"
        className="p-4 d-flex flex-column gap-2"
      >
        <Skeleton.Title className="mb-2" />
        <Skeleton.Text />
        <Skeleton.Text />
      </Skeleton>

      <>{Array(6).fill(<DiarySkeletonLog />)}</>
    </>
  );
}
function DiaryContentsModal(modalProps: ModalProps) {
  const [diary, setdiary] = useState<DiaryTepe>();
  const { diaryId, show, onHide } = modalProps;

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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          일기 상세보기
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="mx-4">
        {diary ? <EntireDiaryLogs diary={diary} /> : <DiarySkeleton />}
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
            <Badge bg="primary">{diary.operator}</Badge>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            <div className="text-primary">
              {secondsToTimeFormatting(diary.duration)} 참여 · {diary.length}자
              작성
            </div>
          </Card.Subtitle>
          <DiaryContents text={diary.diary} />
          <div className="d-flex align-items-center justify-content-between">
            <div>
              ❤️
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
