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



function DiaryGuide(props) {

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
                                <div>일기쓰기와 정신건강:<br/>일기를 작성하는 것이 어떻게 정신건강에 도움이 될까요?</div>
                            </div>
                            <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={navigateToHome}>
                            🏠 홈으로 돌아가기
                        </Button>
                            <div className="loading_box_home_bottom">
                                <img src={book_purple} alt="Book" style={{width: '100%', height: 'auto'}} />
                                <span className="desktop-view" style={{ fontSize: '1.1rem' }}>
                                   <br/><br/>우리 모두의 삶은 때로는 평온하고 기쁨 가득할 때도 있지만, 때때로는 힘들고 고민스러운 순간들이 찾아옵니다. 불확실함, 스트레스, 그리고 상실감과 같은 어려운 감정들이 우리의 마음을 흔들 때가 있습니다. 이런 순간들, 우리는 우리의 감정을 어떻게 다루어야 할지, 어떻게 이런 어려움을 극복해야 할지 고민하게 됩니다. 이러한 상황에서, 일기를 쓰는 것이 우리의 정신 건강에 큰 도움을 줄 수 있습니다.<br/><br/>일기를 쓴다는 것은 우리가 겪는 일들과 그에 따른 우리의 감정을 단순히 기록하는 것을 넘어서, 우리 스스로와의 소통의 한 형태입니다. 이는 우리가 스스로를 이해하고, 자신의 감정을 인정하고, 그리고 자신의 삶을 더욱 풍요롭게 만드는 데에 중요한 도구가 될 수 있습니다. 일기를 쓰는 것은 단지 당신이 무엇을 느꼈는지를 기록하는 것만이 아니라, 그 감정이 왜 생겼는지, 그리고 그것이 당신에게 어떤 영향을 미쳤는지를 탐색하는 기회를 제공합니다.<br/><br/>이는 🧘‍자기 성찰의 중요한 과정이며, 이를 통해 우리는 우리의 감정을 더욱 건강하게 다루는 방법을 배울 수 있습니다. 그래서 우리는 📝 일기를 쓰는 것을 여러분께 추천합니다. 일기는 우리의 삶의 이야기를 풀어내는 도구이며, 우리가 스스로를 더욱 사랑하고, 💕 스스로를 이해하고, 그리고 우리의 삶을 더욱 풍요롭게 만드는 데에 중요한 역할을 합니다. 그러므로, 이 힘든 시기에, 일기를 쓰는 것이 어떤 도움을 줄 수 있는지 알아보는 것은 중요합니다.<br/><br/>매일매일 마음챙김 다이어리 앱을 사용해보면 어떨까요? 📱 이 앱은 여러분이 하루를 돌아보고, 감정을 표현하고, 스트레스를 해소하고, 자신을 이해하고 치유하는 데 도움을 주고자 설계되었습니다. 마음챙김 다이어리와 함께 🍀 정신건강을 지켜보아요.
                                    <br/><br/>
                                    다른 주제 보기<br/>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide2}
                                                >️<u>누구와 말하는 건가요?</u><br/>
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
                                    <br/><br/>우리 모두의 삶은 때로는 평온하고 기쁨 가득할 때도 있지만, 때때로는 힘들고 고민스러운 순간들이 찾아옵니다. 불확실함, 스트레스, 그리고 상실감과 같은 어려운 감정들이 우리의 마음을 흔들 때가 있습니다. 이런 순간들, 우리는 우리의 감정을 어떻게 다루어야 할지, 어떻게 이런 어려움을 극복해야 할지 고민하게 됩니다. 이러한 상황에서, 일기를 쓰는 것이 우리의 정신 건강에 큰 도움을 줄 수 있습니다.<br/><br/>일기를 쓴다는 것은 우리가 겪는 일들과 그에 따른 우리의 감정을 단순히 기록하는 것을 넘어서, 우리 스스로와의 소통의 한 형태입니다. 이는 우리가 스스로를 이해하고, 자신의 감정을 인정하고, 그리고 자신의 삶을 더욱 풍요롭게 만드는 데에 중요한 도구가 될 수 있습니다. 일기를 쓰는 것은 단지 당신이 무엇을 느꼈는지를 기록하는 것만이 아니라, 그 감정이 왜 생겼는지, 그리고 그것이 당신에게 어떤 영향을 미쳤는지를 탐색하는 기회를 제공합니다.<br/><br/>이는 🧘‍자기 성찰의 중요한 과정이며, 이를 통해 우리는 우리의 감정을 더욱 건강하게 다루는 방법을 배울 수 있습니다. 그래서 우리는 📝 일기를 쓰는 것을 여러분께 추천합니다. 일기는 우리의 삶의 이야기를 풀어내는 도구이며, 우리가 스스로를 더욱 사랑하고, 💕 스스로를 이해하고, 그리고 우리의 삶을 더욱 풍요롭게 만드는 데에 중요한 역할을 합니다. 그러므로, 이 힘든 시기에, 일기를 쓰는 것이 어떤 도움을 줄 수 있는지 알아보는 것은 중요합니다.<br/><br/>매일매일 마음챙김 다이어리 앱을 사용해보면 어떨까요? 📱 이 앱은 여러분이 하루를 돌아보고, 감정을 표현하고, 스트레스를 해소하고, 자신을 이해하고 치유하는 데 도움을 주고자 설계되었습니다. 마음챙김 다이어리와 함께 🍀 정신건강을 지켜보아요.
                                    <br/><br/>
                                    다른 주제 보기<br/>
                                    <span className="likebutton"
                                                      onClick={navigateToGuide2}
                                                >️<u>누구와 말하는 건가요?</u><br/>
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
                            <br/>

                            <Button
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


export default DiaryGuide