import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import signIn from '../apis/auth';
import diary from '../assets/image/diary.png';

type SignInType = {
  username: string;
  password: string;
};

function Main() {
  const [values, setValues] = useState<SignInType>({
    username: '',
    password: '',
  });
  const [isErrorOccured, setError] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await signIn({ ...values });
      localStorage.setItem('accessToken', data.access_token);
    } catch (error) {
      console.error(error);
      setError(() => true);
    }
  };

  // eslint-disable-next-line operator-linebreak
  const isFormFilled =
    values.username.length !== 0 && values.password.length !== 0;

  return (
    <Container className="d-flex align-items-center py-2 flex-column">
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

      <Form onSubmit={onSubmit} className="mt-5 w-50">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter ID"
            name="username"
            onChange={handleChange}
            value={values.username}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            name="password"
            onChange={handleChange}
            value={values.password}
          />
        </Form.Group>

        {isErrorOccured ? (
          <span className="text-danger mx-auto">
            아이디와 비밀번호를 다시 확인해주세요.
          </span>
        ) : (
          <span className="text-primary mx-auto"> 로그인이 필요합니다. </span>
        )}
        <div className="d-grid gap-1">
          <Button variant="primary" type="submit" disabled={!isFormFilled}>
            Sign In
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Main;
