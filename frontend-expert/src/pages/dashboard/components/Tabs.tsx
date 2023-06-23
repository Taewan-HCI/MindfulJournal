/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Calendar3, ListCheck, PencilSquare } from 'react-bootstrap-icons';
import { ModuleData } from 'types/modules';
import { secondsToTimeFormatting } from 'utils/date';
import TimeSeriesChart from './charts/TimeSeriesChart';
import MarkedCalander from './MarkedCalander/MarkedCalander';

const SUM_INITIAL_VALUE = 0;

function TabContent({ tab, data }: { tab: string | null; data: ModuleData }) {
  if (tab === null) {
    return (
      <>
        <Card.Title>카드 제목</Card.Title>
        <Card.Text>please select tab</Card.Text>
      </>
    );
  }

  const { frequency, duration, phqScore } = data;

  if (tab === 'frequency') {
    return (
      <>
        <Card.Title>총 참여 횟수</Card.Title>
        <Card.Text>총 {frequency.length}회 참여했습니다.</Card.Text>
        <MarkedCalander mark={frequency} />
      </>
    );
  }

  if (tab === 'avgtime') {
    const averageTime = Math.ceil(
      duration.reduce(
        (sum, currValue) => sum + currValue.duration,
        SUM_INITIAL_VALUE,
      ) / duration.length,
    );

    const averageLength = Math.ceil(
      duration.reduce(
        (sum, currValue) => sum + currValue.length,
        SUM_INITIAL_VALUE,
      ) / duration.length,
    );

    return (
      <>
        <Card.Title>평균 참여 시간</Card.Title>
        <Card.Text>
          평균 {secondsToTimeFormatting(averageTime)} 소모, 평균 {averageLength}
          자 작성했습니다.
        </Card.Text>
        <TimeSeriesChart
          data={duration}
          xkey={['duration', 'length']}
          labelFormatter={(value: number | string, name: string) => {
            if (name === 'duration') {
              return secondsToTimeFormatting(value as number);
            }
            return `${value}자`;
          }}
        />
      </>
    );
  }

  const validPHQ = phqScore.filter(
    (e) => e.phq9score !== null && e.phq9score !== undefined,
  );

  const averagePHQ = Math.ceil(
    phqScore.reduce(
      (sum, currValue) => sum + (currValue.phq9score ?? 0),
      SUM_INITIAL_VALUE,
    ) / validPHQ.length,
  );

  return (
    <>
      <Card.Title>종합 PHQ9 점수</Card.Title>
      <Card.Text>평균 {averagePHQ}점 입니다.</Card.Text>
      <TimeSeriesChart
        data={data.phqScore}
        xkey={['phq9score']}
        labelFormatter={(value: number | string) => `${value}점`}
      />
    </>
  );
}

function Tabs({ tabData }: { tabData: ModuleData }) {
  const [key, setKey] = useState<string | null>('frequency');

  return (
    <Card>
      <Card.Header>
        <Nav
          variant="tabs"
          activeKey={key ?? 'frequency'}
          onSelect={(k) => setKey(k)}
          fill
        >
          <Nav.Item>
            <Nav.Link eventKey="frequency">
              <Calendar3 className="me-2" />
              <span>참여 빈도 </span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="avgtime">
              <PencilSquare className="me-2" />
              <span>참여량 </span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="avglength">
              <ListCheck className="me-2" />
              <span>PHQ-9 점수 </span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <TabContent tab={key} data={tabData} />
      </Card.Body>
    </Card>
  );
}

export default Tabs;
