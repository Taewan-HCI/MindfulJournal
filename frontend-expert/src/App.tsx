import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Main from './pages/Main';
import PatientsList from './pages/PatientsList';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/paitients" element={<PatientsList />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
