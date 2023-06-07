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
import DiaryGuide from "./pages/DiaryGuide";
import DiaryGuide2 from "./pages/DiaryGuide2";
import DiaryGuide3 from "./pages/DiaryGuide3";
import DiaryGuide4 from "./pages/DiaryGuide4";
import Home from "./pages/Home";
import {collection, doc, getDoc} from "firebase/firestore";

const cookies = new Cookies();

function App() {

    let navigate = useNavigate()

    //firebase setting
    const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
    const [userName, setUserName] = useState('')
    const [userMail, setUserMail] = useState('')
    const [diaryCount, setDiaryCount] = useState(null)
    const current = new Date();
    const date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;

    async function settingName() {
        const docRef = doc(db, 'prompt', 'module1_1');
        const docSnap = await getDoc(docRef);
        var user = await (auth.currentUser.displayName)
        var mail = await (auth.currentUser.email)
        setUserName(user)
        setUserMail(mail)
    }

    useEffect(() => {
        settingName()
    })

    const signUserOut = async () => {
        await signOut(auth)
        cookies.remove("auth-token")
        setIsAuth(false)
    }

    const [expanded, setExpanded] = useState(false);


    return (


        <div className="App">
            <div>
                <div>
                    <Navbar collapseOnSelect expand="sm" bg="light" variant="light" expanded={expanded}>
                        <Container>
                            <Navbar.Brand
                                onClick={() => {
                                    navigate('/');
                                    setExpanded(false);
                                }}
                            >
                                <Stack gap={0}>
                                    <div className="nav_title_black">마음챙김</div>
                                    <div className="nav_title_blue">다이어리</div>
                                </Stack>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav"
                                           onClick={() => setExpanded(!expanded)}/>
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link
                                        onClick={() => {
                                            navigate('/');
                                            setExpanded(false);
                                        }}
                                    >
                                        <div className="nav_title_black">홈</div>
                                    </Nav.Link>
                                    <Nav.Link
                                        onClick={() => {
                                            navigate('/writing');
                                            setExpanded(false);
                                        }}
                                    >
                                        <div className="nav_title_black">작성하기</div>
                                    </Nav.Link>
                                    <Nav.Link
                                        onClick={() => {
                                            navigate('/list');
                                            setExpanded(false);
                                        }}
                                    >
                                        <div className="nav_title_black">돌아보기</div>
                                    </Nav.Link>
                                    {isAuth ? (
                                        <Nav.Link
                                            onClick={() => {
                                                signUserOut();
                                                setExpanded(false);
                                            }}
                                        >
                                            <div className="nav_title_black">로그아웃</div>
                                        </Nav.Link>
                                    ) : null}
                                </Nav>
                                <Nav>
                                    <Stack gap={0}>
                                        <div className="nav_title_blue">
                                            <b>GPT-User Direct Mode</b>
                                        </div>
                                        <div className="nav_title_black">{date}</div>
                                    </Stack>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
                <Routes>
                    <Route path="/" element={
                        <div>
                            {isAuth ? (<Home userName={userName} userMail={userMail} diaryCount={diaryCount}/>) : (
                                <Auth setIsAuth={setIsAuth} setUserName={setUserName}/>)}
                        </div>
                    }/>
                    <Route path="/writing"
                           element={isAuth ? (<div><Writing userName={userName} userMail={userMail}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName} setUserMail={setUserMail}/>)
                           }/>
                    <Route path="/list"
                           element={isAuth ? (<div><DiaryList userName={userName} userMail={userMail}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName} setUserMail={setUserMail}/>)}/>

                    <Route path="/guide"
                           element={isAuth ? (<div><DiaryGuide userName={userName} userMail={userMail}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName} setUserMail={setUserMail}/>)}/>

                    <Route path="/guide2"
                           element={isAuth ? (<div><DiaryGuide2 userName={userName} userMail={userMail}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName} setUserMail={setUserMail}/>)}/>

                    <Route path="/guide3"
                           element={isAuth ? (<div><DiaryGuide3 userName={userName} userMail={userMail}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName} setUserMail={setUserMail}/>)}/>

                    <Route path="/guide4"
                           element={isAuth ? (<div><DiaryGuide4 userName={userName} userMail={userMail}/></div>) : (
                               <Auth setIsAuth={setIsAuth} setUserName={setUserName} setUserMail={setUserMail}/>)}/>

                    <Route path="/loading" element={<div><Loading/></div>}/>
                    <Route path="*" element={<div>404~ 없는페이지임</div>}/>
                </Routes>
            </div>

        </div>
    );
}

export default App;
