import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Header from 'components/Header';
import Dashboard from 'pages/dashboard/Dashboard';
import Main from 'pages/Main';
import PatientsList from 'pages/patientsList/PatientsList';

function App() {
  const token = localStorage.getItem('accessToken');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(token !== null);
  useEffect(() => {}, [token]);

  const signOut = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(() => false);
    toast.success('로그아웃 되었습니다.');
  };

  const signIn = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setIsLoggedIn(() => true);
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} signOut={signOut} />
      <ToastContainer />
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/*" element={<PatientsList />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
          </>
        ) : (
          <Route path="/*" element={<Main signIn={signIn} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
