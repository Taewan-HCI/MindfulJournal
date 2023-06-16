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



function DiaryGuide3(props) {

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
                                <div>나의 일기를 포함한, 개인정보는 어떻게 관리되나요?</div>
                            </div>
                            <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={navigateToHome}>
                            🏠 홈으로 돌아가기
                        </Button>
                            <div className="loading_box_home_bottom">
                                <img src={lock} alt="Book" style={{width: '100%', height: 'auto'}} />
                                <span className="desktop-view" style={{ fontSize: '1.1rem' }}>
                                   <br/><br/>당연히, 여러분의 개인정보 보호는 우리의 최우선 과제입니다. 🛡️ 마음챙김 다이어리에서는 여러분이 작성한 일기와 개인정보를 매우 철저하게 보호하고 있습니다.<br/><br/>일기를 작성하면서 저장되는 모든 정보는 오로지 주치의만이 열람할 수 있습니다. 이 정보들은 의료진과 환자 간의 소통을 돕고, 서로의 이해를 높이며, 그 결과로 효과적인 진료를 가능하게 하는데 큰 도움이 됩니다. 다시말해, 마음챙김 다이어리를 통해 축적된 데이터는 의사선생님께서 당신의 상태를 더욱 정확하게 이해하고, 적절한 치료를 제공하는 데에 꼭 필요한 정보로 활용됩니다.<br/><br/>그러나, 그 이상의 목적으로 여러분의 개인정보와 일기 데이터를 이용하거나, 외부에 공개하는 일은 절대 없습니다. 우리는 여러분의 정보를 깊이 존중하며, 이를 철저히 보호하기 위한 다양한 보안 조치를 적용하고 있습니다.<br/><br/>마음챙김 다이어리와 함께 안전하게 일기를 작성하고, 자신을 발견하며, 성장해나가세요. 📝💕
                                    <br/><br/>
                                    다른 주제 보기<br/><span className="likebutton"
                                                      onClick={navigateToGuide}
                                                >️<u>일기쓰기와 정신건강?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide2}
                                                >️<u>누구와 말하는 건가요?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide4}
                                                >️<u>정신건강에 도움되는 일기쓰기란?</u><br/>
                            </span>
                    </span>

                                <span className="smartphone-view-text">
                                    <br/><br/>당연히, 여러분의 개인정보 보호는 우리의 최우선 과제입니다. 🛡️ 마음챙김 다이어리에서는 여러분이 작성한 일기와 개인정보를 매우 철저하게 보호하고 있습니다.<br/><br/>일기를 작성하면서 저장되는 모든 정보는 오로지 주치의만이 열람할 수 있습니다. 이 정보들은 의료진과 환자 간의 소통을 돕고, 서로의 이해를 높이며, 그 결과로 효과적인 진료를 가능하게 하는데 큰 도움이 됩니다. 다시말해, 마음챙김 다이어리를 통해 축적된 데이터는 의사선생님께서 당신의 상태를 더욱 정확하게 이해하고, 적절한 치료를 제공하는 데에 꼭 필요한 정보로 활용됩니다.<br/><br/>그러나, 그 이상의 목적으로 여러분의 개인정보와 일기 데이터를 이용하거나, 외부에 공개하는 일은 절대 없습니다. 우리는 여러분의 정보를 깊이 존중하며, 이를 철저히 보호하기 위한 다양한 보안 조치를 적용하고 있습니다.<br/><br/>마음챙김 다이어리와 함께 안전하게 일기를 작성하고, 자신을 발견하며, 성장해나가세요. 📝💕
                                    <br/><br/>
                                    다른 주제 보기<br/><span className="likebutton"
                                                      onClick={navigateToGuide}
                                                >️<u>일기쓰기와 정신건강?</u><br/>
                            </span>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide2}
                                                >️<u>누구와 말하는 건가요?</u><br/>
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


export default DiaryGuide3