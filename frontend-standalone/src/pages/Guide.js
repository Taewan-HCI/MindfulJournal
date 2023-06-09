import {useEffect, useState, useRef} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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


function Guide(props) {

    const [diaryList, setDiaryList] = useState([])
    const updateProgress = useRef(true)
    const [emptyList, setEmptyList] = useState(false)
    const [refresh, setRefresh] = useState(1)


    useEffect(() => {
        async function renewList() {
            const diary = await receiveDiaryData()
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

    function Unix_timestamp(t) {
        var date = new Date(t * 1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth() + 1);
        var day = "0" + date.getDate();
        var hour = "0" + date.getHours();
        var minute = "0" + date.getMinutes();
        var second = "0" + date.getSeconds();
        return year + "년 " + month.substr(-2) + "월 " + day.substr(-2) + "일 ";
    }

    function Unix_timestamp2(t) {
        var date = new Date(t * 1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth() + 1);
        var day = "0" + date.getDate();
        var hour = "0" + date.getHours();
        var minute = "0" + date.getMinutes();
        var second = "0" + date.getSeconds();
        return hour.substr(-2) + "시" + minute.substr(-2) + "분 작성됨";
    }


    async function addLike(idx) {
        const findSession = diaryList[idx]["sessionNumber"]
        const userDocRef = doc(db, 'session', props.userMail, 'diary', findSession);
        await updateDoc(userDocRef, {
            like: increment(1)
        })
        updateProgress.current = true
        setRefresh(refresh + 1)
    }


    async function addMuscle(idx) {
        const findSession = diaryList[idx]["sessionNumber"]
        const userDocRef = doc(db, 'session', props.userMail, 'diary', findSession);
        await updateDoc(userDocRef, {
            muscle: increment(1)
        })
        updateProgress.current = true
        setRefresh(refresh + 1)
    }

    /*async function receiveDiaryData() {
        let tempArr = []
        const q = query(collection(db, "session", props.userName, "diary_complete"), where("isFinished", "==", "true"), orderBy("sessionEnd", "desc"))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            tempArr.push(doc.data())
        });

        return tempArr
    }*/

    async function receiveDiaryData() {
        let tempArr = [];
        const userDocRef = doc(db, 'session', props.userMail);
        const diaryCompleteCollRef = collection(userDocRef, 'diary');
        const q = query(diaryCompleteCollRef, where('isFinished', '==', true), orderBy('sessionEnd', 'desc'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            tempArr.push(doc.data());
        });

        return tempArr;
    }


    if (emptyList === true) {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <div className="diarylist_box">
                                <div>일기쓰기가</div>
                            </div>
                            <div className="loading_box_home_bottom">
                                <span className="desktop-view">

                        🥲 아직 작성한 일기가 없어요. 첫 일기를 작성해볼까요?

                    </span>

                                <span className="smartphone-view-text">

                        🥲 아직 작성한 일기가 없어요. 첫 일기를 작성해볼까요?

                    </span>
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
                                                <Card.Title>{Unix_timestamp(diaryList[idx]["sessionEnd"])}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    <div
                                                        className="nav_title_blue">{Unix_timestamp2(diaryList[idx]["sessionEnd"])}</div>
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    {diaryList[idx]["diary"]}
                                                </Card.Text>
                                                <span className="likebutton"
                                                      onClick={() => {
                                                          addLike(idx)
                                                      }}
                                                >️❤️</span> <b>{diaryList[idx]["like"]}</b>

                                                <span className="likebutton"
                                                      onClick={() => {
                                                          addMuscle(idx)
                                                      }}
                                                >&nbsp;&nbsp;&nbsp;💪️ </span><b>{diaryList[idx]["muscle"]}</b>
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


export default Guide