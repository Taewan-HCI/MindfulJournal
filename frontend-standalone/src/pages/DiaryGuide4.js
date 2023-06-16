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



function DiaryGuide4(props) {

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
                                <div>정신건강에 도움이 되는 일기는 어떻게 작성해야할까요?</div>
                            </div>
                            <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={navigateToHome}>
                            🏠 홈으로 돌아가기
                        </Button>
                            <div className="loading_box_home_bottom">
                                <img src={book_blue} alt="Book" style={{width: '100%', height: 'auto'}} />
                                <span className="desktop-view" style={{ fontSize: '1.1rem' }}>
                                   <br/><br/>정신 건강에 도움이 되는 일기 작성은 솔직하고, 직관적이며, 그리고 본인을 진정으로 반영하는 것이 중요합니다. 아래는 그 방법에 대한 간략한 가이드입니다:<br/><br/>📝 솔직하게 쓰기: 일기는 당신만의 공간이므로, 본인의 감정과 생각을 솔직하게 표현해보세요. 이는 본인의 내면을 이해하는 첫걸음이 될 수 있습니다.<br/><br/>🎯 구체적으로 쓰기: 일어난 일이나 느낀 감정을 구체적으로 설명해보세요. 이는 상황을 더 잘 이해하고, 감정에 대한 통찰력을 키울 수 있게 합니다.<br/><br/>💭 자기 성찰하기: 당신이 어떤 행동을 했는지, 그리고 그 행동이 당신의 생각과 감정에 어떤 영향을 미쳤는지를 고민해보세요. 이는 자기 이해와 자아 성장에 큰 도움이 됩니다.<br/><br/>🌈 긍정적인 면도 포함하기: 항상 어려운 부분만을 집중하지 말고, 당신이 감사하거나 기쁨을 느낀 순간들도 포함해보세요. 이는 긍정적인 마음 상태를 유지하고 희망을 갖는데 도움이 됩니다.<br/><br/>🌙 일기를 쓰는 시간을 정해보세요: 일기를 쓰는 것이 습관이 되도록, 일기를 쓰는 시간을 정해보세요. 이는 일상의 일부로 일기쓰기를 자연스럽게 만들어 줄 것입니다.<br/><br/>마음챙김 다이어리와 함께 이런 방법으로 일기를 쓰다보면, 당신의 생각과 감정, 그리고 자신에 대한 이해가 점차 깊어질 것입니다. 🌱 정신 건강을 위한 여행, 함께 시작해보시겠어요?
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
                                                      onClick={navigateToGuide3}
                                                >️<u>개인정보는 어떻게 관리되나요?</u><br/>
                            </span>
                    </span>

                                <span className="smartphone-view-text">
                                    <br/><br/>정신 건강에 도움이 되는 일기 작성은 솔직하고, 직관적이며, 그리고 본인을 진정으로 반영하는 것이 중요합니다. 아래는 그 방법에 대한 간략한 가이드입니다:<br/><br/>📝 솔직하게 쓰기: 일기는 당신만의 공간이므로, 본인의 감정과 생각을 솔직하게 표현해보세요. 이는 본인의 내면을 이해하는 첫걸음이 될 수 있습니다.<br/><br/>🎯 구체적으로 쓰기: 일어난 일이나 느낀 감정을 구체적으로 설명해보세요. 이는 상황을 더 잘 이해하고, 감정에 대한 통찰력을 키울 수 있게 합니다.<br/><br/>💭 자기 성찰하기: 당신이 어떤 행동을 했는지, 그리고 그 행동이 당신의 생각과 감정에 어떤 영향을 미쳤는지를 고민해보세요. 이는 자기 이해와 자아 성장에 큰 도움이 됩니다.<br/><br/>🌈 긍정적인 면도 포함하기: 항상 어려운 부분만을 집중하지 말고, 당신이 감사하거나 기쁨을 느낀 순간들도 포함해보세요. 이는 긍정적인 마음 상태를 유지하고 희망을 갖는데 도움이 됩니다.<br/><br/>🌙 일기를 쓰는 시간을 정해보세요: 일기를 쓰는 것이 습관이 되도록, 일기를 쓰는 시간을 정해보세요. 이는 일상의 일부로 일기쓰기를 자연스럽게 만들어 줄 것입니다.<br/><br/>마음챙김 다이어리와 함께 이런 방법으로 일기를 쓰다보면, 당신의 생각과 감정, 그리고 자신에 대한 이해가 점차 깊어질 것입니다. 🌱 정신 건강을 위한 여행, 함께 시작해보시겠어요?
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
                                                      onClick={navigateToGuide3}
                                                >️<u>개인정보는 어떻게 관리되나요?</u><br/>
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


export default DiaryGuide4