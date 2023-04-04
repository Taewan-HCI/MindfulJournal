import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import diary from '../assets/image/diary.png';

function Main() {
  return (
    <Container className="d-flex align-items-center py-2 px-auto flex-column">
      <img src={diary} alt="diray img" width="60" height="60" />
      <div className="fs-3"> 마음챙김 다이어리</div>

      <Form className="mt-5">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>ID</Form.Label>
          <Form.Control type="email" placeholder="Enter ID" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </Container>
  );
}

export default Main;
