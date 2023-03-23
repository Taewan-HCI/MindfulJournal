import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Main from './pages/Main';
import PatientsList from './pages/PatientsList';

function App() {
  return (
    <>
      <header className="App-header" />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/paitients" element={<PatientsList />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
