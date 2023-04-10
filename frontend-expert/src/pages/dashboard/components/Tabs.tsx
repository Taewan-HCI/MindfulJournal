/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Calendar3, Stopwatch, TextLeft } from 'react-bootstrap-icons';
import TimeSeriesChart from './charts/TimeSeriesChart';
import MarkedCalander from './MarkedCalander/MarkedCalander';

function TabContent({ tab }: { tab: string | null }) {
  if (tab === null) {
    return (
      <>
        <Card.Title>카드 제목</Card.Title>
        <Card.Text>please select tab</Card.Text>
      </>
    );
  }
  const today = new Date();
  const mark = [today];

  if (tab === 'frequency') {
    return (
      <>
        <Card.Title>총 참여 횟수</Card.Title>
        <Card.Text>총 16회 참여했습니다.</Card.Text>
        <MarkedCalander mark={mark} />
      </>
    );
  }

  if (tab === 'avgtime') {
    return (
      <>
        <Card.Title>평균 참여 시간</Card.Title>
        <Card.Text>평균 8분 소모했습니다.</Card.Text>
        <TimeSeriesChart />
      </>
    );
  }

  return (
    <>
      <Card.Title>평균 작성 일기 길이</Card.Title>
      <Card.Text>평균 823자 작성했습니다.</Card.Text>
      <TimeSeriesChart />
    </>
  );
}

function Tabs() {
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
        <TabContent tab={key} />
      </Card.Body>
    </Card>
  );
}

export default Tabs;
