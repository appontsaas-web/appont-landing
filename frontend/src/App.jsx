import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import LandingPage from './LandingPage';
import './LandingPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ name: '', email: '', password: '', isAdmin: false });
  
  const [projectForm, setProjectForm] = useState({ projectTitle: '', requirements: '', clientName: '', clientEmail: '' });
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (token) {
      loadUserData();
      loadProjects();
    }
  }, [token, loadUserData, loadProjects]);

  const loadUserData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('User data:', data);
      setUser(data);
      setShowAuthForm(false);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, [token]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Projects:', data);
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, [token]);

  const loadProjectDetail = async (projectId) => {
    try {
      console.log('Loading project:', projectId);
      const res = await fetch(`${API_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('Error response:', res.status, res.statusText);
        alert('Error loading project: ' + res.statusText);
        return;
      }
      const data = await res.json();
      console.log('Project detail:', data);
      setSelectedProject(data);
      setCurrentProjectId(projectId);
      setShowProjectDetail(true);
      loadConversation(projectId);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Error loading project details: ' + error.message);
    }
  };

  const loadConversation = async (projectId) => {
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/conversation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setChatMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setShowAuthForm(false);
        setAuthData({ name: '', email: '', password: '', isAdmin: false });
      } else {
        alert('Error: ' + (data.error || 'Auth failed'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Error with authentication: ' + error.message);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        projectTitle: projectForm.projectTitle,
        requirements: projectForm.requirements,
        clientName: projectForm.clientName || 'Anonymous',
        clientEmail: projectForm.clientEmail || 'noemail@appont.dev'
      };
      
      const res = await fetch(`${API_URL}/projects/create-from-requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data._id) {
        setCurrentProjectId(data._id);
        setProjects([data, ...projects]);
        setChatMessages([]);
        setProjectForm({ projectTitle: '', requirements: '', clientName: '', clientEmail: '' });
        alert('Project created! Now let\'s chat with AI about your solution.');
      } else {
        alert('Error: ' + (data.error || 'Failed to create project'));
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !currentProjectId) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages([...chatMessages, { role: 'user', content: userMessage }]);
    setLoadingChat(true);

    try {
      const res = await fetch(`${API_URL}/projects/${currentProjectId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      if (data.message) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleGenerateSolution = async (projectId) => {
    if (!window.confirm('Generate AI solution for this project?')) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/generate-solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data._id) {
        setSelectedProject(data);
        alert('✅ Solution generated!');
        loadProjects();
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating solution: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveSolution = async (projectId) => {
    if (!window.confirm('Approve this solution?')) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/approve-solution`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data._id) {
        setSelectedProject(data);
        alert('✅ Solution approved!');
        loadProjects();
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error approving solution: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateProposal = async (projectId) => {
    if (!window.confirm('Generate formal proposal?')) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/generate-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data._id) {
        setSelectedProject(data);
        alert('✅ Proposal generated!');
        loadProjects();
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating proposal: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveProposal = async (projectId) => {
    if (!window.confirm('Approve this proposal?')) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/approve-proposal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data._id) {
        setSelectedProject(data);
        alert('✅ Proposal approved!');
        loadProjects();
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error approving proposal: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInvoice = async (projectId, proposalId) => {
    if (!window.confirm('Generate invoice?')) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/proposals/${proposalId}/generate-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data._id) {
        setSelectedProject(data);
        alert('✅ Invoice generated!');
        loadProjects();
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating invoice: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveInvoice = async (invoiceId) => {
    if (!window.confirm('Approve and pay invoice?')) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/invoices/${invoiceId}/approve-and-send`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data._id) {
        setSelectedProject(data);
        alert('✅ Invoice approved!');
        loadProjects();
      } else {
        alert('Error: ' + (data.error || 'Failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error approving invoice: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setShowAuthForm(false);
    setProjects([]);
  };

  if (token && !user) {
    return <div className="loading">Loading...</div>;
  }

  if (showAuthForm) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={handleAuth}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your name" value={authData.name} onChange={(e) => setAuthData({ ...authData, name: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} required />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label><input type="checkbox" checked={authData.isAdmin} onChange={(e) => setAuthData({ ...authData, isAdmin: e.target.checked })} /> I'm a Developer (Admin)</label>
              </div>
            )}
            <button type="submit" className="btn btn-success">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <p>{isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#004aad', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!token && !showAuthForm) {
    return <LandingPage onGetStarted={() => setShowAuthForm(true)} />;
  }

  const statusText = selectedProject?.status ? selectedProject.status.replace(/_/g, ' ') : 'unknown';

  return (
    <div className="app">
      <header className="header">
        <div className="header-left"><h1>📄 appont</h1></div>
        <div className="header-right">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard">
        {user?.role === "admin" && (
          <div className="admin-nav">
            <button className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>📊 Dashboard</button>
            <button className={`nav-btn ${currentPage === 'projects' ? 'active' : ''}`} onClick={() => setCurrentPage('projects')}>📋 All Projects</button>
          </div>
        )}

        {!user?.role === "admin" && (
          <div className="admin-nav">
            <button className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>📊 My Projects</button>
            <button className={`nav-btn ${currentPage === 'new-project' ? 'active' : ''}`} onClick={() => setCurrentPage('new-project')}>✨ New Project</button>
          </div>
        )}

        {!user?.role === "admin" && currentPage === 'new-project' && (
          <section className="admin-section">
            <h2>✨ Start a New Project</h2>
            <form onSubmit={handleCreateProject} className="project-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input type="text" placeholder="E-commerce Website, Mobile App, etc." value={projectForm.projectTitle} onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Your Name (Optional)</label>
                <input type="text" placeholder="Your name" value={projectForm.clientName} onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Your Email (Optional)</label>
                <input type="email" placeholder="your@email.com" value={projectForm.clientEmail} onChange={(e) => setProjectForm({ ...projectForm, clientEmail: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Project Requirements *</label>
                <textarea placeholder="Describe what you want to build..." value={projectForm.requirements} onChange={(e) => setProjectForm({ ...projectForm, requirements: e.target.value })} style={{ minHeight: '200px' }} required />
              </div>
              <button type="submit" className="btn btn-success">🚀 Create Project</button>
            </form>
          </section>
        )}

        {currentPage === 'dashboard' && (
          <section className="admin-section">
            <h2>📊 {user?.role === "admin" ? 'All Projects' : 'My Projects'}</h2>
            {projects.length > 0 ? (
              <table className="projects-table">
                <thead>
                  <tr><th>Project</th><th>Status</th><th>Client</th><th>Cost</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id}>
                      <td>{project.projectTitle}</td>
                      <td><span className={`status status-${project.status || 'unknown'}`}>{(project.status || 'unknown').replace(/_/g, ' ')}</span></td>
                      <td>{project.clientName}</td>
                      <td>${project.proposalId?.totalCost || project.solutionId?.totalEstimatedCost || '-'}</td>
                      <td><button className="btn btn-sm btn-info" onClick={() => loadProjectDetail(project._id)}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No projects yet. {!user?.role === "admin" && 'Create one!'}</p>
            )}
          </section>
        )}

        {showProjectDetail && selectedProject && (
          <div className="modal-overlay" onClick={() => setShowProjectDetail(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto', maxWidth: '900px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{selectedProject.projectTitle}</h3>
                <button className="btn btn-secondary" onClick={() => setShowProjectDetail(false)}>✕</button>
              </div>

              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <p><strong>Status:</strong> <span className={`status status-${selectedProject.status || 'unknown'}`}>{statusText}</span></p>
                <p><strong>Created:</strong> {selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>

              <h4>Project Requirements</h4>
              <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{selectedProject.clientRequirements || 'N/A'}</p>

              {user?.role === "admin" && selectedProject.status === 'requirements_submitted' && (
                <button className="btn btn-success" onClick={() => handleGenerateSolution(selectedProject._id)} disabled={isGenerating} style={{ marginBottom: '20px' }}>
                  {isGenerating ? '⏳ Generating...' : '🤖 Generate AI Solution'}
                </button>
              )}

              {selectedProject.solutionId && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <h4>🤖 AI Solution</h4>
                  <p><strong>Overview:</strong> {selectedProject.solutionId.overview}</p>
                  <p><strong>Platform:</strong> {selectedProject.solutionId.platformRecommendation?.platform}</p>
                  <p><strong>Estimated Cost:</strong> ${selectedProject.solutionId.totalEstimatedCost}</p>
                  <p><strong>Timeline:</strong> {selectedProject.solutionId.timeline}</p>
                  {!user?.role === "admin" && selectedProject.status === 'solution_generated' && (
                    <button className="btn btn-success" onClick={() => handleApproveSolution(selectedProject._id)} disabled={isGenerating} style={{ marginTop: '10px' }}>
                      {isGenerating ? '⏳ Approving...' : '✅ Approve Solution'}
                    </button>
                  )}
                </div>
              )}

              {user?.role === "admin" && selectedProject.status === 'solution_approved' && (
                <button className="btn btn-success" onClick={() => handleGenerateProposal(selectedProject._id)} disabled={isGenerating} style={{ marginBottom: '20px' }}>
                  {isGenerating ? '⏳ Generating...' : '📝 Generate Proposal'}
                </button>
              )}

              {selectedProject.proposalId && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <h4>📝 Formal Proposal</h4>
                  <p><strong>Total Cost:</strong> ${selectedProject.proposalId.totalCost}</p>
                  <p><strong>Payment Terms:</strong> {selectedProject.proposalId.paymentTerms}</p>
                  {!user?.role === "admin" && selectedProject.status === 'proposal_generated' && (
                    <button className="btn btn-success" onClick={() => handleApproveProposal(selectedProject._id)} disabled={isGenerating} style={{ marginTop: '10px' }}>
                      {isGenerating ? '⏳ Approving..' : '✅ Approve Proposal'}
                    </button>
                  )}
                </div>
              )}

              {user?.role === "admin" && selectedProject.status === 'proposal_approved' && selectedProject.proposalId && (
                <button className="btn btn-success" onClick={() => handleGenerateInvoice(selectedProject._id, selectedProject.proposalId._id)} disabled={isGenerating} style={{ marginBottom: '20px' }}>
                  {isGenerating ? '⏳ Generating...' : '💳 Generate Invoice'}
                </button>
              )}

              {selectedProject.invoiceId && (
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <h4>💳 Invoice</h4>
                  <p><strong>Amount:</strong> ${selectedProject.invoiceId.totalAmount}</p>
                  <p><strong>Due:</strong> {selectedProject.invoiceId.dueDate ? new Date(selectedProject.invoiceId.dueDate).toLocaleDateString() : 'N/A'}</p>
                  {!user?.role === "admin" && selectedProject.status === 'invoice_generated' && (
                    <button className="btn btn-success" onClick={() => handleApproveInvoice(selectedProject.invoiceId._id)} disabled={isGenerating} style={{ marginTop: '10px' }}>
                      {isGenerating ? '⏳ Processing...' : '✅ Approve & Pay'}
                    </button>
                  )}
                </div>
              )}

              <h4 style={{ marginTop: '30px' }}>💬 Chat History</h4>
              <div className="chat-display" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`} style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5' }}>
                    <div className="message-content"><strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}</div>
                  </div>
                ))}
              </div>

              {selectedProject.status === 'requirements_submitted' && currentProjectId === selectedProject._id && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <input type="text" placeholder="Ask AI..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <button onClick={handleSendMessage} disabled={loadingChat} className="btn btn-primary">{loadingChat ? 'Sending...' : 'Send'}</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
