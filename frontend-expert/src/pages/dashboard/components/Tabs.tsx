/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Calendar3, Stopwatch, TextLeft } from 'react-bootstrap-icons';
import { ModuleData } from 'types/modules';
import { secondsToTimeFormatting } from 'utils/date';
import TimeSeriesChart from './charts/TimeSeriesChart';
import MarkedCalander from './MarkedCalander/MarkedCalander';

function TabContent({ tab, data }: { tab: string | null; data: ModuleData }) {
  if (tab === null) {
    return (
      <>
        <Card.Title>카드 제목</Card.Title>
        <Card.Text>please select tab</Card.Text>
      </>
    );
  }

  if (tab === 'frequency') {
    return (
      <>
        <Card.Title>총 참여 횟수</Card.Title>
        <Card.Text>총 {data.frequency.length}회 참여했습니다.</Card.Text>
        <MarkedCalander mark={data.frequency} />
      </>
    );
  }

  if (tab === 'avgtime') {
    const averageTime = Math.ceil(
      data.duration.reduce((sum, currValue) => sum + currValue.duration, 0) /
        data.duration.length,
    );

    return (
      <>
        <Card.Title>평균 참여 시간</Card.Title>
        <Card.Text>
          평균 {secondsToTimeFormatting(averageTime)} 소모했습니다.
        </Card.Text>
        <TimeSeriesChart
          data={data.duration}
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

  const averageLength = Math.ceil(
    data.length.reduce((sum, currValue) => sum + currValue.length, 0) /
      data.duration.length,
  );

  return (
    <>
      <Card.Title>평균 작성 일기 길이</Card.Title>
      <Card.Text>평균 {averageLength}자 작성했습니다.</Card.Text>
      <TimeSeriesChart
        data={data.length}
        xkey={['length']}
        labelFormatter={(value: number | string) => `${value}자`}
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
              <Stopwatch className="me-2" />
              <span>진행 시간 </span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="avglength">
              <TextLeft className="me-2" />
              <span>작성 분량 </span>
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
