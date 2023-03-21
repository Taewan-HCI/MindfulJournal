import {useEffect, useState, React} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import {ScaleLoader, BeatLoader} from "react-spinners";

function Writing(props) {

    //local state for chat_writing
    //Swich
    let [newDiary, setNewDiary] = useState(false)
    let [initiation, setInitiation] = useState(true)
    let [refresh, setRefresh] = useState(1)
    let [showConversation, setShowConversation] = useState(false)
    //Conversation log
    let [inConversation, setInConversation] = useState('')
    let [inputUser, setInputUser] = useState('')
    var ws = null;

    //initiation => run when user first enter the session + when user upload the message.
    useEffect(async () => {
        setInitiation(true) //launching loading screen
        let inConversation = assemblePrompt();
    }, [refresh]);


    function assemblePrompt() {

    }

    //requesting new propmt from the api
    function requestPrompt(text, temp, event, items) {
        return fetch('http://0.0.0.0:8000/', {
            method: 'POST',
            body: JSON.stringify({
                'text': text,
                'temp': temp,
                'event': event,
            })
        })
            .then((response) => response.json())
            .then((data) => {
                let prompt = getLastSentence(data)
                props.setPrompt(prompt)
                let a = setTimeout(() => {
                    setInitiation(false)
                }, 1000);
            });
    }

    //to get the latest sentence from the LLM response
    function getLastSentence(response) {
        let loc_1 = response.lastIndexOf("A: ");
        let temp_text = response.slice(loc_1 + 3);
        let loc_2 = temp_text.indexOf("\n");
        let output = temp_text.substring(0, loc_2)
        let addconversation = inConversation + 'A: ' + output + '\n'
        setInConversation(addconversation)
        return output
    }

    //to add user response to the propmt
    function addConversationFromUser(input) {
        let temp = inConversation + 'B: ' + input + '\n'
        setInConversation(temp)
        setRefresh(refresh + 1)
    }


    //minor functions
    function setOpenConversation() {
        if (showConversation) {
            setShowConversation(false)
            console.log('나 여깄어~')
        } else {
            setShowConversation(true)
        }
    }

    //screen backbone
    return (
        <div>
            {/*Loading <-> user input*/}
            <div>{initiation === true ? <Initiation refresh={refresh}/> :
                <Userinput prompt={props.prompt} setInputUser={setInputUser} inputUser={inputUser}
                           addConversationFromUser={addConversationFromUser}/>}</div>

            {/*Smart-diary generation feature*/}
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
                                        오늘은 이기적인 사람들에 대해 생각해보았다. 나는 다른 사람을 배려하지만, 그들은 나를 그렇게 배려해주지는 않는 것 같다. 하지만, 나의
                                        배려속에 상대방이 보답해주기를 바라는 마음이 있는 것은 아닐까? 이것은 '미숙한 착함'이 될 수 있다. 어떻게 하면 더 성숙할 수 있을지
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
                                        setOpenConversation()
                                    }}>
                                    {showConversation === true ? <div>▲ 전체 대화내용 닫기</div> : <div>▼ 전체 대화내용 보기</div>}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
} //writing component end here

//loading screen component
function Initiation(props) {
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
                            <div>{props.refresh === 1 ? <div>곧 일기 작성이 시작됩니다</div> : <div>지금까지의 이야기를 정리중입니다</div>}</div>
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
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </div>
    )
}

export default Writing