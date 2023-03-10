import {useEffect, useState, useRef} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React from 'react';
import Card from 'react-bootstrap/Card';
import {collection, doc, onSnapshot, query, where, getDocs} from "firebase/firestore";
import {auth, db} from "../firebase-config";


function DiaryList(props) {

    const [diaryList, setDiaryList] = useState([])
    const updateProgress = useRef(true)
    const [emptyList, setEmptyList] = useState(false)


    useEffect(() => {
        async function renewList() {
            const diary = await receiveDiaryData()
            // console.log(diary)
            setDiaryList(diary)
            updateProgress.current = false
        }

        if (updateProgress.current) {
            renewList()
        } else {
            if (diaryList.length === 0) {
                setEmptyList(true)
            }
            console.log(diaryList)
        }
    })


    async function receiveDiaryData() {
        let tempArr = []
        const querySnapshot = await getDocs(collection(db, "session", props.userName, "diary_complete"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            tempArr.push(doc.data())
        });
        return tempArr
    }

    if (emptyList === true) {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <div className="diarylist_box">
                                <div>일기 돌아보기</div>
                            </div>
                            <div className="loading_box_home_bottom">
                                <div>
                                    🥲 아직 작성한 일기가 없어요. 첫 일기를 작성해볼까요?
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    } else {
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
                                {diaryList.map((_, idx) => (
                                    <Col>
                                        <Card style={{
                                            width: '100%',
                                        }}>
                                            <Card.Body>
                                                <Card.Title>{diaryList[idx]["createdAt"]}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    <div className="nav_title_blue">자전거타기, 기쁨, 상쾌함</div>
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    {diaryList[idx]["content"]}
                                                </Card.Text>
                                                <span>❤️ <b>{diaryList[idx]["like"]}</b> </span>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                                <div className="footer"></div>

                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }


}


export default DiaryList