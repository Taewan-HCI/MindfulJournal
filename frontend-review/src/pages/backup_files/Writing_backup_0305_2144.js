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
    let [sessionStatus, setSessionStatus] = useState(false) //세션 시작 확인
    let [loading, setLoading] = useState(false) //로딩(request API) 확인
    const [tempText, setTemp] = useState('') //get-last-sentence 확인
    let [refresh, setRefresh] = useState(0)

    //현재 세션 정보
    let [currentSession, setCurrentSession] = useState("")//세션 넘버
    let [inConversation, setInConversation] = useState("")//봇,사용자 대화기록
    let [inputUser, setInputUser] = useState('')//사용자가 textinput에 입력한 내용
    let [promptForLLM, setPromptForLLM] = useState('') //LLM요청을 위한 promptset
    let [prompt, setPrompt] = useState('기본 입력')

    //기타
    let [showConversation, setShowConversation] = useState(false) //대화 원본 보여주기/가리기

    //whisper 관련

    async function createNewDoc() {
        const coll = collection(db, "session", props.userName, "diary")
        const existingSession = await getCountFromServer(coll)
        const sessionNum = await (existingSession.data().count + 1)
        setCurrentSession(sessionNum)
        await setDoc(doc(db, "session", props.userName, "diary", String(sessionNum)), {
            lastMessage: "",
            isFinish: false,
            module: "1-1"
        });
        setSessionStatus(true)
        setLoading(true)
    }

    useEffect(() => {
        async function fetchPrompt() {
            try {
                const promptSet = await assemblePrompt();
                let a = setTimeout(() => {
                    setPromptForLLM(promptSet);
                }, 1000)
                return () => {
                    clearTimeout(a)
                }
                // await requestPrompt(promptForLLM, 0.5, "");
                // setLoading(false);
            } catch (error) {
                console.log("에러가 났어요")
            }
        }

        if (loading) {
            fetchPrompt()
        }
    }, [loading]);

    useEffect(() => {
        if (sessionStatus === true) {
            // console.log(promptForLLM)
            let a = setTimeout(() => {
                requestPrompt(promptForLLM, "")
            }, 1000)
            return () => {
                clearTimeout(a)
            }
        }

    }, [promptForLLM])

    useEffect(() => {
        if (sessionStatus === true) {
            // console.log(tempText)
            getLastSentence(tempText)
        }

    }, [tempText])

    useEffect(() => {
        if (sessionStatus === true) {
            console.log(prompt)
            let a = setTimeout(() => {
                setLoading(false)
            }, 500)
            return () => {
                clearTimeout(a)
            }
        }
    }, [prompt])

//use previous: https://usehooks.com/usePrevious/
    //request-animation-frame https://developer.mozilla.org/ko/docs/Web/API/window/requestAnimationFrame
    //쓰로틀링 디바운싱 https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa


    useEffect(() => {
        if (sessionStatus === true) {
            setLoading(true)
        }
    }, [inConversation])


    function requestPrompt(text, items) {
        // console.log(text)
        return fetch('http://0.0.0.0:8000/', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,

            })
        })
            .then((response) => response.json())
            .then((data) => {
                setTemp(data)
                console.log(data)
                // let a = setTimeout(() => {
                //     setInitiation(false)
                // }, 3000)
            })
    }

    async function getLastSentence(response) {
        let output = ""
        // console.log(response)
        let loc_1 = await response.lastIndexOf("나: ");
        let temp_text = await response.slice(loc_1 + 3);
        // console.log(temp_text)
        if (temp_text.includes("\\n")) {
            let loc_2 = await temp_text.indexOf("\\n");
            output = await temp_text.substring(0, loc_2)
        }
        else {
            let loc_2 = await temp_text.indexOf("사용자:");
            output = await temp_text.substring(0, loc_2)
        }

        // let addconversation = inConversation + 'A: ' + output + '\n'
        // setInConversation(addconversation)
        let a = setTimeout(() => {
            setPrompt(output)
        }, 1000)
        return () => {
            clearTimeout(a)
        }
        // console.log(output)
        // setLoading(false)
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
                return text
            }
            text = instruction + temp + "\\n" + "###" + inConversation
            if ((text + sentences_2[i + 1]).length >= 2000) {
                // console.log(text)
                return text
            }
            i++
        }
    }

    /*  function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
          }
          return array
      }*/

    function shuffleArray(array) {
        return array
    }

    async function addConversationFromUser(input) {
        let temp = "나: " + prompt + "\\n" + '사용자: ' + input;
        const docRef2 = doc(db, "session", props.userName, "diary", String(currentSession));
        const docSnap2 = await getDoc(docRef2);
        if (docSnap2.exists()) {
            const message = docSnap2.data().lastMessage;
            let temptxt = message + temp;
            await setInConversation(temptxt);
            let a = setTimeout(() => {
                setDoc(docRef2, {
                    lastMessage: temptxt
                });

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
    let [temp_input, setTemp_input] = useState('')
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
                                setTemp_input(e.target.value)
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
                                                if (temp_input.length < 11) {
                                                    alert('입력한 내용이 너무 짧아요. 조금 더 길게 적어볼까요?')
                                                } else {
                                                    props.addConversationFromUser(temp_input)
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