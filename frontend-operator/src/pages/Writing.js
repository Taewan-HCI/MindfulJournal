import { useEffect, useState, useRef, React } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  getCountFromServer,
  updateDoc,
  arrayUnion,
  increment,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase-config";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ScaleLoader } from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";

function Writing(props) {
  let [loading, setLoading] = useState(false);
  const [session, setSession] = useState("");
  const [userName, setUserName] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [tempText, setTempText] = useState("");

  const optionsforReview = useRef([]);
  const promptforReview = useRef("");
  const sessionStatus = useRef(false);
  const diaryNumber = useRef("");
  const receivedText = useRef(null);
  const receivedText2 = useRef(null);
  const receivedText3 = useRef(null);
  const receivedText4 = useRef(null);
  const receivedText5 = useRef(null);
  const receivedText6 = useRef(null);
  const receivedText7 = useRef(null);

  const selectedOption = useRef(null);

  const prompt = useRef([2]);
  const prompt_local = useRef([1]);

  const sessionInputRef = useRef(null);
  const userNameRef = useRef(null);
  const userInput = useRef(null);
  const directMsg = useRef(null);
  let [existing, setExisting] = useState([{ sessionStart: "데이터 불러오기" }]);
  const updateProgress = useRef(true);

  useEffect(() => {
    async function renewList() {
      const existingSession = await receiveSessionData();
      setExisting(existingSession);
      // updateProgress.current = false
      console.log(existing);
    }
    if (userName !== "" && session === "") {
      renewList();
    } else if (sessionStatus) {
      if (loading) {
        const unsuscribe = onSnapshot(
          doc(db, "session", userName, "diary", session),
          (doc) => {
            receivedText.current = doc.data()["outputForReview"]["options"];
            receivedText4.current = doc.data()["outputForReview"];
            receivedText2.current = doc.data()["conversation"];
            receivedText3.current = doc.data()["reviewMode"];
            receivedText5.current = doc.data()["isFinished"];
            receivedText7.current = doc.data()["status"];
            receivedText6.current = doc.data()["outputFromLM"];
            const response = receivedText.current;
            const response2 = receivedText2.current;
            userInput.current = response2[response2.length - 1];
            prompt.current = response;
            setReviewMode(receivedText3.current);
            if (receivedText5.current == true) {
              alert("사용자가 일기 작성을 종료하였습니다");
              sessionStatus.current = false;
            } else if (prompt_local.current[0] !== receivedText.current[0]) {
              setLoading(false);
            } else if (receivedText7.current == "new") {
              setLoading(false);
            }
          }
        );
        return () => {
          unsuscribe();
        };
      }
    }
  });

  async function receiveSessionData() {
    let tempArr = [];
    const userDocRef = doc(db, "session", userName);
    const diaryCompleteCollRef = collection(userDocRef, "diary");
    const q = query(
      diaryCompleteCollRef,
      where("isFinished", "==", false),
      orderBy("sessionStart", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      tempArr.push(doc.data());
    });
    let resultArr = tempArr.slice(0, 4);
    return resultArr;
  }

  async function reviewSubmit(list, str) {
    const docRef = doc(db, "session", userName, "diary", session);
    const docSnap = await getDoc(docRef);
    let history_temp = receivedText4.current;
    let prompt_temp = receivedText4.current;
    history_temp["harmful"] = { list };
    history_temp["selected"] = selectedOption.current;
    history_temp["feedbackfromexpert"] = str;
    prompt_temp["options"] = [];
    if (docSnap.exists()) {
      const history = docSnap.data().history_operator;
      history[history.length] = history_temp;
      const harmful = docSnap.data().HarmfulMsg;
      // harmful[harmful.length] = {list};

      if (prompt_local.current[0] === receivedText.current[0]) {
        let a = setTimeout(async () => {
          await setDoc(
            docRef,
            {
              history_operator: history,
              reviewMode: false,
              status: "old",
            },
            { merge: true }
          );
          selectedOption.current = "";
          setLoading(true);
        }, 500);
        return () => {
          clearTimeout(a);
        };
      } else {
        let a = setTimeout(async () => {
          await setDoc(
            docRef,
            {
              history_operator: history,
              reviewMode: false,
            },
            { merge: true }
          );
          selectedOption.current = "";
          setLoading(true);
        }, 500);
        return () => {
          clearTimeout(a);
        };
      }
    } else {
      console.log("데이터 없음");
    }
  }

  async function sendOptionChoice(text) {
    selectedOption.current = text;
    const docRef = doc(db, "session", userName, "diary", session);
    optionsforReview.current = receivedText.current;
    promptforReview.current = userInput.current["content"];
    prompt_local.current = prompt.current;
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const readyRequest = docSnap.data().conversation;
      let a = setTimeout(async () => {
        await setDoc(
          docRef,
          {
            outputFromLM: text,
            // fiveOptionFromLLM: [],
            reviewMode: true,
          },
          { merge: true }
        );
        setLoading(true);
        diaryInit(readyRequest, userName, session);
      }, 500);
      return () => {
        clearTimeout(a);
      };
    } else {
      console.log("데이터 없음");
    }
  }

  function Unix_timestamp(t) {
    var date = new Date(t * 1000);
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    var day = "0" + date.getDate();
    var hour = "0" + date.getHours();
    var minute = "0" + date.getMinutes();
    var second = "0" + date.getSeconds();
    return (
      month.substr(-2) +
      "월 " +
      day.substr(-2) +
      "일, " +
      hour.substr(-2) +
      ":" +
      minute.substr(-2) +
      ":" +
      second.substr(-2)
    );
  }

  function diaryInit(text, user, num) {
    return fetch("https://algodiary--xpgmf.run.goorm.site/diary", {
      method: "POST",
      body: JSON.stringify({
        text: text,
        user: user,
        num: num,
      }),
    }).catch((err) => console.log(err));
  }

  async function createNewDoc(newSession) {
    if (session === "") {
      const doc_1 = doc(db, "session", userName, "diary", newSession);
      const existingSession = await getDoc(doc_1);
      if (existingSession.exists()) {
        // diaryNumber.current = String(newSession)
        await setDoc(
          doc(db, "session", userName, "diary", newSession),
          {
            module: "",
            operator: props.userName,
            reviewMode: false,
          },
          { merge: true }
        );
        sessionStatus.current = true;
        setLoading(true);
      } else {
        alert("환자가 아직 세션을 시작하지 않았습니다.");
      }
    } else {
      const doc_1 = doc(db, "session", userName, "diary", session);
      const existingSession = await getDoc(doc_1);
      if (existingSession.exists()) {
        diaryNumber.current = String(session);
        await setDoc(
          doc(db, "session", userName, "diary", session),
          {
            module: "",
            operator: props.userName,
            reviewMode: false,
          },
          { merge: true }
        );
        sessionStatus.current = true;
        setLoading(true);
      } else {
        alert("환자가 아직 세션을 시작하지 않았가습니다.");
      }
    }
  }

  //사용자-sessionID의 doc을 계속 관찰하고 있다가 업데이트가 발생하면 prompt를 업데이트 하는 useEffect 함수

  if (sessionStatus.current === false && userName === "") {
    return (
      <Container>
        <Row>
          <div className="loading_box">
            <div>
              <b>환자 아이디를 입력해주세요</b>
            </div>
          </div>
        </Row>
        <Row>
          <Col>
            <div className="d-grid gap-2">
              <Form.Group className="mb-3" controlId="formSessionNumber">
                <Form.Control
                  type="text"
                  placeholder="환자 아이디를 입력해주세요"
                  ref={userNameRef}
                  onChange={() => {
                    setTempText(userNameRef.current.value);
                  }}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                style={{ backgroundColor: "007AFF", fontWeight: "600" }}
                onClick={() => {
                  setUserName(userNameRef.current.value);
                }}
              >
                🔎 세션 검색
              </Button>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  } else if (sessionStatus.current === false) {
    return (
      <Container>
        <Row>
          <div className="loading_box">
            <span className="desktop-view">
              <b>진행하고자 하는 세션을 선택해주세요</b>
            </span>
            <span className="smartphone-view">
              <b>진행하고자 하는 세션을 선택해주세요</b>
            </span>
          </div>
        </Row>
        <Row>
          <Col>
            <div className="d-grid gap-2">
              <Form.Text className="text-muted">
                {userName} 환자의 <br />
                종료되지 않은 최근 5개의 세션입니다.
              </Form.Text>
            </div>
          </Col>
          <Col></Col>
        </Row>
        &nbsp;
        <Row xs={"auto"} md={1} className="g-4">
          {existing.map((_, idx) => (
            <Col>
              <Button
                variant="dark"
                style={{ backgroundColor: "007AFF", fontWeight: "400" }}
                onClick={() => {
                  const newSession = String(existing[idx]["sessionStart"]);
                  setSession(newSession);
                  createNewDoc(newSession);
                }}
              >
                {Unix_timestamp(existing[idx]["sessionStart"])}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    );
  } else {
    return (
      <Container>
        <Row>
          <div>
            <div>
              세션 참여 환자:<b>{userName}</b> 세션 넘버:<b>{session}</b>
            </div>
            {loading === true && !reviewMode ? (
              <Loading />
            ) : (
              <Userinput
                userInput={userInput.current}
                prompt={prompt.current}
                sendOptionChoice={sendOptionChoice}
                directMsg={directMsg}
                userName={userName}
                reviewMode={reviewMode}
                setReviewMode={setReviewMode}
                reviewSubmit={reviewSubmit}
                optionsforReview={optionsforReview.current}
                promptforReview={promptforReview.current}
                setLoading={setLoading}
              />
            )}
          </div>
        </Row>
      </Container>
    );
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
                <ScaleLoader color="#007AFF" speedMultiplier={0.9} />
              </div>
              <div>사용자가 일기를 입력중입니다</div>
            </div>
          </Col>
        </Row>
        <Row></Row>
      </Container>
    </div>
  );
}

//User input screen component
function Userinput(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleOptionSelect = (option) => {
    setSelectedOptions([...selectedOptions, option]);
  };

  if (props.reviewMode) {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div className="prompt_box">
                <div className="smalltxt">
                  ✏️ 사용자의 입력에 대한 언어모델 출력을 평가해주세요
                </div>
                <div className="tte">{props.promptforReview}</div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={10}>
              <div className="smalltxt">
                <b>언어모델 출력</b>
              </div>
              &nbsp;
            </Col>

            <Col md={2}>
              <div className="smalltxt">
                <b>🚨유해한 문장</b>
              </div>
              &nbsp;
            </Col>
          </Row>

          {props.optionsforReview.map((_, idx) => (
            <Row>
              <Col md={10}>
                <div className="writing_box">{props.optionsforReview[idx]}</div>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    borderBottom: "1px solid #E2E2E2",
                    lineHeight: "0.1em",
                    margin: "20px 0 20px",
                  }}
                >
                  <span style={{ background: "#CBCBCB" }}></span>
                </div>
              </Col>

              <Col md={1}>
                <div className="smalltxt">
                  <label>
                    <input
                      type="checkbox"
                      value="option1"
                      onChange={() => {
                        handleOptionSelect(props.optionsforReview[idx]);
                      }}
                    />
                  </label>
                </div>
              </Col>
            </Row>
          ))}
          <Row>
            <Col sm={10}>
              <div className="writing_box">
                <Form.Control
                  placeholder="그 외 언어모델 출력에 대해 피드백할 내용이 있다면 입력해주세요."
                  type="input"
                  as="textarea"
                  rows={2}
                  id="userInput"
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                />
              </div>
              &nbsp;
            </Col>
            <Col sm={2}>
              <div className="d-grid gap-2">
                <Button
                  variant="dark"
                  style={{ backgroundColor: "007AFF", fontWeight: "600" }}
                  onClick={() => {
                    props.reviewSubmit(selectedOptions, feedbackMsg);
                    // props.sendOptionChoice(props.directMsg.current.value)
                  }}
                >
                  평가 완료하기
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <div className="prompt_box">
                <div className="smalltxt">💬 {props.userName}의 입력 내용</div>
                <div className="tte">{props.userInput["content"]}</div>
                &nbsp;
              </div>
            </Col>
          </Row>

          {props.prompt.map((_, idx) => (
            <Row>
              <Col md={9}>
                <div className="writing_box">{props.prompt[idx]}</div>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    borderBottom: "1px solid #E2E2E2",
                    lineHeight: "0.1em",
                    margin: "20px 0 20px",
                  }}
                >
                  <span style={{ background: "#CBCBCB" }}></span>
                </div>
              </Col>

              <Col md={2}>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    style={{ backgroundColor: "007AFF", fontWeight: "600" }}
                    onClick={() => {
                      props.sendOptionChoice(props.prompt[idx]);
                    }}
                  >
                    전송하기
                  </Button>
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
                  style={{ backgroundColor: "007AFF", fontWeight: "600" }}
                  onClick={() => {
                    props.sendOptionChoice(props.directMsg.current.value);
                  }}
                >
                  직접 개입하기
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Writing;
