import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import {Routes, Route, Link, useNavigate, Outlet} from 'react-router-dom'
import Calendar from "./Calendar";

// 구글파이어베이스 관련
import Auth from './pages/Auth'
import Cookies from 'universal-cookie'
import {signOut} from 'firebase/auth'
import {auth, db, provider} from './firebase-config'

import Writing from "./pages/Writing"
import Loading from "./pages/Loading"
import DiaryList from "./pages/DiaryList"
import Home from "./pages/Home"
import {collection, doc, getCountFromServer, getDoc} from "firebase/firestore";


const cookies = new Cookies()


function App() {

    const conversationsRef = collection(db, "conversations")

    let navigate = useNavigate()
    //prompt
    let [homeReady, setHomeReady] = useState(false)
    //global_user-system conversation
    let [conversation, setConversation] = useState('')

    //firebase setting
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
    const [userName, setUserName] = useState('')
    const [diaryCount, setDiaryCount] = useState(null)
    const lastDiary = useRef(null)

    // const [room, setRoom] = useState(null)
    // const roomInputRef = useRef(null)
    async function settingName() {
        const docRef = doc(db, 'prompt', 'module1_1');
        const docSnap = await getDoc(docRef);
        var user = await (auth.currentUser.displayName)
        setUserName(user)
        /*const coll = collection(db, "session", userName, "diary_complete")
        const existingSession = await getCountFromServer(coll)
        const diaryNum = (existingSession.data().count + 1)
        setDiaryCount(String(diaryNum))*/
    }

    useEffect(() => {
        settingName()
    })

    const signUserOut = async () => {
        await signOut(auth)
        cookies.remove("auth-token")
        setIsAuth(false)
        // setRoom(null)
    }


    return (
        <div className="App">
            <div>
                <div>
                    <Navbar bg="light" variant="light">
                        <Container>
                            <Navbar.Brand onClick={() => {
                                navigate('/')
                            }}>
                                <Stack gap={0}>
                                    <div className="nav_title_black">마음챙김</div>
                                    <div className="nav_title_blue">다이어리</div>
                                </Stack>
                            </Navbar.Brand>
                            <Nav className="me-auto">
                                <Nav.Link onClick={() => {
                                    navigate('/writing')
                                }}>일기 작성하기</Nav.Link>
                                <Nav.Link onClick={() => {
                                    navigate('/list')
                                }}>일기 돌아보기</Nav.Link>
                                {isAuth ? (<Nav.Link onClick={signUserOut}>로그아웃</Nav.Link>) : (null)}
                            </Nav>
                            <Nav>
                                {/*<Nav.Link>오늘 날짜<Calendar/></Nav.Link>*/}
                            </Nav>
                        </Container>
                    </Navbar>
                </div>
                <Routes>
                    <Route path="/" element={
                        <div>
                            {isAuth ? (<Home userName={userName} diaryCount={diaryCount}/>) : (
                                <Auth setIsAuth={setIsAuth} setUserName={setUserName}/>)}
                        </div>
                    }/>
                    <Route path="/writing"
                           element={isAuth ? (<div><Writing userName={userName}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName}/>)
                           }/>
                    <Route path="/list" element={isAuth ? (<div><DiaryList userName={userName}/></div>) : (
                        <Auth setIsAuth={setIsAuth} setUserName={setUserName}/>)}/>
                    <Route path="/loading" element={<div><Loading/></div>}/>
                    <Route path="*" element={<div>404~ 없는페이지임</div>}/>
                </Routes>



            </div>
            {/*<div className="footer">
                    <Navbar bg="light" variant="light">
                        <Container>
                            <div>📨 문의사항은 taewan@kaist.ac.kr로 연락주세요.</div>
                            <div>Copyright ©Taewan Kim</div>
                        </Container>
                    </Navbar>
                </div>*/}
        </div>
    );
}

export default App;
