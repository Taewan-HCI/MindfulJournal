import {auth, provider} from "../firebase-config"
import {signInWithPopup} from 'firebase/auth'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie'
import Button from "react-bootstrap/Button";
import {React} from "react";
import Card from "react-bootstrap/Card";
import bookss from "../img/purple.jpg";
import chat from "../img/chatbubble.jpg";
import lock from "../img/lock.jpg";
import book from "../img/3d-book.jpg";


const cookies = new Cookies()

export const Auth = (props) => {


    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token", result.user.refreshToken);
            props.setIsAuth(true)
            props.setUserName(auth.currentUser.displayName)
        } catch (err) {
            console.error(err);
        }

    };

    return (
        <Container>
            <div className="login_box">
                📝 마음챙김 다이어리를 이용하려면 로그인해주세요
            </div>
            <Row>
                <Col>
                    <div className="d-grid gap-2">
                        <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={signInWithGoogle}>
                            구글 계정으로 로그인하기
                        </Button>
                    </div>
                </Col>

                <Col>

                </Col>
            </Row>

            <div className="auth-content">
                    <Row xs={1} md={2} className="g-4">
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={bookss}/>
                            <Card.Body>
                                <Card.Title><b>일기쓰기와 정신건강</b></Card.Title>
                                <Card.Text>
                                    일기를 작성하는 것이 어떻게 정신건강에 도움이 될까요?
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={chat}/>
                            <Card.Body>
                                <Card.Title><b>누구와 말하는 건가요?</b></Card.Title>
                                <Card.Text>
                                    마음챙김 다이어리가 어떻게 동작 원리에 대해 알아봅니다.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={lock}/>
                            <Card.Body>
                                <Card.Title><b>개인정보는 어떻게 관리되나요?</b></Card.Title>
                                <Card.Text>
                                   나의 데이터는 어떻게 관리되는지 알아봅니다.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={book}/>
                            <Card.Body>
                                <Card.Title><b>어떻게 적는건가요?</b></Card.Title>
                                <Card.Text>
                                    정신건강에 도움이 되는 일상 기록이란?
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </div>




        </Container>
    )
}

export default Auth;

