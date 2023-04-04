import {auth, provider} from "../firebase-config"
import {signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie'
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


import {React, useState} from "react";

const cookies = new Cookies()

export const Auth = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [modalShow, setModalShow] = useState(false);

    const [emaillogin, setEmaillognin] = useState(false);
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
        }
    }

    const signUpWithEmailPassword = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: username // Set the display name as the part of the email before the @ symbol
            });
            cookies.set("auth-token", result.user.refreshToken);
            props.setIsAuth(true)
            props.setUserName(auth.currentUser.displayName)
        } catch (err) {
            console.error(err);
        }
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
                        Modal heading
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    if (emaillogin) {

        if (newUser) {
            return (
                <div>
                    <Container>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />


                <Row>
                    <div className="loading_box">
                        마음챙김 다이어리를 이용하기 위해<br/><b>로그인이 필요합니다</b> 🔒
                    </div>
                </Row>
                <Row>

                    <Col>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            {/*<Form.Label>이메일 주소</Form.Label>*/}
                            <Form.Control type="email" placeholder="✉️ 이메일 주소를 입력해주세요"
                                          onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            {/*<Form.Label>사용자 이름</Form.Label>*/}
                            <Form.Control type="text" placeholder="사용자 이름"
                                          onChange={(e) => setUsername(e.target.value)}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            {/*<Form.Label>비밀번호</Form.Label>*/}
                            <Form.Control type="password" placeholder="🔒 비밀번호를 입력해주세요"
                                          onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>비밀번호를 한번 더 입력해주세요</Form.Label>
                            <Form.Control type="password" placeholder="🔒 비밀번호를 입력해주세요"
                                          onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>


                        {/*<input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="username"
                            placeholder="사용자이름"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />*/}
                        <div className="d-grid gap-2">


                            <Button
                                variant="primary"
                                style={{backgroundColor: "6c757d", fontWeight: "600"}}
                                onClick={signUpWithEmailPassword}>
                                이메일/비밀번호로 가입하기
                            </Button>

                            <span className="likebutton" onClick={()=>{setNewUser(false)}}>
                            <Form.Text className="text-muted">
                                <b>이미 가입한 계정이</b> 있으신가요?
                            </Form.Text>
                                </span>

                            <span className="likebutton" onClick={signInWithGoogle}>
                            <Form.Text className="text-muted">
                                <b>Google</b> 계정을 이용하여 로그인하고 싶으신가요?
                            </Form.Text>
                                </span>



                        </div>

                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>

                </div>
            )
        }

        return (
            <Container>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />


                <Row>
                    <div className="loading_box">
                        마음챙김 다이어리를 이용하기 위해<br/><b>로그인이 필요합니다</b> 🔒
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
                            <Form.Control type="password" placeholder="🔒 비밀번호를 입력해주세요"
                                          onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>


                        {/*<input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="username"
                            placeholder="사용자이름"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />*/}
                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={signInWithEmailPassword}>
                                이메일/비밀번호로 로그인하기
                            </Button>



                            {/*<Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={signInWithGoogle}>
                                Google 계정으로 로그인하기
                            </Button>*/}

                            <Button
                                variant="dark"
                                style={{backgroundColor: "6c757d", fontWeight: "600"}}
                                onClick={()=>{
                                    setNewUser(true)
                                }}>
                                새로운 계정 만들기
                            </Button>

                            <span className="likebutton" onClick={signInWithGoogle}>
                            <Form.Text className="text-muted">
                                <b>Google</b> 계정을 이용하여 로그인하고 싶으신가요?
                            </Form.Text>
                                </span>




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
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />


                <Row>
                    <div className="loading_box">
                        마음챙김 다이어리를 이용하기 위해<br/><b>로그인이 필요합니다</b> 🔒
                    </div>
                </Row>
                <Row>
                    <Col>

                        <div className="d-grid gap-2">


                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={signInWithGoogle}>
                                Google 계정으로 로그인하기
                            </Button>

                            <Button
                                variant="primary"
                                style={{backgroundColor: "007AFF", fontWeight: "600"}}
                                onClick={() => {
                                    setEmaillognin(true)
                                }}>
                                이메일/비밀번호로 로그인하기
                            </Button>

                           {/* <Button
                                variant="secondary"
                                style={{backgroundColor: "6c757d", fontWeight: "600"}}
                                onClick={() => {
                                    setModalShow(true)
                                }}>
                                이메일/비밀번호로 가입하기
                            </Button>*/}
                        </div>

                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>
        )

    }


}
export default Auth;
