import {useEffect, useState, useRef, React} from "react";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    onSnapshot,
    getCountFromServer, updateDoc, arrayUnion, increment, query, where, orderBy, getDocs
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
import Likert from 'react-likert-scale';


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
    let [existing, setExisting] = useState([{"sessionStart": "데이터 불러오기"}])
    let [surveyReady, setSurveyReady] = useState(false)

    const diaryRequest = useRef(false)
    const updateProgress = useRef(true)

    const [modalShow, setModalShow] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [textInput, setTextInput] = useState('');
    const navigate = useNavigate()
    const current = new Date();
    const date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;

    const phq1 = useRef(null)
    const phq2 = useRef(null)
    const phq3 = useRef(null)
    const phq4 = useRef(null)
    const phq5 = useRef(null)
    const phq6 = useRef(null)
    const phq7 = useRef(null)
    const phq8 = useRef(null)
    const phq9 = useRef(null)


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

        async function renewList() {
            const existingSession = await receiveSessionData()
            setExisting(existingSession)
            updateProgress.current = false
            console.log(existing)
        }

        if (sessionStatus === false && updateProgress.current === true) {
            renewList()
        } else if (sessionStatus && session !== '') {
            const diaryDocRef = doc(db, 'session', props.userMail, 'diary', session);
            const unsubscribe = onSnapshot(diaryDocRef, (doc) => {
                const data = doc.data();
                // Tracking "outputFromLM" field
                if (data) {
                    receivedText.current = data['outputFromLM'];
                    getLastSentence(receivedText.current);
                    // Tracking "diary" field
                    receivedDiary.current = data['diary'];
                    if (receivedDiary.current !== "") {
                        if (turnCount.current > 3 && receivedDiary.current !== diary) {
                            // setShow(true)
                            diaryRequest.current = false
                            setDiary(receivedDiary.current)
                        }
                    }
                    // Tracking "turn" field
                    turnCount.current = data['turn'];
                }
            });
            return () => {
                unsubscribe();
            };
        }
    });

    async function receiveSessionData() {
        let tempArr = [];
        const userDocRef = doc(db, 'session', props.userMail);
        const diaryCompleteCollRef = collection(userDocRef, 'diary');
        const q = query(diaryCompleteCollRef, where('isFinished', '==', false), orderBy('sessionStart', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            tempArr.push(doc.data());
        });
        let resultArr = tempArr.slice(0, 4);
        return resultArr;
    }


    // create NewDoc
    async function createNewDoc(newSession) {
        if (session === "") {
            const docRef = doc(db, "session", props.userMail, "diary", newSession);
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
                let randomIndex = Math.floor(Math.random() * myArray.length);
                let randomString = myArray[randomIndex];
                await setDoc(doc(db, "session", props.userMail, "diary", newSession), {
                    outputFromLM: randomString,
                    conversation: [],
                    isFinished: false,
                    module: "",
                    fiveOptionFromLLM: [],
                    diary: "",
                    topic: "",
                    sessionStart: newSession,
                    summary: "",
                    history: [],
                    turn: 0,
                    history_operator: [],
                    reviewMode: "W",
                    sessionNumber: session
                });
            }
            setSessionStatus(true)
            setLoading(true)
        } else {
            {
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
                    let randomIndex = Math.floor(Math.random() * myArray.length);
                    let randomString = myArray[randomIndex];
                    await setDoc(doc(db, "session", props.userMail, "diary", session), {
                        outputFromLM: randomString,
                        conversation: [],
                        isFinished: false,
                        module: "",
                        fiveOptionFromLLM: [],
                        diary: "",
                        topic: "",
                        sessionStart: session,
                        summary: "",
                        history: [],
                        turn: 0,
                        history_operator: [],
                        reviewMode: "W",
                        sessionNumber: session
                    });
                }
                setSessionStatus(true)
                setLoading(true)
            }
        }

    }

    // submit diary
    async function submitDiary() {
        await setDoc(doc(db, "session", props.userMail, "diary", session), {
            sessionEnd: Math.floor(Date.now() / 1000),
            isFinished: true,
            like: 0,
            muscle: 0,
            diary: diary
        }, {merge: true});
        setSurveyReady(true)
        // navigateToReview()
    }

    function PreviewComponent() {
        return (
            <>
                <p>
                    각 질문 문항에 대해 체크해주세요
                </p>
                <div className="grid">
                    <p>1. 기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.</p>
                    <Likert
                        id="1"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq1.current = val["value"]}
                    />
                    &nbsp;
                    <p>2. 평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못했다.</p>
                    <Likert
                        id="2"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq2.current = val["value"]}

                    />
                    &nbsp;
                    <p>3. 잠들기가 어렵거나 자주 깼다/혹은 너무 많이 잤다.</p>
                    <Likert
                        id="3"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq3.current = val["value"]}

                    />
                    &nbsp;
                    <p>4. 평소보다 식욕이 줄었다/혹은 평소보다 많이 먹었다.</p>
                    <Likert
                        id="4"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq4.current = val["value"]}

                    />
                    &nbsp;
                    <p>5. 다른 사람들이 눈치 챌 정도로 평소보다 말과 행동 이 느려졌다/혹은 너무 안절부절 못해서 가만히 앉아있을 수 없었다.</p>
                    <Likert
                        id="5"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq5.current = val["value"]}

                    />
                    &nbsp;
                    <p>6. 피곤하고 기운이 없었다.</p>
                    <Likert
                        id="6"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq6.current = val["value"]}

                    />
                    &nbsp;
                    <p>7. 내가 잘못 했거나, 실패했다는 생각이 들었다/혹은 자신과 가족을 실망시켰다고 생각했다.</p>
                    <Likert
                        id="7"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq7.current = val["value"]}

                    />
                    &nbsp;
                    <p>8. 신문을 읽거나 TV를 보는 것과 같은 일상적인 일에도 집중할 수가 없었다.</p>
                    <Likert
                        id="8"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq8.current = val["value"]}

                    />
                    &nbsp;
                    <p>9. 차라리 죽는 것이 더 낫겠다고 생각했다/혹은 자해할 생각을 했다.</p>
                    <Likert
                        id="9"
                        responses={[
                            {value: 0, text: "전혀 아니다"},
                            {value: 1, text: "아니다"},
                            {value: 2, text: "보통이다"},
                            {value: 3, text: "그렇다"},
                            {value: 4, text: "매우 그렇다"}
                        ]}
                        onChange={(val) => phq9.current = val["value"]}

                    />
                </div>
            </>
        );
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

    // checking Prompt exist
    async function getLastSentence(response) {
        let a = setTimeout(() => {
            setPrompt(response)
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
            /*if (turn_temp > 3 && diaryRequest.current === false) {
                //기존 요청이 하나도 없는 상태에서 3턴이 넘어간 경우
                console.log("다이어리 요청 들어감");
                requestSummerization();
                diaryRequest.current = true;
            }*/
            turnCount.current = turn_temp;
        } else {
            console.log("No such document!");
        }
    }

    // https://mindfuljournal-fzesr.run.goorm.site
    // http://0.0.0.0:8000

    function requestPrompt(text, user, num, turn, module, model) {
        return fetch('https://mindfuljournal-fzesr.run.goorm.site/operator', {
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

    async function requestSummerization() {
        return fetch('https://mindfuljournal-fzesr.run.goorm.site/diary', {
            method: 'POST',
            body: JSON.stringify({
                'user': props.userMail,
                'num': session,
            })
        })
            .catch(err => console.log(err));
    }

    const FloatingButton = ({onClick, children}) => {
        return (
            <button className="floating-button" onClick={onClick}>
                {children}
            </button>
        );
    };

    function Unix_timestamp(t) {
        var date = new Date(t * 1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth() + 1);
        var day = "0" + date.getDate();
        var hour = "0" + date.getHours();
        var minute = "0" + date.getMinutes();
        var second = "0" + date.getSeconds();
        return month.substr(-2) + "월 " + day.substr(-2) + "일, " + hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2);
    }

    async function addConversationFromUser(input, comment) {
        let system_temp = {"role": "assistant", "content": prompt}
        let user_temp = {"role": "user", "content": input};
        /* let history_temp = {
             "prompt": prompt,
             "userInput": input,
             "module": module,
             "comment": comment,
             "turn": turnCount.current
         }*/
        const docRef2 = doc(db, "session", props.userMail, "diary", session);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().conversation;
            // const history = docSnap2.data().history;
            message[message.length] = system_temp;
            message[message.length] = user_temp;
            // history[history.length] = history_temp
            let a = setTimeout(async () => {
                await setDoc(docRef2, {
                    conversation: message,
                    outputFromLM: "",
                    // history: history,
                }, {merge: true});
                await updateDoc(docRef2, {
                    turn: increment(1)
                })
                assemblePrompt();
                setLoading(true);
                setTextInput("");
            }, 500)
            return () => {
                clearTimeout(a)
            }
        } else {
            console.log("데이터 없음");
        }
    }


    if (surveyReady === false) {
        return (
            <Container>
                <Row>
                    <div className="loading_box">
                        <span className="desktop-view">
                            {date}<br/><b>오늘 나의 마음상태를 확인해봐요</b> 😀
                        </span>
                        <span className="smartphone-view">
                            {date}<br/><b>오늘 마음상태를<br/>확인해봐요</b> 😀
                        </span>
                    </div>
                </Row>
                <Row>
                    <Col>
                        {PreviewComponent()}
                        <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    console.log(phq1.current + phq2.current + phq3.current + phq4.current + phq5.current + phq6.current + phq6.current + phq7.current + phq8.current + phq9.current);
                                }}
                            >🌤️오늘의 마음상태 확인하기
                            </Button>
                    </Col>
                </Row>
                &nbsp;

            </Container>
        )
    } else if (sessionStatus === false) {
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
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    const newSession = String(Math.floor(Date.now() / 1000));
                                    setSession(newSession)
                                    createNewDoc(newSession)
                                }}
                            >📝 오늘의 일기 작성하기
                            </Button>
                            &nbsp;
                            <Form.Text className="text-muted">
                                종료되지 않은 세션을 이어 진행하려면<br/>아래에서 진행중인 세션을 선택해주세요
                            </Form.Text>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
                &nbsp;
                <Row xs={'auto'} md={1} className="g-4">
                    {existing.map((_, idx) => (
                        <Col>
                            <Button
                                variant="dark"
                                style={{backgroundColor: "007AFF", fontWeight: "400"}}
                                onClick={() => {
                                    const newSession = String(existing[idx]["sessionStart"]);
                                    setSession(newSession)
                                    createNewDoc(newSession)
                                }}>
                                {Unix_timestamp(existing[idx]["sessionStart"])}
                            </Button>
                        </Col>
                    ))}


                </Row>
            </Container>
        )
    } else {
        return (
            <Container>
                <Row>
                    <div>
                        <Badge bg="primary">
                            사용자: {props.userMail}
                        </Badge>{' '}
                        <Badge bg="primary">
                            세션이름: {session}
                        </Badge>{' '}
                        {/*<Badge bg="light" text="dark">
                            모듈: {module}
                        </Badge>{' '}*/}
                        <Badge bg="light" text="dark">
                            턴: {turnCount.current}
                        </Badge>{' '}

                        {loading === true ? <Loading/> :
                            <Userinput prompt={prompt} setInputUser={setInputUser} inputUser={inputUser}
                                       addConversationFromUser={addConversationFromUser}
                                       requestSummerization={requestSummerization} setLoading={setLoading}
                                       turnCount={turnCount.current} setDiary={setDiary} textInput={textInput}
                                       setTextInput={setTextInput} toggleListening={toggleListening}
                                       isListening={isListening} setShow={setShow} show={show}/>}
                    </div>
                </Row>
                <Row>
                    {turnCount.current > 3 && loading === false ? <DiaryView diary={diary} submitDiary={submitDiary}
                                                                             setModalShow={setModalShow}
                                                                             turncount={turnCount.current}/> :
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
                {/*<ToastContainer className="p-3" position={"top-center"}>
                    <Toast onClose={() => props.setShow(false)} show={props.show} delay={3000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">알림</strong>
                            <small>이창은 3초 후 자동으로 닫힘니다</small>
                        </Toast.Header>
                        <Toast.Body>새로운 다이어리가 작성되었어요. 아래로 스크롤해서 확인해보세요</Toast.Body>
                    </Toast>
                </ToastContainer>*/}
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
                        <span className="smartphone-view-text-tiny" 의>
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
                    {/*<span className="desktop-view">
                            <div className="writing_box">
                            <Form.Label htmlFor="commentInput">
                                <span className="desktop-view">
                                ✍️ 언어모델 출력에 대한 코멘트를 입력해주세요
                        </span>
                                <span className="smartphone-view-text-tiny">
                                ✍️ 언어모델 출력에 대한 코멘트를 입력해주세요
                            </span>
                            </Form.Label>
                            <Form.Control
                                type="input"
                                as="textarea"
                                rows={2}
                                id="commentInput"
                                onChange={(e) => {
                                    temp_comment_input.current = e.target.value
                                }}
                            />
                        </div>
                        </span>*/}
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

                        {/*{props.isListening ? <button className="floating-button_2" onClick={props.toggleListening}><i className="fa fa-pause" style={{ color: '#F8F9FA' }}></i></button> : <button className="floating-button" onClick={props.toggleListening}><i className="fa fa-microphone" style={{ color: '#FFF' }}></i></button>}*/}
                        {/*                        */}
                        {/*                        <button className="floating-button" onClick={props.toggleListening}>*/}
                        {/*  {props.isListening ? <i className="fa fa-pause"></i> : <i className="fa fa-microphone"></i>}*/}
                        {/*</button>*/}
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
                                <Form.Text id="userInput" muted><div
                                    style={{fontSize: '20px'}}>일기 작성중입니다. 다이어리 작성을 더 진행해주세요</div></Form.Text>
                            </span>
                        <span className="smartphone-view">
                                <Form.Text id="userInput" muted><div style={{fontSize: '15px'}}>일기 작성중입니다.<br/>다이어리 작성을 더 진행해주세요</div></Form.Text>
                            </span>
                    </div>
                </Row>
            </div>
        )
    } else if (props.turncount > 3) {
        return (
            <div className="inwriting_review_box">
                &nbsp;
                <Row xs={'auto'} md={1} className="g-4">
                    <Col>
                        <Card style={{
                            width: '100%',
                        }}>
                            <Card.Body>
                                <Card.Title>오늘의 마음챙김 다이어리</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                </Card.Subtitle>
                                <Card.Text>
                                    <div>{props.diary}</div>
                                </Card.Text>
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
