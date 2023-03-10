import {useEffect, useState, useRef, React} from "react";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    onSnapshot,
    getCountFromServer,
} from 'firebase/firestore'
import {db} from "../firebase-config";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {ScaleLoader, BeatLoader} from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';


function Writing(props) {

    let [loading, setLoading] = useState(false)

    const sessionStatus = useRef(false)
    const diaryNumber = useRef("");
    const receivedText = useRef("");
    const receivedDiary = useRef("");
    const turnCount = useRef(0);

    let [inputUser, setInputUser] = useState('')
    let [prompt, setPrompt] = useState('')
    let [diary, setDiary] = useState("")
    let [diaryShow, setDiaryShow] = useState(false)
    const [modalShow, setModalShow] = useState(false);


    const navigate = useNavigate()
    const current = new Date();
    const date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;

    function navigateToReview() {
        navigate("/list")

    }

    function handleClick() {
        setModalShow(false);
        setTimeout(() => {
            submitDiary();
        }, 500);

    }


    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        마음챙김 다이어리를 종료하시겠어요?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>아래와 같이 오늘의 다이어리가 저장됩니다 📝</h5>
                    <p>
                        {diary}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>더 작성하기</Button>
                    <Button onClick={handleClick}>저장하고 종료하기</Button>
                </Modal.Footer>
            </Modal>
        );
    }


    async function createNewDoc() {
        const coll = collection(db, "session", props.userName, "diary")
        const existingSession = await getCountFromServer(coll)
        const sessionNum = await (existingSession.data().count + 1)
        diaryNumber.current = String(sessionNum)
        await setDoc(doc(db, "session", props.userName, "diary", String(sessionNum)), {
            outputFromLM: "오늘 있었던 일에 대해 듣고 싶어요. 정해진 규칙이 없으니 자유롭게 얘기해주세요.",
            conversation: [],
            isFinish: false,
            module: "",
            diary: ""
        });
        sessionStatus.current = true
        setLoading(true)
    }

    async function submitDiary() {
        const coll = collection(db, "session", props.userName, "diary_complete")
        const existingSession = await getCountFromServer(coll)
        const diaryNum = await (existingSession.data().count + 1)
        await setDoc(doc(db, "session", props.userName, "diary_complete", String(diaryNum)), {
            diaryNum: diaryNum,
            content: diary,
            createdAt: date,
            like: 0,
        });
        navigateToReview()
    }

    //사용자-sessionID의 doc을 계속 관찰하고 있다가 업데이트가 발생하면 prompt를 업데이트 하는 useEffect 함수
    useEffect(() => {
        if (sessionStatus) {
            if (diaryNumber.current !== "") {
                const unsuscribe = onSnapshot(doc(db, "session", props.userName, "diary", String(diaryNumber.current)), doc => {
                    receivedText.current = doc.data()["outputFromLM"]
                    const response = receivedText.current;
                    getLastSentence(response)
                })
                const unsuscribe2 = onSnapshot(doc(db, "session", props.userName, "diary", String(diaryNumber.current)), doc => {
                    receivedDiary.current = doc.data()["diary"]
                    const response = receivedDiary.current;
                    setDiary(response)
                })
                return () => {
                    unsuscribe();
                    unsuscribe2();
                }
            }
        }
    })

    async function getLastSentence(response) {
        let a = setTimeout(() => {
            setPrompt(response)
            console.log(prompt)
            if ((prompt).trim() === "") {
                setLoading(true)
            } else {
                setLoading(false)
            }
        }, 10)
        return () => {
            clearTimeout(a)
        }
    }

    async function assemblePrompt() {
        const docRef3 = doc(db, "session", props.userName, "diary", String(diaryNumber.current));
        const docSnap = await getDoc(docRef3);
        if (docSnap.exists()) {
            const readyRequest = docSnap.data().conversation;
            console.log(readyRequest)
            turnCount.current = turnCount.current + 1
            requestPrompt(readyRequest, props.userName, diaryNumber.current, turnCount.current)
        } else {
            console.log("No such document!");
        }
    }

    // https://mindfuljournal-fzesr.run.goorm.site
    // http://0.0.0.0:8000

    function requestPrompt(text, user, num, turn) {
        return fetch('https://mindfuljournal-fzesr.run.goorm.site', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,
                'user': user,
                'num': num,
                'turn': turn
            })
        })
            .catch(err => console.log(err));
    }

    function requestSummerization() {
        setDiaryShow(true)
        return fetch('https://mindfuljournal-fzesr.run.goorm.site/diary', {
            method: 'POST',
            body: JSON.stringify({
                'user': props.userName,
                'num': diaryNumber.current
            })
        })
            .catch(err => console.log(err));
    }

    /*function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }*/

    async function addConversationFromUser(input) {
        let system_temp = {"role": "assistant", "content": prompt}
        let user_temp = {"role": "user", "content": input};

        const docRef2 = doc(db, "session", props.userName, "diary", String(diaryNumber.current));
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().conversation;
            message[message.length] = system_temp;
            message[message.length] = user_temp;
            let a = setTimeout(async () => {
                await setDoc(docRef2, {
                    conversation: message,
                    outputFromLM: ""
                }, {merge: true});
                assemblePrompt();
                setLoading(true);
            }, 500)
            return () => {
                clearTimeout(a)
            }
        } else {
            console.log("데이터 없음");
        }
    }


    if (sessionStatus.current === false) {
        return (
            <Container>
                <Row>
                    <div className="loading_box">
                        <div>
                            {date}<br/><b>마음챙김 다이어리를 시작합니다</b> 😀
                        </div>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={createNewDoc}
                            >📝 다이어리 작성하기
                            </Button>
                        </div>
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </Container>

        )
    } else {
        return (
            <Container>
                <Row>
                    <div>
                        {loading === true ? <Loading/> :
                            <Userinput prompt={prompt} setInputUser={setInputUser} inputUser={inputUser}
                                       addConversationFromUser={addConversationFromUser}
                                       requestSummerization={requestSummerization} setLoading={setLoading}
                                       turnCount={turnCount.current}/>}
                    </div>
                </Row>
                <Row>
                    {diaryShow === true ? <DiaryView diary={diary} submitDiary={submitDiary}
                                                     setModalShow={setModalShow}/> :
                        <div></div>}
                </Row>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            </Container>

        )
    }


}

