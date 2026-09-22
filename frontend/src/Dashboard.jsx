import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import './Dashboard.css';

export default function Dashboard({ token, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/.netlify/functions/get-projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) setSelectedProject(data[0]);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'planning': return '#6366f1';
      case 'paused': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Client Portal</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="projects-section">
          <h2>Your Projects</h2>
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p>No projects yet</p>
          ) : (
            <div className="projects-grid">
              {projects.map((proj) => (
                <div
                  key={proj._id}
                  className={`project-card ${selectedProject?._id === proj._id ? 'active' : ''}`}
                  onClick={() => setSelectedProject(proj)}
                >
                  <div className="project-header">
                    <h3>{proj.name}</h3>
                    <span className="status" style={{ backgroundColor: getStatusColor(proj.status) }}>
                      {proj.status}
                    </span>
                  </div>
                  <p className="project-desc">{proj.description}</p>
                  <div className="project-meta">
                    <span>${proj.cost}</span>
                    <span>{proj.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="details-section">
          {selectedProject ? (
            <>
              <div className="project-details">
                <h2>{selectedProject.name}</h2>
                <p>{selectedProject.description}</p>
                <div className="meta-grid">
                  <div className="meta-item">
                    <span className="label">Status</span>
                    <span className="value">{selectedProject.status}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Cost</span>
                    <span className="value">${selectedProject.cost}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Timeline</span>
                    <span className="value">{selectedProject.timeline}</span>
                  </div>
                </div>

                {selectedProject.invoices && selectedProject.invoices.length > 0 && (
                  <div className="invoices">
                    <h3>Invoices</h3>
                    <div className="invoice-list">
                      {selectedProject.invoices.map((inv) => (
                        <div key={inv._id} className="invoice-item">
                          <span className="amount">${inv.amount}</span>
                          <span className={`status ${inv.status}`}>{inv.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ChatWidget token={token} projectId={selectedProject._id} />
            </>
          ) : (
            <p>Select a project to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}
