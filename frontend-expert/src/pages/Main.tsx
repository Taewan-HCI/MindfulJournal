import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import diary from 'assets/image/diary.png';
import WithLoading from 'components/Loading';
import auth from 'apis/auth';

type SignInType = {
  username: string;
  password: string;
};

const ButtonWithLoading = WithLoading(Button);

function Main({ signIn }: { signIn: (t: string) => void }) {
  const [values, setValues] = useState<SignInType>({
    username: '',
    password: '',
  });
  const [isErrorOccured, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    setIsLoading(() => true);
    e.preventDefault();
    try {
      const data = await auth.signIn({ ...values });
      signIn(data.access_token);
      toast.success('로그인에 성공했습니다.');
      navigate('/');
    } catch (error) {
      console.error(error);
      setError(() => true);
    }
    setIsLoading(() => false);
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
          <ButtonWithLoading
            variant="primary"
            type="submit"
            disabled={!isFormFilled || isLoading}
            isLoading={isLoading}
          >
            <div>Sign In</div>
          </ButtonWithLoading>
        </div>
      </Form>
    </Container>
  );
}

export default Main;
