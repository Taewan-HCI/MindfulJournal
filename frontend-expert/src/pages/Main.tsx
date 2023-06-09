<<<<<<< HEAD
import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signIn from 'apis/auth';
import diary from 'assets/image/diary.png';

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
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await signIn({ ...values });
      localStorage.setItem('accessToken', data.access_token);
      toast.success('로그인에 성공했습니다.');
      navigate('/patients');
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
=======
import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import diary from '../assets/image/diary.png';

function Main() {
  return (
    <Container className="d-flex align-items-center py-2  flex-column">
>>>>>>> 7c25c1d04730ed9e085883186fdfeeff96e4e455
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
<<<<<<< HEAD

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
=======
      <Form className="mt-5 w-25">
        <span className="text-primary mx-auto"> 로그인이 필요합니다. </span>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>ID</Form.Label>
          <Form.Control type="email" placeholder="Enter ID" />
>>>>>>> 7c25c1d04730ed9e085883186fdfeeff96e4e455
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
<<<<<<< HEAD
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
=======
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <div className="d-grid gap-1">
          <Button variant="primary" type="submit">
>>>>>>> 7c25c1d04730ed9e085883186fdfeeff96e4e455
            Sign In
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Main;
