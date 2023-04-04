import React from 'react';
import { Container } from 'react-bootstrap';
import diary from '../assets/image/diary.png';

function Main() {
  return (
    <Container>
      <img className="mx-auto" src={diary} alt="diray img" />
      <div> 마음챙김 다이어리</div>
    </Container>
  );
}

export default Main;
