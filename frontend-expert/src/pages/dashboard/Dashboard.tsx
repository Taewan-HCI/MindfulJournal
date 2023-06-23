import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import { ArrowClockwise, QuestionCircleFill } from 'react-bootstrap-icons';

import { ContentWithTitle, RowWithTitle, Skeleton, Title } from 'components';
import WithLoading from 'components/Loading';
import radios from 'constants/modules';
import { toStringDateByFormatting } from 'utils/date';
import {
  DateRangePicker,
  Diary,
  Tabs,
  TimeLine,
  CustomWordCloud,
} from './components';
import SortTab from './components/SortTab/SortTab';
import useDashboard from './useDashboard';

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
  const [isRecentSortOrder, setSortOrder] = useState<boolean>(false);
  const {
    patientInfo,
    diaryList,
    tabData,
    dateData,
    moduleData,
    onChange,
    onClick,
    setDateRange,
    setRadioValue,
    setDiaryList,
    isLoading,
  } = useDashboard();

  const { wordCloudData, sensitiveWords, timeLineData } = moduleData;
  const { dateRange, dateInfo, radioValue, isDateSelected } = dateData;

  const { name, gender, age, recentVisitedDay } = { ...patientInfo };

  return (
    <div>
      <Container>
        <Row className="gx-5">
          <Col xs={4}>
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div className="fs-2 mt-2">
                {patientInfo ? <div>{`${name} 님의`}</div> : <Skeleton.Title />}
                <b>마음챙김 다이어리</b>
              </div>
            </div>
          </Col>
          <Col xs={8} className="ps-4">
            <Row className="mt-4">
              <Col xs={3}>
                <div className="fs-5 fw-bold text-primary my-auto">
                  분석할 날짜 지정
                </div>
              </Col>
              <Col xs={9} className="d-flex justify-content-between ">
                <>
                  <div>
                    <DateRangePicker
                      dateRange={dateRange}
                      setDateRange={(v) => {
                        setDateRange(v);
                        setRadioValue(null);
                      }}
                    />

                    {radios.map((radio, idx) => (
                      <ToggleButton
                        key={radio.id}
                        id={`radio-${idx}`}
                        type="radio"
                        variant="outline-primary"
                        name="radio"
                        size="sm"
                        className="mt-2 me-2"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={onChange}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </div>

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
                  <RowWithTitle title="성별/나이 ">
                    {patientInfo ? (
                      <div className="fs-6 me-2">{`${gender}/${age}`}</div>
                    ) : (
                      <div className="w-25">
                        <Skeleton.Text />
                      </div>
                    )}
                  </RowWithTitle>

                  <RowWithTitle title="최근 진료일">
                    {patientInfo ? (
                      <div className="fs-6 me-2">
                        {toStringDateByFormatting(
                          recentVisitedDay
                            ? recentVisitedDay[recentVisitedDay.length - 1]
                            : 0,
                        )}
                      </div>
                    ) : (
                      <div className="w-25">
                        <Skeleton.Text />
                      </div>
                    )}
                  </RowWithTitle>
                </Card.Body>
              </Card>
            </ContentWithTitle>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <Title title="작성 일기 보기" />
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
              <ContentWithTitle title="">
                <Title title="핵심 감정">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        <p className="text-left text-break">
                          <strong>
                            AI가 많이 언급된 단어를 분석했습니다. 결과가
                            정확하지 않을 수 있습니다.
                          </strong>
                          <br />
                          언급 빈도가 많을수록 글자 크기가 큽니다. 위험한 심리
                          상태를 나타내는 단어는 붉은색으로 표시됩니다.
                        </p>
                      </Tooltip>
                    }
                  >
                    <Badge bg="primary" className="ms-2">
                      Beta <QuestionCircleFill />
                    </Badge>
                  </OverlayTrigger>
                </Title>
                <CustomWordCloud
                  data={wordCloudData}
                  sensitiveWords={sensitiveWords}
                />
              </ContentWithTitle>
              <ContentWithTitle title="">
                <Title title="주요 사건 및 감정 요약">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        <p className="text-left text-break">
                          <strong>
                            AI가 일기의 주요 사건과 감정을 분석했습니다. 결과가
                            정확하지 않을 수 있습니다.
                          </strong>
                          <br />
                          굵은 글씨는 사건을 나타냅니다. 아래 설명은 사용자의
                          감정과 생각, 반응 등을 나타냅니다.
                        </p>
                      </Tooltip>
                    }
                  >
                    <Badge bg="primary" className="ms-2">
                      Beta <QuestionCircleFill />
                    </Badge>
                  </OverlayTrigger>
                </Title>
                <div className="px-2">
                  <TimeLine data={timeLineData ?? []} />
                </div>
              </ContentWithTitle>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
