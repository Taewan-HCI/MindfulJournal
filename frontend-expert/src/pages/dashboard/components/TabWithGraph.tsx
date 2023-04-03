import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Calendar3, Stopwatch, TextLeft } from 'react-bootstrap-icons';

function TabContent({ tab }: { tab: string | null }) {
  if (tab === null) return <div> please select tab </div>;
  if (tab === 'frequency') return <div>1회 참여했습니다.</div>;
  if (tab === 'avgtime') return <div>평균 8분 소모했습니다.</div>;
  return <div>142자 작성했습니다.</div>;
}

function TabWithGraph() {
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
        <Card.Title>카드 제목</Card.Title>
        <Card.Text>
          <TabContent tab={key} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TabWithGraph;
