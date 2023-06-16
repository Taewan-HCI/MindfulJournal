import {React, useEffect, useRef, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from "react-bootstrap/Card";
import {useNavigate} from "react-router-dom";
import book_blue from "../img/book_blue.jpg";
import book_purple from "../img/book_purple.jpg";
import chat from "../img/chat.jpg";
import lock from "../img/lock.jpg";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase-config";
import Button from "react-bootstrap/Button";



function Home(props) {

    const navigate = useNavigate()

    function navigateToWriting() {
        navigate("/writing")
    }

    function navigateToReview() {
        navigate("/list")
    }

    const [diaryList, setDiaryList] = useState([])
    const updateProgress = useRef(true)
    const [emptyList, setEmptyList] = useState(false)
    const [lastDate, setLastDate] = useState("")

    useEffect(() => {
        async function renewList() {
            const diary = await receiveDiaryData()
            // console.log(diary)
            await setDiaryList(diary)
            updateProgress.current = false
        }

        if (updateProgress.current) {
            renewList()
        } else {
            if (diaryList.length === 0) {
                setEmptyList(true)
            }
            console.log(diaryList)
            console.log(lastDate)
        }
    })

    async function receiveDiaryData() {
        let tempArr = []
        const querySnapshot = await getDocs(collection(db, "session", props.userName, "diary_complete"));
        querySnapshot.forEach((doc) => {
            tempArr.push(doc.data())
        });
        if (tempArr.length === -1) {
            return tempArr
        } else {
            setLastDate(tempArr[tempArr.length - 1]["createdAt"])
            return tempArr
        }

    }

    return (
        <div>

            {lastDate === "" ? <NoDiary userName={props.userName}/> :
                <Loading_complete userName={props.userName} diaryList={diaryList} lastDate={lastDate}
                                  navigateToWriting={navigateToWriting}
                                  navigateToReview={navigateToReview}/>}

        </div>
    )
}

function NoDiary(props) {
    return (
        <Container>
            <Row>
                <div className="loading_box_home_top">
                    <div>
                        <b>안녕하세요 {props.userName}님</b> 😀<br/>마음챙김 다이어리에 오신걸 환영합니다.


                    </div>
                    &nbsp;
                        <div>

                        </div>

                </div>
            </Row>
            <Row>

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

            </Row>
            <div className="footer"></div>
        </Container>
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

            </Row>
            <div className="footer"></div>
        </Container>
    )
}

export default Home;