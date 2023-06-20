import React, { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import { ArrowClockwise, QuestionCircleFill } from 'react-bootstrap-icons';

import ContentWithTitle from 'components/ContentWithTitle';
import WithLoading from 'components/Loading';
import Skeleton from 'components/Skeleton';
import { toStringDateByFormatting } from 'utils/date';
import { EventTimeLine } from 'types/diary';
import {
  DateRangePicker,
  Diary,
  Tabs,
  TimeLine,
  CustomWordCloud,
} from './components';
import SortTab from './components/SortTab/SortTab';
import useDashboard from './useDashboard';

const radios = [
  { name: '3일 전', value: '3', id: 1 },
  { name: '7일 전', value: '7', id: 2 },
  { name: '14일 전', value: '14', id: 3 },
];

const ButtonWithLoading = WithLoading(Button);

const tooltip = (
  <Tooltip id="tooltip">
    <strong>Holy guacamole!</strong> Check this info.
  </Tooltip>
);

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
  const [isRecentSortOrder, setSortOrder] = useState<boolean>(true);

  const {
    patientInfo,
    radioValue,
    onChange,
    dateRange,
    setDateRange,
    setRadioValue,
    isDateSelected,
    isLoading,
    onClick,
    diaryList,
    setDiaryList,
    tabData,
    dateInfo,
  } = useDashboard();

  const [wordCloudData, sensitiveWords, timeLineData] = useMemo(() => {
    if (diaryList === null || diaryList === undefined) {
      return [[], []];
    }

    const dangerWords: string[] = [];

    const wordFrequency = diaryList.reduce((acc: any, cur) => {
      if (cur.wordFrequency === undefined) {
        return acc;
      }
      cur.wordFrequency.forEach((frequency) => {
        if (frequency.sentiment === '위험') {
          dangerWords.push(frequency.word);
        }
        acc[frequency.word] = (acc[frequency.word] ?? 0) + frequency.count;
      });

      return acc;
    }, {});

    const timeLine = diaryList.reduce((acc: EventTimeLine[], cur) => {
      if (cur.eventSummary !== undefined) {
        const eventSummary = {
          ...cur.eventSummary[0],
          sessionStart: cur.sessionStart,
          date: toStringDateByFormatting(cur.sessionStart),
        };
        acc.push(eventSummary);
      }
      return acc;
    }, []);

    const wordCloud = Object.keys(wordFrequency).map((key) => ({
      text: key,
      value: wordFrequency[key],
    }));

    return [wordCloud, [...new Set(dangerWords)], timeLine.reverse()];
  }, [diaryList]);

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
                <p className="fs-5 fw-bold text-primary"> 작성 일기 보기 </p>
                <SortTab
                  sortOrder={isRecentSortOrder}
                  onClick={(v: boolean) => {
                    if (v !== isRecentSortOrder) {
                      setDiaryList(diaryList?.reverse());
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
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <Badge bg="primary">
                    Beta <QuestionCircleFill />
                  </Badge>
                </OverlayTrigger>

                <CustomWordCloud
                  data={wordCloudData}
                  sensitiveWords={sensitiveWords}
                />
              </ContentWithTitle>
              <ContentWithTitle title="주요 사건 및 감정 요약">
                <Card body>
                  <TimeLine data={timeLineData ?? []} />
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
