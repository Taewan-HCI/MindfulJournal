import {useEffect, useState, useRef, React} from "react";
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    updateDoc,
    increment
} from 'firebase/firestore'
import {db} from "../firebase-config";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import Badge from 'react-bootstrap/Badge';
import Toast from 'react-bootstrap/Toast';
import {BeatLoader, HashLoader} from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import {ToastContainer} from "react-bootstrap";


function Writing(props) {
    const [show, setShow] = useState(false);
    let [loading, setLoading] = useState(false)
    const [sessionStatus, setSessionStatus] = useState(false)
    const receivedText = useRef("");
    const receivedDiary = useRef("");
    const turnCount = useRef(null);
    const sessionInputRef = useRef(null)
    const [session, setSession] = useState("")
    let [inputUser, setInputUser] = useState('')
    let [prompt, setPrompt] = useState('')
    let [module, setModule] = useState('')
    let [diary, setDiary] = useState("")

    const diaryRequest = useRef(false)

    const [modalShow, setModalShow] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [textInput, setTextInput] = useState('');
    const notSpoken = useRef(true)
    const navigate = useNavigate()
    const current = new Date();
    const date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;


    const synth = window.speechSynthesis;
    const dummy = new Audio();


    // voice input feature
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Web Speech API is not supported in this browser. Please use Google Chrome.');
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.interimResults = true;
        recognition.lang = 'ko';
        recognition.continuous = true;

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');
            setTextInput(textInput + " " + transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        if (isListening) {
            recognition.start({continuous: true});
        } else {
            recognition.stop({continuous: true});
        }

        return () => {
            recognition.abort();
        };
    }, [isListening]);

    // monitoring firebase data
    useEffect(() => {
        if (sessionStatus && session !== '') {
            const diaryDocRef = doc(db, 'session', props.userMail, 'diary', session);
            const unsubscribe = onSnapshot(diaryDocRef, (doc) => {
                const data = doc.data();
                // Tracking "outputFromLM" field
                if (data) {
                    console.log("새로고침")
                    receivedText.current = data['outputFromLM'];
                    getLastSentence(receivedText.current);
                    receivedDiary.current = data['diary'];
                    if (receivedDiary.current !== "") {
                        if (receivedDiary.current !== diary) {
                            setShow(true)
                            console.log("새로고침_다이어리")
                            setDiary(receivedDiary.current)
                        }
                    }
                    turnCount.current = data['turn'];
                    console.log(notSpoken.current)
                    speak()
                }
            });
            return () => {
                unsubscribe();
            };
        }
    });



    function speak() {
        if (synth.speaking) {
            synth.cancel();
        }

        else if (notSpoken.current === true && prompt !== '' && loading === false) {
            const utterThis = new SpeechSynthesisUtterance(prompt);
            utterThis.addEventListener("error", () => {
                console.error("SpeechSynthesisUtterance error");
            });
            utterThis.rate = 0.8;
            synth.speak(utterThis);
            notSpoken.current = false
        }
    }


    // create NewDoc
    async function createNewDoc() {
        const docRef = doc(db, "session", props.userMail, "diary", session);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const message = docSnap.data().outputFromLM;
            console.log("진행중인 세션이 있습니다");
            if (message.length === 0) {
                assemblePrompt()
            } else {
                console.log("기존에 언어모델 문장 존재");
                setSessionStatus(true)
                setLoading(true)
            }
        } else {
            const myArray = ["만나서 반가워요, 오늘 하루 어떻게 지내셨나요?", "오늘 하루 어땠어요? 말하고 싶은 것이 있다면 자유롭게 이야기해주세요.", "안녕하세요! 오늘 하루는 어땠나요?", "오늘 하루도 정말 고생 많으셨어요. 어떤 일이 있었는지 얘기해주세요.", "오늘도 무사히 지나간 것에 감사한 마음이 드네요. 오늘 하루는 어땠나요?", "오늘은 어떤 새로운 것을 경험했나요? 무엇을 경험했는지 얘기해주세요.", "오늘은 어떤 고민이 있었나요? 저와 함께 고민을 얘기해봐요."]
            await setDoc(doc(db, "session", props.userMail, "diary", session), {
                outputFromLM: {
                    "options": [myArray[Math.floor(Math.random() * myArray.length)]],
                    "module": "Initiation",
                    "summary": "none",
                    "diary": "none"
                },
                conversation: [],
                isFinished: false,
                module: "",
                fiveOptionFromLLM: [],
                diary: "",
                topic: "",
                sessionStart: Math.floor(Date.now() / 1000),
                summary: "",
                history: [],
                turn: 0,
                sessionNumber: session
            });
        }
        setSessionStatus(true)
        setLoading(true)
    }

    async function submitDiary() {
        await setDoc(doc(db, "session", props.userMail, "diary", session), {
            sessionEnd: Math.floor(Date.now() / 1000),
            isFinished: true,
            like: 0,
            muscle: 0,
            diary: diary
        }, {merge: true});
        navigateToReview()
    }

    async function submitDiary2() {
        await setDoc(doc(db, "session", props.userMail, "diary", session), {
            sessionEnd: Math.floor(Date.now() / 1000),
            isFinished: true,
            like: 0,
            muscle: 0,
            diary: "오늘 작성한 다이어리는 숨기고 싶어요",
            diary_hidden: diary
        }, {merge: true});
        navigateToReview()
    }

    async function editDiary(diary_edit) {
        await setDoc(doc(db, "session", props.userMail, "diary", session), {
            diary: diary_edit
        }, {merge: true});
    }

    const toggleListening = () => {
        setIsListening((prevState) => !prevState);
    };


    // Moaal management
    function navigateToReview() {
        navigate("/list")
    }

    function handleClick() {
        setModalShow(false);
        setTimeout(() => {
            submitDiary();
        }, 500);
    }

    function handleClick2() {
        setModalShow(false);
        setTimeout(() => {
            submitDiary2();
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
                    <Button onClick={handleClick2}>🌧️ 일기 숨기고 종료하기</Button>
                    <Button onClick={handleClick}>🌤️ 일기 저장하고 종료하기</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function readText(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    }

    // checking Prompt exist
    async function getLastSentence(response) {
        let a = setTimeout(() => {
            setModule(response["module"])
            setPrompt(response["options"][0])
            if (prompt) {
                if ((prompt).trim() === "") {
                    setLoading(true)
                } else {
                    setLoading(false)
                }
            }

        }, 10)
        return () => {
            clearTimeout(a)
        }
    }

    async function assemblePrompt() {
        const docRef3 = doc(db, "session", props.userMail, "diary", session);
        const docSnap = await getDoc(docRef3);
        if (docSnap.exists()) {
            const readyRequest = docSnap.data().conversation;
            console.log(docSnap.data())
            const turn_temp = docSnap.data().turn
            requestPrompt(readyRequest, props.userMail, session, turn_temp, module)
            if (turn_temp > 2) {
                console.log("다이어리 요청 들어감");
                diaryInit(readyRequest, props.userMail, session);
                diaryRequest.current = true;
            }
            turnCount.current = turn_temp;
        } else {
            console.log("No such document!");
        }
    }

    // https://mindfuljournal-fzesr.run.goorm.site
    // http://0.0.0.0:8000


    function requestPrompt(text, user, num, turn, module, model) {
        return fetch('https://mindfuljournal-fzesr.run.goorm.site/standalone', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,
                'user': user,
                'num': num,
                'turn': turn,
                'module': module,
                'model': "none"
            })
        })
            .catch(err => console.log(err));
    }


    function diaryInit(text, user, num) {
        return fetch('https://algodiary--xpgmf.run.goorm.site/diary', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,
                'user': user,
                'num': num
            })
        })
            .catch(err => console.log(err));
    }


    async function addConversationFromUser(input, comment) {
        let system_temp = {"role": "assistant", "content": prompt}
        let user_temp = {"role": "user", "content": input};
        let history_temp = {
            "prompt": prompt,
            "userInput": input,
            "module": module,
            "comment": comment,
            "turn": turnCount.current
        }
        const docRef2 = doc(db, "session", props.userMail, "diary", session);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().conversation;
            const history = docSnap2.data().history;
            message[message.length] = system_temp;
            message[message.length] = user_temp;
            history[history.length] = history_temp
            let a = setTimeout(async () => {
                await setDoc(docRef2, {
                    conversation: message,
                    outputFromLM: "",
                    history: history,
                }, {merge: true});
                await updateDoc(docRef2, {
                    turn: increment(1)
                })
                assemblePrompt();
                setLoading(true);
                notSpoken.current = true
                setTextInput("");
            }, 500)
            return () => {
                clearTimeout(a)
            }
        } else {
            console.log("데이터 없음");
        }
    }


    if (sessionStatus === false) {
        return (
            <Container>
                <Row>
                    <div className="loading_box">
                        <span className="desktop-view">
                            {date}<br/><b>마음챙김 다이어리를 시작합니다</b> 😀
                        </span>
                        <span className="smartphone-view">
                            {date}<br/><b>마음챙김 다이어리를<br/>시작합니다</b> 😀
                        </span>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Form.Text className="text-muted">
                                종료되지 않은 세션을 이어 진행하려면<br/>진행중인 세션 번호를 입력해주세요
                            </Form.Text>
                            <Form.Group className="mb-3" controlId="formSessionNumber">
                                <Form.Control type="text" placeholder="세션 번호를 입력해주세요" ref={sessionInputRef}
                                              onChange={() => {
                                                  setSession(sessionInputRef.current.value)
                                              }}/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    setSession(sessionInputRef.current.value)
                                    createNewDoc()
                                }}
                            >📝 오늘의 일기 작성하기
                            </Button>
                        </div>
                    </Col>
                    <Col className="desktop-view">
                    </Col>
                </Row>
            </Container>
        )
    } else {
        return (
            <Container>
                <Row>
                    <div>
                        <Badge bg="primary">
                            사용자: {props.userName}
                        </Badge>{' '}
                        <Badge bg="primary">
                            세션: {session}
                        </Badge>

                        {loading === true ? <Loading/> :
                            <Userinput prompt={prompt} setInputUser={setInputUser} inputUser={inputUser}
                                       addConversationFromUser={addConversationFromUser}
                                       setLoading={setLoading}
                                       turnCount={turnCount.current} setDiary={setDiary} textInput={textInput}
                                       setTextInput={setTextInput} toggleListening={toggleListening}
                                       isListening={isListening} setShow={setShow} show={show}/>}
                    </div>
                </Row>
                <Row>
                    {turnCount.current > 2 && loading === false ?
                        <DiaryView diary={diary} submitDiary={submitDiary} editDiary={editDiary}
                                   setModalShow={setModalShow}/> :
                        <div></div>}
                </Row>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
                <div className="footer"></div>
            </Container>
        )
    }
}

