import {useEffect, useState, useRef, React} from "react";
import {
    addDoc,
    doc,
    getDoc,
    setDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy,
    getCountFromServer,
} from 'firebase/firestore'
import {auth, db} from "../../firebase-config";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {ScaleLoader, BeatLoader} from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ko} from 'date-fns/esm/locale';

function Writing(props) {

    //화면과 기능 전환 정의를 위한 state
    // let [sessionStatus, setSessionStatus] = useState(false) //세션 시작 확인
    let [loading, setLoading] = useState(false) //로딩(request API) 확인
    const [tempText, setTemp] = useState('') //get-last-sentence 확인
    let [refresh, setRefresh] = useState(0)

    //현재 세션 정보
    let [currentSession, setCurrentSession] = useState("")//세션 넘버
    const sessionStatus = useRef(false)
    const diaryNumber = useRef("");
    const receivedText = useRef("");
    const inConversation = useRef("");
    const promptForLM = useRef("");
    // let [inConversation, setInConversation] = useState("")//봇,사용자 대화기록
    let [inputUser, setInputUser] = useState('')//사용자가 textinput에 입력한 내용
    // let [promptForLLM, setPromptForLLM] = useState('') //LLM요청을 위한 promptset
    let [prompt, setPrompt] = useState('')

    //기타
    let [showConversation, setShowConversation] = useState(false) //대화 원본 보여주기/가리기

    //whisper 관련

    async function createNewDoc() {
        const coll = collection(db, "session", props.userName, "diary")
        const existingSession = await getCountFromServer(coll)
        const sessionNum = await (existingSession.data().count + 1)
        diaryNumber.current = String(sessionNum)
        await setDoc(doc(db, "session", props.userName, "diary", String(sessionNum)), {
            outputFromLM: "A: 오늘 있었던 일에 대해 듣고 싶어요. 정해진 규칙이 없으니 자유롭게 얘기해주세요.\\nB: 오",
            conversation: "",
            isFinish: false,
            module: ""
        });
        sessionStatus.current = true
        setLoading(true)
    }

    //사용자-sessionID의 doc을 계속 관찰하고 있다가 업데이트가 발생하면 prompt를 업데이트 하는 useEffect 함수
    useEffect(() => {
        if (sessionStatus) {
            if (diaryNumber.current != "") {

                const unsuscribe = onSnapshot(doc(db, "session", props.userName, "diary", String(diaryNumber.current)), doc => {
                    console.log(doc.data()["outputFromLM"]);
                    receivedText.current = doc.data()["outputFromLM"]
                    const response = receivedText.current;
                    getLastSentence(response)
                })
                return () => unsuscribe();
            }
        }
    })

    /*async function getLastSentence(response) {
        let output = ""
        // console.log(response)
        let loc_1 = await response.lastIndexOf("나: ");
        let temp_text = await response.slice(loc_1 + 3);
        // console.log(temp_text)
        if (temp_text.includes("\\n")) {
            let loc_2 = await temp_text.indexOf("\\n");
            output = await temp_text.substring(0, loc_2)
        } else {
            let loc_2 = await temp_text.indexOf("사용자:");
            output = await temp_text.substring(0, loc_2)
        }
        // let addconversation = inConversation + 'A: ' + output + '\n'
        // setInConversation(addconversation)
        let a = setTimeout(() => {
            setPrompt(output)
            console.log(prompt)
            if ((prompt).trim() === "") {
                setLoading(true)
            } else {
                setLoading(false)
            }
            // setLoading(false)
        }, 10)
        return () => {
            clearTimeout(a)
        }
    }*/

    async function getLastSentence(response) {
        let output = ""
        // console.log(response)
        let loc_1 = await response.lastIndexOf("A: ");
        let temp_text = await response.slice(loc_1 + 3);
        // console.log(temp_text)
        if (temp_text.includes("\\n")) {
            let loc_2 = await temp_text.indexOf("\\n");
            output = await temp_text.substring(0, loc_2)
        } else {
            let loc_2 = await temp_text.indexOf("B:");
            output = await temp_text.substring(0, loc_2)
        }
        // let addconversation = inConversation + 'A: ' + output + '\n'
        // setInConversation(addconversation)
        let a = setTimeout(() => {
            setPrompt(output)
            console.log(prompt)
            if ((prompt).trim() === "") {
                setLoading(true)
            } else {
                setLoading(false)
            }
            // setLoading(false)
        }, 10)
        return () => {
            clearTimeout(a)
        }
    }


    async function assemblePrompt() {
        let text = ''
        let instruction = ''
        let sentences = []
        let sentences_2 = []
        const docRef = doc(db, 'prompt', 'module1_1');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            sentences = docSnap.data().demonstration;
            // console.log(sentences)
            sentences_2 = shuffleArray(sentences)
            // console.log(sentences_2)
            instruction = docSnap.data().instruction;
            // console.log(text)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        let temp = ""
        let i = 0
        while (true) {
            temp = temp + sentences_2[i]
            if (sentences_2.length === i) {
                // console.log(text)
                console.log(text)
                promptForLM.current = text
                requestPrompt(text, props.userName, diaryNumber.current)
                return true
            }
            text = instruction + temp + "\\n" + "###" + "\\n" + inConversation.current
            if ((text + sentences_2[i + 1]).length >= 500) {
                // console.log(text)
                console.log(text)
                promptForLM.current = text
                requestPrompt(text, props.userName, diaryNumber.current)
                return true
            }
            i++
        }
    }

    function requestPrompt(text, user, num) {
        // console.log(text)
        return fetch('http://0.0.0.0:8000/', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,
                'user': user,
                'num': num
            })
        })
            .catch(err => console.log(err));

    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    /*    function shuffleArray(array) {
            return array
        }*/


    /*async function addConversationFromUser(input) {
        let temp = "나: " + prompt + "\\n" + '사용자: ' + input + "\\n";
        const docRef2 = doc(db, "session", props.userName, "diary", String(diaryNumber.current));
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().conversation;
            let temptxt = message + temp;
            inConversation.current = temptxt;
            let a = setTimeout(async () => {
                await setDoc(docRef2, {
                    conversation: temptxt,
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
    }*/

    async function addConversationFromUser(input) {
        let temp = "A: " + prompt + "\\n" + 'B: ' + input + "\\n";
        const docRef2 = doc(db, "session", props.userName, "diary", String(diaryNumber.current));
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().conversation;
            let temptxt = message + temp;
            inConversation.current = temptxt;
            let a = setTimeout(async () => {
                await setDoc(docRef2, {
                    conversation: temptxt,
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
                        오늘의 마음챙김 세션을 시작합니다.
                    </div>
                </Row>
                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={createNewDoc}
                            >오늘의 다이어리 작성하기
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
                                       addConversationFromUser={addConversationFromUser}/>}
                    </div>


                    {/*<div className="inwriting_review_box">
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
                                                오늘은 이기적인 사람들에 대해 생각해보았다. 나는 다른 사람을 배려하지만, 그들은 나를 그렇게 배려해주지는 않는 것 같다.
                                                하지만, 나의
                                                배려속에 상대방이 보답해주기를 바라는 마음이 있는 것은 아닐까? 이것은 '미숙한 착함'이 될 수 있다. 어떻게 하면 더 성숙할 수
                                                있을지
                                                고민해봐야겠다.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <div
                                        style={{
                                            margin: "1em auto 2em"
                                        }}>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                            onClick={() => {
                                                // setOpenConversation()
                                            }}>
                                            {showConversation === true ? <div>▲ 전체 대화내용 닫기</div> :
                                                <div>▼ 전체 대화내용 보기</div>}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>*/}
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                    </Col>
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
                                    >일기 종료하기</Button>
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
                                        style={{backgroundColor: "007AFF", fontWeight: "600"}}
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
                                    <Button
                                        variant="secondary"
                                        disabled={true}
                                        style={{backgroundColor: "264362", fontWeight: "600"}}
                                    >일기 종료하기</Button>
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