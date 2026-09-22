import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import PortalApp from './PortalApp';
import './LandingPage.css';

function MainApp() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token && !showAuthForm) {
    return <LandingPage onGetStarted={() => setShowAuthForm(true)} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📄 appont</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <p>Main dashboard</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/portal/*" element={<PortalApp />} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