function Loading() {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="loading_box">
                            <div>
                                <ScaleLoader
                                    color="#007AFF"
                                    speedMultiplier={0.9}
                                />
                            </div>
                            <div>지금까지의 이야기를 정리중입니다</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="writing_box">
                        <Form.Label htmlFor="userInput">✏️ 나의 일기 입력하기</Form.Label>
                        <Form.Control
                            type="input"
                            as="textarea"
                            rows={3}
                            id="userInput"
                            disabled
                            readOnly
                        />
                        <Form.Text id="userInput" muted>
                            📝 정해진 양식은 없어요. 편안하고 자유롭게 최근에 있었던 일을 작성해주세요.
                        </Form.Text>
                    </div>
                    <Container>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        disabled={true}
                                        style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                    >응답 기록하기</Button>
                                </div>
                            </Col>
                            <Col>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="secondary"
                                        disabled={true}
                                        style={{backgroundColor: "264362", fontWeight: "600"}}
                                    >일기로 정리하기</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </div>
    )
}

//User input screen component
function Userinput(props) {
    //for textfield monitoring
    const temp_input = useRef("");


    const handleOnKeyPress = e => {
        if (e.key === "Enter") {
            props.addConversationFromUser(temp_input.current)
        }
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="prompt_box">
                            <div className="tte">
                                {props.prompt}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="writing_box">
                        <Form.Label htmlFor="userInput">✏️ 나의 일기 입력하기</Form.Label>
                        <Form.Control
                            type="input"
                            as="textarea"
                            rows={3}
                            id="userInput"
                            onChange={(e) => {
                                temp_input.current = e.target.value
                            }}
                            onKeyPress={handleOnKeyPress}
                        />
                        <Form.Text id="userInput" muted>
                            📝 정해진 양식은 없어요. 편안하고 자유롭게 최근에 있었던 일을 작성해주세요.
                        </Form.Text>
                    </div>
                    <Container>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        style={{backgroundColor: "007AFF"}}
                                        onClick={() => {
                                            (function () {
                                                if ((temp_input.current).length < 11) {
                                                    alert('입력한 내용이 너무 짧아요. 조금 더 길게 적어볼까요?')
                                                } else {
                                                    props.addConversationFromUser(temp_input.current)
                                                }
                                            })()
                                        }}>응답 기록하기</Button>
                                </div>
                            </Col>
                            <Col>
                                <div className="d-grid gap-2">

                                    {props.turnCount < 3 ?
                                        <Button
                                            variant="dark"
                                            onClick={() => {
                                                alert("3턴 이후 일기로 정리하기 기능이 활성화 됩니다. 조금만 더 진행해 볼까요?")
                                            }}
                                        >일기로 정리하기 ({3 - props.turnCount}턴 이후 가능해요)</Button>
                                        :
                                        <Button
                                            variant="dark"
                                            onClick={() => {
                                                props.requestSummerization()
                                            }}
                                        >일기로 정리하기</Button>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </div>
    )
}

function DiaryView(props) {


    return (
        <div className="inwriting_review_box">
            <Container>
                <Row xs={'auto'} md={1} className="g-4">
                    <Col>
                        <Card style={{
                            width: '100%',
                        }}>
                            <Card.Body>
                                <Card.Title> <BeatLoader color="#007AFF" size={10}/> 일기 작성중</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    <div>핵심키워드 도출 중</div>
                                </Card.Subtitle>
                                <Card.Text>
                                    <div>{props.diary}</div>
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Col>
                            <div className="submission"></div>
                            <div className="d-grid gap-2">
                                {/*<Button
                                    variant="primary"
                                    style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                    onClick={() => {
                                        props.submitDiary()
                                    }}
                                >📝 일기 저장하고 종료하기</Button>*/}

                                <Button
                                    variant="primary"
                                    style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                    onClick={() => {
                                        props.setModalShow(true)
                                    }}
                                >📝 일기 저장하고 종료하기</Button>
                            </div>
                        </Col>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Writing