import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from 'components/Header';
import Dashboard from 'pages/dashboard/Dashboard';
import Main from 'pages/Main';
import PatientsList from 'pages/patientsList/PatientsList';

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
