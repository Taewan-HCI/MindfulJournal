/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
  ToggleButton,
} from 'react-bootstrap';
import ContentWithTitle from '../components/ContentWithTitle';
import Diary from '../components/Diary';
import mockDiary from '../mocks/diaryData';

function Dashboard() {
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: '3일 전', value: '1', id: 1 },
    { name: '7일 전', value: '2', id: 2 },
    { name: '14일 전', value: '3', id: 3 },
  ];

  return (
    <div>
      <Container>
        <Row>
          <Col xs={4}>
            <div className="fs-3">
              나극복 환자의
              <br />
              <b>마음챙김 다이어리</b>
            </div>
            <ContentWithTitle title="환자 정보">
              <Card bg="light" border="light">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="text-secondary">성별/나이</div>
                    <div className="fs-6 me-2">남/28</div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="text-secondary">최근 진료일</div>
                    <div className="fs-6 me-2"> 2023.04.03</div>
                  </div>
                </Card.Body>
              </Card>
            </ContentWithTitle>
            <ContentWithTitle title="작성 일기 보기">
              {mockDiary.map((diary) => (
                <Diary key={diary.diaryNum} {...diary} />
              ))}
            </ContentWithTitle>
          </Col>

          <Col xs={8}>
            <Row>
              <Col xs={3}>
                <p className="fs-5 fw-bold text-primary">최근 기간 선택</p>
              </Col>
              <Col xs={9}>
                <ButtonGroup size="sm">
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={radio.id}
                      id={`radio-${idx}`}
                      type="radio"
                      variant="outline-primary"
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <p className="fs-5 fw-bold text-primary">분석할 날짜 지정</p>
              </Col>
              <Col xs={9}>
                <p className="fs-5 fw-bold text-primary">분석할 날짜 지정</p>
              </Col>
            </Row>
            <ContentWithTitle title="참여 수준">
              <div>테스트</div>
            </ContentWithTitle>
            <ContentWithTitle title="핵심 감정">
              <div>테스트</div>
            </ContentWithTitle>
            <ContentWithTitle title="주요 사건">
              <div>테스트</div>
            </ContentWithTitle>
            <ContentWithTitle title="긍정/부정 비율">
              <div>테스트</div>
            </ContentWithTitle>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