//User input screen component
function Userinput(props) {
    const temp_comment_input = useRef("");
    return (
        <div>
            <Row>
                <ToastContainer className="p-3" position={"top-center"}>
                    <Toast onClose={() => props.setShow(false)} show={props.show} delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">알림</strong>
                            <small>이창은 3초 후 자동으로 닫힘니다</small>
                        </Toast.Header>
                        <Toast.Body>새로운 다이어리가 작성되었어요.</Toast.Body>
                    </Toast>
                </ToastContainer>
                <Col>
                    <div className="prompt_box">
                            <span className="desktop-view">
                                <div className="tte">
                                {props.prompt}
                            </div>
                            </span>
                        <span className="smartphone-view-text-large">
                                <div className="tte">
                                {props.prompt}
                            </div>
                            </span>
                    </div>
                </Col>
            </Row>
            <Row>
                <div className="writing_box">
                    <Form.Label htmlFor="userInput">
                        <span className="desktop-view">
                            ✏️ 나의 일기 입력하기
                        </span>
                        <span className="smartphone-view-text-tiny">
                            ✏️ 나의 일기 입력하기
                        </span>
                    </Form.Label>
                    <Form.Control
                        type="text"
                        as="textarea"
                        rows={3}
                        id="userInput"
                        value={props.textInput}
                        onChange={(e) => props.setTextInput(e.target.value)}
                    />
                    <Form.Text id="userInput" muted>
                        📝 편안하고 자유롭게 최근에 있었던 일을 작성해주세요.
                    </Form.Text>
                </div>
                <Row className="desktop-view">
                    <Col>
                        <div className="d-grid gap-1">
                            <Button
                                variant="dark"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={props.toggleListening}>
                                {props.isListening ? '🛑 응답 종료하기' : '🎙️ 목소리로 응답하기'}
                            </Button>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-grid gap-1">
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    (function () {
                                        if (props.isListening === true) {
                                            props.toggleListening()
                                            props.addConversationFromUser(props.textInput, temp_comment_input.current)
                                        } else {
                                            props.addConversationFromUser(props.textInput, temp_comment_input.current)
                                        }
                                    })()
                                }}>💬 응답 전송하기</Button>
                        </div>
                    </Col>
                    <Form.Text id="userInput" muted>
                        📖 3턴이 넘어가면 다이어리가 자동으로 생성됩니다.
                    </Form.Text>
                </Row>
                <div className="smartphone-view">
                    <div className="d-grid gap-2">
                        <Button
                            variant="dark"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={props.toggleListening}>
                            {props.isListening ? '🛑 응답 종료하기' : '🎙️ 목소리로 응답하기'}
                        </Button>
                        <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={() => {
                                (function () {
                                    if (props.isListening === true) {
                                        props.toggleListening()
                                        props.addConversationFromUser(props.textInput, temp_comment_input.current)
                                    } else {
                                        props.addConversationFromUser(props.textInput, temp_comment_input.current)
                                    }
                                })()
                            }}>💬 응답 전송하기</Button>
                    </div>
                    <Form.Text id="userInput" muted>
                        📖 3턴이 넘어가면 다이어리가 자동으로 생성됩니다.
                    </Form.Text>
                </div>
            </Row>
        </div>
    )
}

