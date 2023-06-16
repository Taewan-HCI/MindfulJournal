/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Alert,
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
import { endOfDay, startOfDay } from 'date-fns';
import { toast } from 'react-toastify';

import ContentWithTitle from 'components/ContentWithTitle';
import WithLoading from 'components/Loading';
import Skeleton from 'components/Skeleton';

import { getPatientInfo } from 'apis/patients';
import { getFrequencybyPeriod, getLengthbyPeriod } from 'apis/modules';
import { getDiarybyPeriod, getDiaryList } from 'apis/diary';
import { DatetoUnixTimeStamp, toStringDateByFormatting } from 'utils/date';
import { PatientInfo } from 'types/patient';
import { DiaryInfo } from 'types/diary';
import { ModuleData } from 'types/modules';
import {
  DateRangePicker,
  Diary,
  Tabs,
  TimeLine,
  CustomWordCloud,
} from './components';
import SortTab from './components/SortTab/SortTab';

interface Data {
  sesssionEnd: number;
  operator: string;
  duration: number;
  length: number;
}

const radios = [
  { name: '3일 전', value: '3', id: 1 },
  { name: '7일 전', value: '7', id: 2 },
  { name: '14일 전', value: '14', id: 3 },
];

const ButtonWithLoading = WithLoading(Button);

function DiarySkeleton() {
  return (
    <div className=" p-2">
      <Skeleton
        backgroundColor="#f8f9fa"
        className="p-4 d-flex flex-column gap-2"
      >
        <Skeleton.Title className="mb-3" />
        <>{Array(3).fill(<Skeleton.Text />)}</>
      </Skeleton>
    </div>
  );
}

function Dashboard() {
  const [radioValue, setRadioValue] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<(null | Date)[]>([null, null]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [patientInfo, setPatientInfo] = useState<PatientInfo>();
  const [diaryList, setdiaryList] = useState<DiaryInfo[]>();
  const [tabData, setTabData] = useState<ModuleData>();

  const [isRecentSortOrder, setSortOrder] = useState<boolean>(false);
  const dateInfo = useRef<number[]>([]);

  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  const fetchByPeriod = async (startDate: number, endDate: number) => {
    try {
      const diaryData = await getDiarybyPeriod(userId, startDate, endDate);
      const modulesData = await getLengthbyPeriod(userId, startDate, endDate);
      const frequencyData = await getFrequencybyPeriod(
        userId,
        startDate,
        endDate,
      ).then((data) => data.num.map((date: number) => new Date(date * 1000)));

      const lengthData = modulesData.diary.map((d: Data) => {
        const { operator, duration, ...data } = d;
        return data;
      });

      const durationdata = modulesData.diary.map((d: Data) => {
        const { operator, ...data } = d;
        return data;
      });

      const tab = {
        frequency: frequencyData,
        duration: durationdata,
        length: lengthData,
      };

      toast.success('데이터를 불러왔습니다.');

      setTabData(() => tab);
      setdiaryList(() => diaryData.diary);

      dateInfo.current = [startDate, endDate];
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다.');
      console.error(error);
    }
    setIsLoading(() => false);
  };

  const fetch = async () => {
    try {
      const userData = await getPatientInfo(userId);
      const diaryData = await getDiaryList(userId);

      setPatientInfo(() => userData);
      setdiaryList(() => diaryData.diary);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {}, [diaryList?.toString]);

  const onClick = () => {
    setIsLoading(() => true);
    if (dateRange[0] === null || dateRange[1] === null) {
      return;
    }
    const startDate = DatetoUnixTimeStamp(dateRange[0]);
    const endDate = DatetoUnixTimeStamp(endOfDay(dateRange[1]));

    fetchByPeriod(startDate, endDate);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const today = new Date();
    const tartgetDay = startOfDay(
      new Date(
        today.setDate(
          today.getDate() - parseInt(e.currentTarget.value, 10) + 1,
        ),
      ),
    );

    setDateRange(() => [tartgetDay, endOfDay(new Date())]);
    setRadioValue(e.currentTarget.value);
  };

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
                {patientInfo ? (
                  <div>{`${patientInfo?.name} 님의`}</div>
                ) : (
                  <Skeleton.Title />
                )}
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
                      onChange={onChange}
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
                <>
                  <DateRangePicker
                    dateRange={dateRange}
                    setDateRange={(v) => {
                      setDateRange(v);
                      setRadioValue(null);
                    }}
                  />
                  <ButtonWithLoading
                    variant="primary"
                    className="my-auto"
                    disabled={!isDateSelected || isLoading}
                    onClick={onClick}
                    isLoading={isLoading}
                  >
                    <>
                      <ArrowClockwise className="ml-4" />
                      <span className="px-2 fw-bold"> 적용 </span>
                    </>
                  </ButtonWithLoading>
                </>
              </Col>
            </Row>
          </Col>

          <Col xs={4} className="border-end">
            <ContentWithTitle title="환자 정보">
              <Card bg="light" border="light">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="text-secondary">성별/나이</div>
                    {patientInfo ? (
                      <div className="fs-6 me-2">
                        {`${patientInfo.gender}/${patientInfo.age}`}
                      </div>
                    ) : (
                      <div className="w-25">
                        <Skeleton.Text />
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center justify-content-between py-2">
                    <div className="text-secondary">최근 진료일</div>
                    {patientInfo ? (
                      <div className="fs-6 me-2">
                        {toStringDateByFormatting(
                          patientInfo?.recentVisitedDay
                            ? patientInfo.recentVisitedDay[
                                patientInfo.recentVisitedDay.length - 1
                              ]
                            : 0,
                        )}
                      </div>
                    ) : (
                      <div className="w-25">
                        <Skeleton.Text />
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </ContentWithTitle>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <p className="fs-5 fw-bold text-primary">작성 일기 보기 </p>
                <SortTab
                  sortOrder={isRecentSortOrder}
                  onClick={(v: boolean) => {
                    if (v !== isRecentSortOrder) {
                      setdiaryList(diaryList?.reverse());
                      setSortOrder((prev) => !prev);
                    }
                  }}
                />
              </div>
              {diaryList ? (
                diaryList.map((diary) => (
                  <Diary key={diary.sessionNumber} diary={diary} />
                ))
              ) : (
                <>{Array(3).fill(<DiarySkeleton />)}</>
              )}
            </div>
          </Col>

          {tabData === undefined ? (
            <Col xs={8}>
              <Alert variant="warning"> 조회할 날짜를 선택해주세요.</Alert>
            </Col>
          ) : (
            <Col xs={8}>
              <Alert variant="info">
                {toStringDateByFormatting(dateInfo.current[0])} -
                {toStringDateByFormatting(dateInfo.current[1])} 에 해당하는
                기록입니다.
              </Alert>
              <ContentWithTitle title="참여 수준">
                <Tabs tabData={tabData} />
              </ContentWithTitle>
              <ContentWithTitle title="핵심 감정">
                <CustomWordCloud data={data} />
                <Card body>핵심 감정의 나열</Card>
              </ContentWithTitle>
              <ContentWithTitle title="주요 사건">
                <Card body>
                  <TimeLine />
                </Card>
              </ContentWithTitle>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
