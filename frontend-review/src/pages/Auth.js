import {auth, provider} from "../firebase-config"
import {signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie'
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';


import {React, useState} from "react";

const cookies = new Cookies()

export const Auth = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [username, setUsername] = useState("");
    const [newUser, setNewUser] = useState(false);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token", result.user.refreshToken);
            props.setIsAuth(true)
            props.setUserName(auth.currentUser.displayName)
        } catch (err) {
            console.error(err);

        }
    };

    const signInWithEmailPassword = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            cookies.set("auth-token", result.user.refreshToken);
            props.setIsAuth(true)
            props.setUserName(auth.currentUser.displayName)
        } catch (err) {
            console.error(err);
            if (err.message.includes("wrong-password")) {
                alert("비밀번호가 틀렸습니다. 비밀번호가 기억나지 않으신다면, taewan@kaist.ac.kr 또는 010-9085-2356으로 연락부탁드립니다.");
            } else if (err.message.includes("user-not-found")) {
                alert("계정정보가 없습니다.")
            } else if (err.message.includes("invalid-email")) {
                alert("올바른 이메일 형식이 아닙니다.")
            } else {
                alert('Error: ' + err.message);
            }
        }
    }

    const signUpWithEmailPassword = async () => {
        if (password !== passwordCheck) {
            alert("비밀번호가 일치하지 않습니다. 동일한 비밀번호를 입력해주세요");
        } else {
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(auth.currentUser, {
                    displayName: username
                });
                cookies.set("auth-token", result.user.refreshToken);
                props.setIsAuth(true)
                props.setUserName(auth.currentUser.displayName)
            } catch (err) {
                console.error(err);
                if (err.message.includes("email-already-in-use")) {
                    alert("이미 가입된 이메일입니다. 비밀번호가 기억나지 않으신다면, taewan@kaist.ac.kr 또는 010-9085-2356으로 연락부탁드립니다.");
                } else if (err.message.includes("invalid-email")) {
                    alert("올바른 이메일 형식이 아닙니다.")
                } else if (err.message.includes("weak-password")) {
                    alert("비밀번호는 6자 이상으로 설정해주세요")
                } else {
                    alert('Error: ' + err.message);
                }
            }

        }

    }


    if (newUser) {
        return (
            <div>
                <Container>
                    <Row>
                        <div className="loading_box">
                    <span className="desktop-view">
                마음챙김 다이어리를 이용하기 위해<br/><b>로그인이 필요합니다</b> 🔒
            </span>
                            <span className="smartphone-view">
                다이어리를 이용하시려면<br/><b>로그인이 필요합니다</b> 🔒
            </span>
                        </div>
                    </Row>

                <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="✉️ 이메일 주소를 입력해주세요"
                                              onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Control type="text" placeholder="👤 성함을 입력해주세요"
                                              onChange={(e) => setUsername(e.target.value)}/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                {/*<Form.Label>비밀번호</Form.Label>*/}
                                <Form.Control type="password" placeholder="🔑 비밀번호를 입력해주세요"
                                              onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="🔑 비밀번호를 한번 더 입력해주세요"
                                              onChange={(e) => setPasswordCheck(e.target.value)}/>
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    style={{backgroundColor: "6c757d", fontWeight: "600"}}
                                    onClick={signUpWithEmailPassword}>
                                    이메일/비밀번호로 가입하기
                                </Button>
                                <span className="likebutton" onClick={() => {
                                    setNewUser(false)
                                }}>
                            <Form.Text className="text-muted">
                                <b>이미 가입한 계정이</b> 있으신가요?
                            </Form.Text>
                                </span>
                                <span className="likebutton" onClick={signInWithGoogle}>
                            <Form.Text className="text-muted">
                                <b>Google 계정을</b> 이용하여 로그인하고 싶으신가요?
                            </Form.Text>
                                </span>
                            </div>
                        </Col>
                        <Col className="desktop-view">
                        </Col>
                    </Row>



                </Container>
            </div>
        )
    }
    return (
        <Container>
            <Row>
                <div className="loading_box">
                    <span className="desktop-view">
                마음챙김 다이어리를 이용하기 위해<br/><b>로그인이 필요합니다</b> 🔒
            </span>
                    <span className="smartphone-view">
                다이어리를 이용하시려면<br/><b>로그인이 필요합니다</b> 🔒
            </span>
                </div>
            </Row>

                <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        {/*<Form.Label>이메일 주소</Form.Label>*/}
                        <Form.Control type="email" placeholder="✉️ 이메일 주소를 입력해주세요"
                                      onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        {/*<Form.Label>비밀번호</Form.Label>*/}
                        <Form.Control type="password" placeholder="🔑 비밀번호를 입력해주세요"
                                      onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>


                    <div className="d-grid gap-2">
                        <Button
                            variant="primary"
                            style={{backgroundColor: "007AFF", fontWeight: "600"}}
                            onClick={signInWithEmailPassword}>
                            이메일/비밀번호로 로그인하기
                        </Button>

                        <Button
                            variant="dark"
                            style={{backgroundColor: "6c757d", fontWeight: "600"}}
                            onClick={() => {
                                setNewUser(true)
                            }}>
                            새로운 계정 만들기
                        </Button>
                        &nbsp;
                        <Button
                            variant="light"
                            style={{backgroundColor: "6c757d", fontWeight: "600"}}
                            onClick={signInWithGoogle}>
                            <img
                                src="https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227"
                                alt="Google logo"
                                style={{width: "20px", height: "20px", marginRight: "8px"}}
                            />
                            구글 계정으로 로그인하기
                        </Button>
                        <span className="likebutton" onClick={() => {
                            alert("taewan@kaist.ac.kr 또는 010-9085-2356으로 문의 부탁드립니다.")
                        }}>
                            <Form.Text className="text-muted">
                                <b>로그인에 문제가</b> 있으신가요?
                            </Form.Text>
                                </span>
                    </div>
                </Col>
                <Col className="desktop-view">
                </Col>
            </Row>



        </Container>
    )
}
export default Auth;
