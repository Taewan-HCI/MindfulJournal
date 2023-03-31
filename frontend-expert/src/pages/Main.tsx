/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ContentWithTitle from '../components/ContentWithTitle';

function Main() {
  const patientList = [
    {
      name: '김극복',
      id: 1,
      birthday: '1990/03/04',
      gender: 'male',
      age: 30,
      lastVisit: '2023/03/02',
    },
    {
      name: '나극복',
      id: 2,
      birthday: '1993/03/04',
      gender: 'female',
      age: 34,
      lastVisit: '2023/01/24',
    },
    {
      name: '최극복',
      id: 3,
      birthday: '1992/03/04',
      gender: 'male',
      age: 21,
      lastVisit: '2023/02/12',
    },
    {
      name: '강극복',
      id: 4,
      birthday: '1993/03/04',
      gender: 'female',
      age: 34,
      lastVisit: '2023/01/24',
    },
  ];
  return (
    <Container>
      <div className="fs-2 mt-2">
        <b>환자를 선택해주세요</b>
      </div>

      <ContentWithTitle title="환자 목록">
        <div className="d-flex  flex-wrap">
          {patientList.map((p) => (
            <div className="hover-zoom w-50 p-2" key={p.id}>
              <Link to={`dashboard/${p.id}`} style={{ textDecoration: 'none' }}>
                <Card bg="light" border="light" className="hover-zoom p-2">
                  <Card.Body>
                    <Card.Title>
                      {p.name}
                      <span className="text-secondary fs-6">
                        ({p.gender}/{p.age})
                      </span>
                    </Card.Title>
                    <div className="d-flex align-items-center py-2">
                      <div className="text-secondary">최근 진료일: </div>
                      <div className="fs-6 me-2"> {p.lastVisit}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </ContentWithTitle>
    </Container>
  );
}

export default Main;
