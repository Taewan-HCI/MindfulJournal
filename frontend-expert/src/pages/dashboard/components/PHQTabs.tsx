import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import { PHQ_QUESTIONS, PHQ_RESPONSE } from 'constants/phq';

function TabContent({ tab, data }: { tab: string | null; data: number[] }) {
  if (tab === null) {
    return (
      <>
        <Card.Title>카드 제목</Card.Title>
        <Card.Text>please select tab</Card.Text>
      </>
    );
  }

  const filteredIndex = data.reduce((arr: number[], item, index) => {
    if (`${item}` === tab) {
      arr.push(index);
    }
    return arr;
  }, []);

  return (
    <Card.Text>
      {filteredIndex.map((i) => (
        <div>{PHQ_QUESTIONS[i]}</div>
      ))}
    </Card.Text>
  );
}

function PHQTabs() {
  const [key, setKey] = useState<string | null>('0');
  const keys = Object.keys(PHQ_RESPONSE);

  return (
    <Card>
      <Card.Header>
        <Nav
          variant="tabs"
          activeKey={key ?? '0'}
          onSelect={(k) => setKey(k)}
          fill
        >
          {keys.map((k) => (
            <Nav.Item key={k}>
              <Nav.Link eventKey={k}>
                <span>{PHQ_RESPONSE[parseInt(k as string, 10)]} </span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Card.Header>
      <Card.Body>
        <TabContent tab={key} data={[0, 0, 0, 0, 0, 1, 2, 2, 3]} />
      </Card.Body>
    </Card>
  );
}

export default PHQTabs;
