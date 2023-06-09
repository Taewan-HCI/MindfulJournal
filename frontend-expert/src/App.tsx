import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
<<<<<<< HEAD
import { ToastContainer } from 'react-toastify';
import Header from 'components/Header';
import Dashboard from 'pages/dashboard/Dashboard';
import Main from 'pages/Main';
import PatientsList from 'pages/patientsList/PatientsList';
=======
import Header from './components/Header';
import Dashboard from './pages/dashboard/Dashboard';
import Main from './pages/Main';
import PatientsList from './pages/PatientsList';
>>>>>>> 7c25c1d04730ed9e085883186fdfeeff96e4e455

function App() {
  return (
    <Router>
      <Header />
<<<<<<< HEAD
      <ToastContainer />
=======
>>>>>>> 7c25c1d04730ed9e085883186fdfeeff96e4e455
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
