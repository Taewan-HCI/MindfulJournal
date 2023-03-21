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
import {ScaleLoader} from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";

function Writing(props) {

    let [loading, setLoading] = useState(false)
    const [session, setSession] = useState("")
    const [userName, setUserName] = useState("")

    const sessionStatus = useRef(false)
    const diaryNumber = useRef("");
    const receivedText = useRef(null);
    const receivedText2 = useRef(null);
    const prompt = useRef([]);


    const sessionInputRef = useRef(null)
    const userNameRef = useRef(null)
    const userInput = useRef(null)
    const directMsg = useRef(null)


    useEffect(() => {
        if (sessionStatus) {
            if (loading) {
                const unsuscribe = onSnapshot(doc(db, "session", userName, "diary", session), doc => {
                    receivedText.current = doc.data()["fiveOptionFromLLM"]
                    receivedText2.current = doc.data()["conversation"]
                    const response = receivedText.current;
                    const response2 = receivedText2.current;
                    userInput.current = response2[response2.length - 1]
                    prompt.current = response
                    console.log(prompt.current)
                    console.log(userInput.current)
                    if (prompt.current.length !== 0) {
                        setLoading(false)
                    }
                })
                return () => {
                    unsuscribe();
                }
            }
        }
    })


    async function createNewDoc() {
        const coll = collection(db, "session", userName, "diary")
        const existingSession = await getCountFromServer(coll)
        diaryNumber.current = String(session)
        await setDoc(doc(db, "session", userName, "diary", session), {
            module: ""
        }, {merge: true});
        sessionStatus.current = true
        setLoading(true)
    }


    //사용자-sessionID의 doc을 계속 관찰하고 있다가 업데이트가 발생하면 prompt를 업데이트 하는 useEffect 함수
    async function sendOptionChoice(text) {
        const docRef = doc(db, "session", userName, "diary", session);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let a = setTimeout(async () => {
                await setDoc(docRef, {
                    outputFromLM: text,
                    fiveOptionFromLLM: []
                }, {merge: true});
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
                            <b>사용자 이름과 세션 번호를 입력해주세요</b>
                        </div>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <input placeholder="사용자 이름을 입력해주세요" ref={userNameRef}></input>
                            <input placeholder="세션 번호를 입력해주세요" ref={sessionInputRef}></input>
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    setSession(sessionInputRef.current.value)
                                    setUserName(userNameRef.current.value)
                                    createNewDoc()
                                }}
                            >📝 세션 시작하기
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
                            <Userinput userInput={userInput.current} prompt={prompt.current}
                                       sendOptionChoice={sendOptionChoice} directMsg={directMsg} userName={userName}/>}
                    </div>
                </Row>

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
                            <div>사용자가 일기를 입력중입니다</div>
                        </div>
                    </Col>
                </Row>
                <Row>

                </Row>
            </Container>
        </div>
    )
}

//User input screen component
function Userinput(props) {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="prompt_box">
                            <div className="smalltxt">
                                💬 {props.userName}의 입력 내용
                            </div>
                            <div className="tte">
                                {props.userInput["content"]}
                            </div>
                            &nbsp;
                        </div>
                    </Col>
                </Row>

                {props.prompt.map((_, idx) => (
                    <Row>
                        <Col md={9}>

                            <div className="writing_box">
                                {props.prompt[idx]}
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    borderBottom: "1px solid #E2E2E2",
                                    lineHeight: "0.1em",
                                    margin: "20px 0 20px",
                                }}
                            >
                                <span style={{background: "#CBCBCB",}}></span>
                            </div>


                        </Col>

                        <Col md={2}>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                    onClick={() => {
                                        props.sendOptionChoice(props.prompt[idx])
                                    }}
                                >전송하기</Button>
                            </div>


                        </Col>

                    </Row>
                ))}
                <Row>

                    <Col sm={9}>
                        <div className="writing_box">
                            <Form.Control
                                placeholder="사용자에게 전송할 문장을 입력해주세요."
                                type="input"
                                as="textarea"
                                rows={2}
                                id="userInput"
                                ref={props.directMsg}
                            />
                        </div>
                        &nbsp;
                    </Col>
                    <Col sm={2}>
                        <div className="d-grid gap-2">
                            <Button
                                variant="dark"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    props.sendOptionChoice(props.directMsg.current.value)
                                }}
                            >직접 개입하기</Button>
                        </div>
                    </Col>

                </Row>


            </Container>
        </div>
    )
}


export default Writing