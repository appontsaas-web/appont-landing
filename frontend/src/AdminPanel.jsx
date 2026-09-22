import React, { useState } from 'react';
import './Dashboard.css';

export default function AdminPanel({ token, onLogout }) {
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [timeline, setTimeline] = useState('');
  const [team, setTeam] = useState('');
  const [autoEmail, setAutoEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/.netlify/functions/admin-create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          client_email: clientEmail,
          name: projectName,
          description,
          cost: parseInt(cost),
          timeline,
          team: team.split(',').map(t => t.trim()),
          auto_email: autoEmail
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Project created successfully!');
        setClientEmail('');
        setProjectName('');
        setDescription('');
        setCost('');
        setTimeline('');
        setTeam('');
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Panel</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '16px',
          padding: '30px'
        }}>
          <h2 style={{ marginTop: 0 }}>Create Project</h2>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="email"
              placeholder="Client Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px'
              }}
            />
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px'
              }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                minHeight: '80px'
              }}
            />
            <input
              type="number"
              placeholder="Cost ($)"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px'
              }}
            />
            <input
              type="text"
              placeholder="Timeline (e.g., 3 months)"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px'
              }}
            />
            <input
              type="text"
              placeholder="Team (comma-separated)"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px'
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoEmail}
                onChange={(e) => setAutoEmail(e.target.checked)}
              />
              <span>Auto-create user if not found</span>
            </label>
            {message && <div style={{ color: message.includes('✅') ? '#10b981' : '#ef4444' }}>{message}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
