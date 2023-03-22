import './App.css';
import {useState, useEffect, useRef} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import {Routes, Route, useNavigate,} from 'react-router-dom';

import Auth from './pages/Auth';
import Cookies from 'universal-cookie';
import {signOut} from 'firebase/auth';
import {auth, db} from './firebase-config';

import Writing from "./pages/Writing";
import Loading from "./pages/Loading";
import DiaryList from "./pages/DiaryList";
import Home from "./pages/Home";
import {collection, doc, getDoc} from "firebase/firestore";

const cookies = new Cookies();

function App() {

    let navigate = useNavigate()

    //firebase setting
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
    const [userName, setUserName] = useState('')
    const [diaryCount, setDiaryCount] = useState(null)
    const dateOfLastDiary = useRef(null)
    const current = new Date();
    const date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;

    async function settingName() {
        const docRef = doc(db, 'prompt', 'module1_1');
        const docSnap = await getDoc(docRef);
        var user = await (auth.currentUser.displayName)
        setUserName(user)
    }

    useEffect(() => {
        settingName()
    })

    const signUserOut = async () => {
        await signOut(auth)
        cookies.remove("auth-token")
        setIsAuth(false)
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
                                    navigate('/')
                                }}><div className="nav_title_black">홈</div></Nav.Link>
                                <Nav.Link onClick={() => {
                                    navigate('/writing')
                                }}><div className="nav_title_black">세션 진행하기</div></Nav.Link>

                                {isAuth ? (<Nav.Link onClick={signUserOut}><div className="nav_title_black">로그아웃</div></Nav.Link>) : (null)}
                            </Nav>
                            <Nav>
                                <Stack gap={0}>
                                    <div className="nav_title_blue"><b>관리자용 화면입니다</b></div>
                                    <div className="nav_title_black">{date}</div>
                                </Stack>
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

        </div>
    );
}

export default App;
