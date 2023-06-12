/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Calendar3, Stopwatch, TextLeft } from 'react-bootstrap-icons';
import { ModuleData } from 'types/modules';
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
  const today = new Date();
  const sampleDay = new Date('2023-04-01 10:20:30');
  const mark = [today, sampleDay];

  console.log(data);

  if (tab === 'frequency') {
    return (
      <>
        <Card.Title>총 참여 횟수</Card.Title>
        <Card.Text>총 {data?.frequency?.length ?? 0}회 참여했습니다.</Card.Text>
        <MarkedCalander mark={data?.frequency ?? mark} />
      </>
    );
  }

  if (tab === 'avgtime') {
    return (
      <>
        <Card.Title>평균 참여 시간</Card.Title>
        <Card.Text>평균 8분 소모했습니다.</Card.Text>
        <TimeSeriesChart data={data.duration} xkey="duration" />
      </>
    );
  }

  return (
    <>
      <Card.Title>평균 작성 일기 길이</Card.Title>
      <Card.Text>평균 823자 작성했습니다.</Card.Text>
      <TimeSeriesChart data={data.length} xkey="length" />
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
