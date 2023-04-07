/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
  ToggleButton,
} from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons';
import ContentWithTitle from '../../components/ContentWithTitle';
import DateRangePicker from './components/datePicker/DateRangePicker';
import Diary from './components/Diary';
import mockDiary from '../../mocks/diaryData';
import Tabs from './components/Tabs';
import TimeLine from './components/timeLine/TimeLine';

function Dashboard() {
  const [radioValue, setRadioValue] = useState<string | null>(null);

  const radios = [
    { name: '3일 전', value: '1', id: 1 },
    { name: '7일 전', value: '2', id: 2 },
    { name: '14일 전', value: '3', id: 3 },
  ];

  return (
    <div>
      <Container>
        <Row className="gx-5">
          <Col xs={4}>
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div className="fs-2 mt-2">
                나극복 환자의
                <br />
                <b>마음챙김 다이어리</b>
              </div>
            </div>
          </Col>
          <Col xs={8} className="ps-4">
            <Row className="mt-2">
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
                      onChange={(e) => {
                        const select =
                          e.currentTarget.value === radioValue
                            ? null
                            : e.currentTarget.value;
                        setRadioValue(select);
                      }}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Col>
              <Col xs={3}>
                <div className="fs-5 fw-bold text-primary my-auto">
                  분석할 날짜 지정
                </div>
              </Col>
              <Col xs={9} className="d-flex justify-content-between ">
                <DateRangePicker />
                <Button variant="primary" className="my-auto">
                  <ArrowClockwise className="ml-4" />
                  <span className="px-2 fw-bold"> 분석 </span>
                </Button>
              </Col>
            </Row>
          </Col>

          <Col xs={4} className="border-end">
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
            <ContentWithTitle title="참여 수준">
              <Tabs />
            </ContentWithTitle>
            <ContentWithTitle title="핵심 감정">
              <Card body>핵심 감정의 나열</Card>
            </ContentWithTitle>
            <ContentWithTitle title="주요 사건">
              <Card body>
                <TimeLine />
              </Card>
            </ContentWithTitle>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
