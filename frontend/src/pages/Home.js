import {React} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {useNavigate} from "react-router-dom";
import book_blue from "../img/book_blue.jpg";
import book_purple from "../img/book_purple.jpg";
import chat from "../img/chat.jpg";
import lock from "../img/lock.jpg";


function Home(props) {

    const navigate = useNavigate()

    function navigateToWriting() {
        navigate("/writing")
    }

    function navigateToReview() {
        navigate("/list")
    }


    return (
        <div>
            <Loading_complete userName={props.userName} navigateToWriting={navigateToWriting}
                              navigateToReview={navigateToReview}/>
        </div>
    )
}


function Loading_complete(props) {
    return (
        <Container>
            <Row>
                <div className="loading_box_home_top">
                    <div>
                        <b>안녕하세요 {props.userName}님</b> 😀<br/>마음챙김 다이어리에 오신걸 환영합니다.
                    </div>
                </div>
            </Row>
            <Row>
                <div className="loading_box_home_bottom">
                    <div>
                        📅 마지막으로 작성한 다이어리는 <b>23년 2월 28일</b> 일기에요.
                        <br/>
                        📖 지금까지 <b>12회</b> 일기를 작성하셨네요!
                    </div>
                </div>
                {/*<Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                style={{fontWeight: "600"}}
                                onClick={props.navigateToWriting}
                            >✏️ 일기 작성하기</Button>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                style={{fontWeight: "600"}}
                                onClick={props.navigateToReview}
                            >📖 일기 돌아보기</Button>
                        </div>

                    </Col>
                </Row>*/}
                <Row xs={1} md={2} className="g-4">
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={book_purple}/>
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
                            <Card.Img variant="top" src={book_blue}/>
                            <Card.Body>
                                <Card.Title><b>어떻게 적는건가요?</b></Card.Title>
                                <Card.Text>
                                    정신건강에 도움이 되는 일상 기록이란?
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Row>
            <div className="footer"></div>
        </Container>
    )
}

export default Home;