



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
import templateFactory from "bootstrap/js/src/util/template-factory";


function Writing(props) {

    let [loading, setLoading] = useState(false)

    const sessionStatus = useRef(false)
    const diaryNumber = useRef("");
    const receivedText = useRef("");
    const receivedDiary = useRef("");

    const turnCount = useRef(0);
    const sessionInputRef = useRef(null)
    const [session, setSession] = useState("")


    let [inputUser, setInputUser] = useState('')
    let [prompt, setPrompt] = useState('')
    let [module, setModule] = useState('')
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
        // 기존에 작성하던 세션 문서가 있는지 확인
        // 만약 문서가 있다면 아래의 setDoc 진행하지 않음. sessionStatus만 true로 변경
        const docRef = doc(db, "session", props.userName, "diary", session);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("진행중인 세션이 있습니다");
        } else {
            const coll = collection(db, "session", props.userName, "diary")
            const existingSession = await getCountFromServer(coll)
            const sessionNum = await (existingSession.data().count + 1)
            diaryNumber.current = String(sessionNum)
            await setDoc(doc(db, "session", props.userName, "diary", session), {
                outputFromLM: ["만나서 반가워요. 오늘 하루는 어떤가요?", "Initiation"],
                conversation: [],
                isFinish: false,
                module: "",
                fiveOptionFromLLM: [],
                diary: "",
                topic: "",
                sessionStart: Math.floor(Date.now() / 1000),
                summary: "",
                history: []
            });
        }
        sessionStatus.current = true
        setLoading(true)
    }

    /*   async function submitDiary() {
           const coll = collection(db, "session", props.userName, "diary_complete")
           const existingSession = await getCountFromServer(coll)
           const diaryNum = await (existingSession.data().count + 1)
           await setDoc(doc(db, "session", props.userName, "diary_complete", String(diaryNum)), {
               diaryNum: diaryNum,
               content: diary,
               createdAt: Math.floor(Date.now() / 1000),
               like: 0,
           });
           navigateToReview()
       }*/


    async function submitDiary() {
        await setDoc(doc(db, "session", props.userName, "diary_complete", session), {
            sessionEnd: Math.floor(Date.now() / 1000),
            isFinished: true,
            like: 0,
        }, {merge: true});
        navigateToReview()
    }

    //사용자-sessionID의 doc을 계속 관찰하고 있다가 업데이트가 발생하면 prompt를 업데이트 하는 useEffect 함수
    useEffect(() => {
        if (sessionStatus) {
            if (session !== "") {
                const unsuscribe = onSnapshot(doc(db, "session", props.userName, "diary", session), doc => {
                    receivedText.current = doc.data()["outputFromLM"]
                    const response = receivedText.current;
                    getLastSentence(response)
                })
                const unsuscribe2 = onSnapshot(doc(db, "session", props.userName, "diary", session), doc => {
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
            setModule(response[1])
            setPrompt(response[0])
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
        const docRef3 = doc(db, "session", props.userName, "diary", session);
        const docSnap = await getDoc(docRef3);
        if (docSnap.exists()) {
            const readyRequest = docSnap.data().conversation;
            console.log(readyRequest)
            turnCount.current = turnCount.current + 1
            requestPrompt(readyRequest, props.userName, session, turnCount.current, module)
        } else {
            console.log("No such document!");
        }
    }

    // https://mindfuljournal-fzesr.run.goorm.site
    // http://0.0.0.0:8000

    function requestPrompt(text, user, num, turn, module) {
        return fetch('https://mindfuljournal-fzesr.run.goorm.site/standalone', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,
                'user': user,
                'num': num,
                'turn': turn,
                'module': module
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
                'num': session
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

    async function addConversationFromUser(input, comment) {
        let system_temp = {"role": "assistant", "content": prompt}
        let user_temp = {"role": "user", "content": input};
        let history_temp = {"prompt": prompt, "userInput": input, "module": module, "comment": comment ,"turn": turnCount.current}

        const docRef2 = doc(db, "session", props.userName, "diary", session);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().conversation;
            message[message.length] = system_temp;
            message[message.length] = user_temp;
            const history = docSnap2.data().history;
            history[history.length] = history_temp;
            let a = setTimeout(async () => {
                await setDoc(docRef2, {
                    conversation: message,
                    history: history_temp,
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
                            종료되지 않은 세션을 이어 진행하고자 한다면<br/>진행중인 세션 번호를 입력해주세요
                            <input placeholder="세션 번호를 입력해주세요" ref={sessionInputRef}></input>
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
                        <div>현재 사용자:<b>{props.userName}</b> 세션 넘버:<b>{session}</b> 현재 모듈:<b>{module}</b> 현재 진행
                            turn:<b>{turnCount.current}</b></div>
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
                    {/*{summerization === "" ? <div></div> : <SummerizationView/>}*/}
                </Row>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            </Container>

        )
    }


}


//User input screen component
function Userinput(props) {
    //for textfield monitoring
    const temp_input = useRef("");
    const temp_comment_input = useRef("");


    /*const handleOnKeyPress = e => {
        if (e.key === "Enter") {
            props.addConversationFromUser(temp_input.current, temp_comment_input.current)
        }
    }*/

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
                            // onKeyPress={handleOnKeyPress}
                        />
                        <Form.Text id="userInput" muted>
                            📝 정해진 양식은 없어요. 편안하고 자유롭게 최근에 있었던 일을 작성해주세요.
                        </Form.Text>

                        <div className="writing_box">

                            <Form.Label htmlFor="commentInput">✍️ 언어모델 출력에 대한 코멘트를 입력해주세요</Form.Label>
                            <Form.Control
                                type="input"
                                as="textarea"
                                rows={3}
                                id="commentInput"
                                onChange={(e) => {
                                    temp_comment_input.current = e.target.value
                                }}
                                // onKeyPress={handleOnKeyPress}
                            />

                        </div>


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
                                                    props.addConversationFromUser(temp_input.current, temp_comment_input.current)
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

function SummerizationView() {
    return (
        <div className="inwriting_review_box">
            <Container>
                <Row xs={'auto'} md={1} className="g-4">
                    <Col>
                        <Card style={{
                            width: '100%',
                        }}>
                            <Card.Body>
                                <Card.Title>현재까지의 대화 내용</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    <div>아래의 요약은 정확하지 않을 수 있습니다.</div>
                                </Card.Subtitle>
                                <Card.Text>
                                    <div>여기에 대화 내용이 요약됩니다.</div>
                                </Card.Text>
                            </Card.Body>
                        </Card>


                    </Col>
                </Row>
            </Container>
        </div>
    )
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

export default Writing
