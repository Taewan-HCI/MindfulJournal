import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import diary from '../assets/image/diary.png';

function Main() {
  return (
    <Container className="d-flex align-items-center py-2  flex-column">
      <div className="d-flex align-items-center pt-5 flex-column">
        <img src={diary} alt="diray img" width="60" height="60" />
        <div className="fs-2 text-primary mt-2">
          <b>
            마음챙김
            <br />
            다이어리
          </b>
        </div>
      </div>
      <Form className="mt-5 w-25">
        <span className="text-primary mx-auto"> 로그인이 필요합니다. </span>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>ID</Form.Label>
          <Form.Control type="email" placeholder="Enter ID" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <div className="d-grid gap-1">
          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Main;
