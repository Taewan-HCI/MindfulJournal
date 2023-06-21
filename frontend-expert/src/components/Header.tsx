import React from 'react';
import { Container, Nav, Navbar, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Header({
  isLoggedIn,
  signOut,
}: {
  isLoggedIn: boolean;
  signOut: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand
            onClick={() => {
              navigate('/');
            }}
          >
            <Stack gap={0}>
              <div className="nav_title_black">마음챙김</div>
              <div className="nav_title_blue">다이어리</div>
            </Stack>
          </Navbar.Brand>

          <Nav className="me-auto">
            {isLoggedIn ? (
              <>
                <Nav.Link
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  <div className="nav_title_black">홈</div>
                </Nav.Link>
                <Nav.Link onClick={signOut}>
                  <div className="nav_title_black">로그아웃</div>
                </Nav.Link>
              </>
            ) : null}
          </Nav>
          <Nav>
            <Stack gap={0}>
              <div className="nav_title_blue">
                <b>전문가용 화면입니다.</b>
              </div>
            </Stack>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
