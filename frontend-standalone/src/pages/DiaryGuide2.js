import {useEffect, useState, useRef} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import book_blue from "../img/book_blue.jpg";
import book_purple from "../img/book_purple.jpg";
import chat from "../img/chat.jpg";
import lock from "../img/lock.jpg";
import Col from 'react-bootstrap/Col';
import React from 'react';
import Card from 'react-bootstrap/Card';
import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    getDocs,
    setDoc,
    updateDoc,
    increment
} from "firebase/firestore";
import {auth, db} from "../firebase-config";
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";



function DiaryGuide2(props) {

    const navigate = useNavigate()


    const [diaryList, setDiaryList] = useState([])
    const updateProgress = useRef(true)
    const [emptyList, setEmptyList] = useState(false)
    const [refresh, setRefresh] = useState(1)


    useEffect(() => {

    })

    function navigateToHome() {
        navigate("/")
    }

    function navigateToGuide() {
        navigate("/guide")
    }
    function navigateToGuide2() {
        navigate("/guide2")
    }
    function navigateToGuide3() {
        navigate("/guide3")
    }
    function navigateToGuide4() {
        navigate("/guide4")
    }




        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <div className="diarylist_box">
                                <div>누구와 얘기하는건가요?<br/>마음챙김 다이어리가 어떻게 동작 원리에 대해 알아봅니다.</div>
                            </div>
                            <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={navigateToHome}>
                            🏠 홈으로 돌아가기
                        </Button>
                            <div className="loading_box_home_bottom">
                                <img src={chat} alt="Book" style={{width: '100%', height: 'auto'}} />
                                <span className="desktop-view" style={{ fontSize: '1.1rem' }}>
                                   <br/><br/>마음챙김 다이어리는 새로운 일기쓰기 방법을 제안합니다. 📝 일기를 쓰는 것이 어려우신가요? 펜을 들고 무슨 말을 써야 할지 고민되시나요? 그럼 이제부터 그런 걱정은 안 하셔도 됩니다. 마음챙김 다이어리 앱에서는 마치 친구와 이야기를 나누는 것처럼 자연스럽게 여러분의 일기를 작성할 수 있도록 도와줍니다.<br/><br/>"마음챙김 다이어리에서 여러분은 온전히 당신만의 인공지능과 함께 대화를 하며 일기를 작성할 수 있습니다. 여러분이 하고 싶은 이야기, 느낌, 생각 등을 단지 자유롭게 마음껏 말하시면 됩니다. 그러면 인공지능은 여러분의 목소리를 듣고, 이를 텍스트로 변환하여 일기로 기록합니다. 마치 여러분이 직접 일기를 쓴 것처럼 말이죠!<br/><br/>이처럼, 마음챙김 다이어리 앱은 여러분이 살아가면서 느끼는 일상의 순간들, 감정들을 솔직하게 표현하고 기록할 수 있는 공간을 제공합니다. 이 모든 것이 여러분의 이야기를 들려주는 것으로부터 시작되니까요. 그저 마음껏 말하고, 그 순간의 감정과 생각을 기록해보세요. 그러면 마음챙김 다이어리가 여러분의 이야기를 담아낸 일기로 만들어드릴께요.💖
                                    <br/><br/>
                                    다른 주제 보기<br/><span className="likebutton"
                                                      onClick={navigateToGuide}
                                                >️<u>일기쓰기와 정신건강?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide3}
                                                >️<u>개인정보는 어떻게 관리되나요?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide4}
                                                >️<u>정신건강에 도움되는 일기쓰기란?</u><br/>
                            </span>


                    </span>

                                <span className="smartphone-view-text">
                                    <br/><br/>마음챙김 다이어리는 새로운 일기쓰기 방법을 제안합니다. 📝 일기를 쓰는 것이 어려우신가요? 펜을 들고 무슨 말을 써야 할지 고민되시나요? 그럼 이제부터 그런 걱정은 안 하셔도 됩니다. 마음챙김 다이어리 앱에서는 마치 친구와 이야기를 나누는 것처럼 자연스럽게 여러분의 일기를 작성할 수 있도록 도와줍니다.<br/><br/>"마음챙김 다이어리에서 여러분은 온전히 당신만의 인공지능과 함께 대화를 하며 일기를 작성할 수 있습니다. 여러분이 하고 싶은 이야기, 느낌, 생각 등을 단지 자유롭게 마음껏 말하시면 됩니다. 그러면 인공지능은 여러분의 목소리를 듣고, 이를 텍스트로 변환하여 일기로 기록합니다. 마치 여러분이 직접 일기를 쓴 것처럼 말이죠!<br/><br/>이처럼, 마음챙김 다이어리 앱은 여러분이 살아가면서 느끼는 일상의 순간들, 감정들을 솔직하게 표현하고 기록할 수 있는 공간을 제공합니다. 이 모든 것이 여러분의 이야기를 들려주는 것으로부터 시작되니까요. 그저 마음껏 말하고, 그 순간의 감정과 생각을 기록해보세요. 그러면 마음챙김 다이어리가 여러분의 이야기를 담아낸 일기로 만들어드릴께요.💖
                                    <br/><br/>
                                    다른 주제 보기<br/><span className="likebutton"
                                                      onClick={navigateToGuide}
                                                >️<u>일기쓰기와 정신건강?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide3}
                                                >️<u>개인정보는 어떻게 관리되나요?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide4}
                                                >️<u>정신건강에 도움되는 일기쓰기란?</u><br/>
                            </span>

                    </span>
                            </div>
                            <br/><Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={navigateToHome}>
                            🏠 홈으로 돌아가기
                        </Button>
                        </Col>

                    </Row>
                    <div className="footer"></div>
                </Container>
            </div>
        )



}


export default DiaryGuide2