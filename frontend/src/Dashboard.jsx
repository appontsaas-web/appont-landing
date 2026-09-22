import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import './Dashboard.css';

export default function Dashboard({ token, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
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
    fetchProjects();
  }, [token]);

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Client Portal</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="projects-list">
          <h2>Your Projects</h2>
          {projects.map((proj) => (
            <div
              key={proj._id}
              className={`project-card ${selectedProject?._id === proj._id ? 'active' : ''}`}
              onClick={() => setSelectedProject(proj)}
            >
              <h3>{proj.name}</h3>
              <p>${proj.budget}</p>
            </div>
          ))}
        </div>

        <div className="project-detail">
          {selectedProject ? (
            <>
              <h2>{selectedProject.name}</h2>
              <p><strong>Budget:</strong> ${selectedProject.budget}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Timeline:</strong> {selectedProject.timeline}</p>

              <div className="project-info">
                <div className="info-block">
                  <h3>Description</h3>
                  <p>{selectedProject.description}</p>
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
