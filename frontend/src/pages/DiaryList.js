import {useEffect, useState} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import {collection, doc, setDoc, getDoc, getCountFromServer} from "firebase/firestore";
import {ScaleLoader} from "react-spinners";
import {auth, db} from "../firebase-config";


function DiaryList(props) {

    const [diaryComplete,setDiaryComplete] = useState([])
    const [gettingData, setGettingData] = useState(true)

    useEffect(() => {
        if (gettingData) {

        }
    })

    async function getDocument() {

        let temp = []

        const coll = collection(db, "session", props.userName, "diary_complete")
        const existingSession = await getCountFromServer(coll)
        const diaryNum = await (existingSession.data().count)
        console.log(diaryNum)
        var step;
        for (step = 0; step < diaryNum+1; step++) {
            const docRef = doc(db, "session", props.userName, "diary_complete", String(step));
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                let data = docSnap.data()
                temp.push({"date": data["createdAt"], "content": data["content"]})
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        return temp
    }


    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="diarylist_box">
                            <div>일기 돌아보기</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="writing_box">


                        <Row xs={'auto'} md={1} className="g-4">
                            {/*{Array.from({length: 4}).map((_, idx) => (*/}
                            <Col>
                                <Card style={{
                                    width: '100%',
                                }}>
                                    <Card.Body>
                                        <Card.Title>2월 20일의 일기</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <div className="nav_title_blue">자전거타기, 기쁨, 상쾌함</div>
                                        </Card.Subtitle>
                                        <Card.Text>
                                            오늘은 직장동료와 상사와의 관계에 대해 생각해보았다. 최근들어 대화중에 자꾸 소외되는 듯한 느낌을 받는다. 예전보다 더욱 위축되고
                                            자신감이 떨어지는 것 같다. 이 문제로 인해 자존감마저 낮아지는 것 같아서 걱정이다. 그래도 다행인건 아직까지는 큰 스트레스 없이
                                            지내고 있다는 것이다. 무엇보다도 스스로 이겨낼 수 있도록 용기를 주는 것이 가장 중요하다는 생각이 든다. 그리고 꾸준한 운동
                                            또한 도움이 될 것 같다. 일단 당장 할 수 있는 것들을 찾아보자.
                                        </Card.Text>
                                        <span>❤️<b>18</b>  💪️<b>18</b></span>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col>
                                <Card style={{
                                    width: '100%',
                                }}>
                                    <Card.Body>
                                        <Card.Title>2월 18일의 일기</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <div className="nav_title_blue">짜증, 우울함</div>
                                        </Card.Subtitle>
                                        <Card.Text>
                                            오늘은 이기적인 사람들에 대해 생각해보았다. 나는 다른 사람을 배려하지만, 그들은 나를 그렇게 배려해주지는 않는 것 같다. 하지만, 나의
                                            배려속에 상대방이 보답해주기를 바라는 마음이 있는 것은 아닐까? 이것은 '미숙한 착함'이 될 수 있다. 어떻게 하면 더 성숙할 수 있을지
                                            고민해봐야겠다.
                                        </Card.Text>
                                        <span>❤️<b>2</b>  💪️<b>0</b></span>
                                    </Card.Body>
                                </Card>
                            </Col>
                            {/*// ))}*/}
                        </Row>


                    </div>
                </Row>
            </Container>
        </div>
    )
}


export default DiaryList