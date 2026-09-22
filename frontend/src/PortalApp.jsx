import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';

export default function PortalApp() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const stored = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (stored) {
      setToken(stored);
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setToken(token);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  if (role === 'admin') {
    return <AdminPanel token={token} onLogout={handleLogout} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
