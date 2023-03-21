import {auth, provider} from "../firebase-config"
import {signInWithPopup} from 'firebase/auth'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie'
import Button from "react-bootstrap/Button";
import {React} from "react";

const cookies = new Cookies()

export const Auth = (props) => {

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

    return (
        <Container>
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
                    </div>
                </Col>
                <Col>

                </Col>


            </Row>


        </Container>
    )
}
export default Auth;