function DiaryView(props) {
    const [editMode, setEditMode] = useState(false);
    const [diaryedit, setDiaryedit] = useState("");

    if (props.diary === "") {
        return (
            <div className="inwriting_review_box">
                <Row>
                    <div className="loading_box_2">
                        <div>
                            <BeatLoader
                                color="#007AFF"
                                speedMultiplier={0.6}
                            />
                        </div>
                        <span className="desktop-view">
                                <Form.Text id="userInput" muted><div style={{fontSize: '20px'}}>일기 작성중입니다. 다이어리 작성을 더 진행해주세요</div></Form.Text>
                            </span>
                        <span className="smartphone-view">
                                <Form.Text id="userInput" muted><div style={{fontSize: '15px'}}>일기 작성중입니다.<br/>다이어리 작성을 더 진행해주세요</div></Form.Text>
                            </span>
                    </div>
                </Row>
            </div>
        )
    } else if (editMode === false) {
        return (
            <div className="inwriting_review_box">
                &nbsp;
                <Row xs={'auto'} md={1} className="g-4">
                    <Col>
                        <Card style={{
                            width: '100%',
                        }}>
                            <Card.Body>
                                <Card.Title>
                                    오늘의 마음챙김 다이어리
                                </Card.Title>

                                <Card.Text>
                                    <div>{props.diary}</div>
                                </Card.Text>
                                &nbsp;
                                <Card.Subtitle className="mb-2 text">
                                    <span className="likebutton"
                                          onClick={() => {
                                              setEditMode(true)
                                              setDiaryedit(props.diary)
                                          }}
                                    >✍️ 내용 ️수정하기️</span>
                                </Card.Subtitle>
                            </Card.Body>

                        </Card>


                        <Col>
                            <div className="submission"></div>
                            <div className="d-grid gap-2">

                                <Button
                                    variant="dark"
                                    style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                    onClick={() => {
                                        props.setModalShow(true)
                                    }}
                                >📝 일기 저장하고 종료하기</Button>
                            </div>
                            <div className="footer"></div>
                        </Col>
                    </Col>
                </Row>
            </div>
        )
    }
    else if (editMode)
    {
        return (
             <div className="inwriting_review_box">
                       <Form.Label htmlFor="userInput">
                        <span className="desktop-view">
                            📝️ 내용을 수정해주세요
                        </span>
                            <span className="smartphone-view-text-tiny">
                            📝️ 내용을 수정해주세요
                        </span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            rows={5}
                            id="userInput"
                            value={diaryedit}
                            onChange={(e) => setDiaryedit(e.target.value)}
                        />

                            <div className="submission"></div>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="dark"
                                    style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                    onClick={() => {
                                        props.editDiary(diaryedit)
                                        setEditMode(false)
                                    }}
                                >📝 일기 수정완료</Button>
                            </div>
                            <div className="footer"></div>

            </div>
        )
    }
}

function Loading() {
    return (
        <div>
            <Row>
                <Col>
                    <div className="loading_box">
                        <div>
                            <HashLoader
                                color="#007AFF"
                                speedMultiplier={0.9}
                            />
                        </div>
                        &nbsp;
                        <div>지금까지의 이야기를<br/>정리중입니다</div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Writing
