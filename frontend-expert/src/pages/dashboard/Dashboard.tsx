/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useLocation } from 'react-router-dom';

import ContentWithTitle from 'components/ContentWithTitle';
import { getPatientInfo } from 'apis/patients';
import { getDiaryList } from 'apis/diary';
import mockDiary from 'mocks/diaryData';
import { toStringDateByFormatting } from 'utils/date';
import { PatientInfo } from 'types/patient';
import { DiaryInfo } from 'types/diary';
import {
  DateRangePicker,
  Diary,
  Tabs,
  TimeLine,
  CustomWordCloud,
  DisplayTooltip,
} from './components';

const radios = [
  { name: '3일 전', value: '1', id: 1 },
  { name: '7일 전', value: '2', id: 2 },
  { name: '14일 전', value: '3', id: 3 },
];

function Dashboard() {
  const [radioValue, setRadioValue] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<(null | Date)[]>([null, null]);
  const [show, setShow] = useState(true);
  const [countedNum, setCountedNum] = useState<number>(0);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>();
  const target = useRef<HTMLDivElement | null>(null);
  const [diaryList, setdiaryList] = useState<DiaryInfo[]>();

  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  const fetch = async () => {
    try {
      const userData = await getPatientInfo(userId);
      setPatientInfo(() => userData);

      const diaryData = await getDiaryList(userId);
      setdiaryList(() => diaryData.diary);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const data = useMemo(
    () => [
      { text: '자해', value: 2 },
      { text: '생각', value: 2 },
      { text: '부모님', value: 2 },
      { text: '고마운', value: 1 },
      { text: '면도', value: 1 },
      { text: '그럴', value: 1 },
      { text: '나', value: 1 },
      { text: '스스로가', value: 1 },
      { text: '한심하고', value: 1 },
      { text: '모습', value: 1 },
      { text: '남들이', value: 1 },
      { text: '더더욱', value: 1 },
      { text: '바보로', value: 1 },
      { text: '자기들은', value: 1 },
      { text: '잘났나', value: 1 },
      { text: '생각도', value: 1 },
      { text: '들지만', value: 1 },
      { text: '정작', value: 1 },
      { text: '사람들', value: 1 },
      { text: '앞에서면', value: 1 },
      { text: '한', value: 1 },
      { text: '마디도', value: 1 },
      { text: '못하니까', value: 1 },
    ],
    [],
  );

  const isDateSelected =
    radioValue !== null || (dateRange[0] !== null && dateRange[1] !== null);

  return (
    <div>
      <Container>
        <Row className="gx-5">
          <Col xs={4}>
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div className="fs-2 mt-2">
                {`${patientInfo?.name ?? ''} 환자의`}
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
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
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
                <DateRangePicker
                  dateRange={dateRange}
                  setDateRange={(v) => {
                    setDateRange(v);
                    setRadioValue(null);
                  }}
                />
                <Button
                  variant="primary"
                  className="my-auto"
                  disabled={!isDateSelected}
                >
                  <ArrowClockwise className="ml-4" />
                  <span className="px-2 fw-bold"> 적용 </span>
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
                    <div className="fs-6 me-2">
                      {`${patientInfo?.gender ?? ''}/${patientInfo?.age ?? ''}`}
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="text-secondary">최근 진료일</div>
                    <div className="fs-6 me-2">
                      {toStringDateByFormatting(
                        patientInfo?.recentVisitedDay
                          ? patientInfo.recentVisitedDay[
                              patientInfo.recentVisitedDay.length - 1
                            ]
                          : 0,
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </ContentWithTitle>
            <ContentWithTitle title="작성 일기 보기">
              {diaryList
                ? diaryList.map((diary) => (
                    <Diary key={diary.sessionNumber} diary={diary} />
                  ))
                : null}
            </ContentWithTitle>
          </Col>

          <Col xs={8}>
            <ContentWithTitle title="참여 수준">
              <Tabs />
            </ContentWithTitle>
            <ContentWithTitle title="핵심 감정">
              <CustomWordCloud
                data={data}
                target={target}
                setShow={setShow}
                setCountedNum={setCountedNum}
              />
              <DisplayTooltip
                target={target}
                show={show}
                countedNum={countedNum}
              />
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
