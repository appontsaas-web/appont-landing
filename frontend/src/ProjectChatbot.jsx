import React, { useState } from 'react';
import './ProjectChatbot.css';

const ProjectChatbot = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');
  const [formData, setFormData] = useState({
    projectType: '',
    description: '',
    targetAudience: '',
    techStack: '',
    budget: '',
    timeline: '',
    teamSize: '',
    features: '',
    integrations: '',
    support: '',
    industry: '',
    email: '',
  });

  const questions = [
    { id: 'projectType', label: 'What type of project do you need?', placeholder: 'E.g., Web App, Mobile App, AI Solution, Website, SaaS' },
    { id: 'description', label: 'Describe your project in detail', placeholder: 'What problem does it solve? What makes it unique?' },
    { id: 'targetAudience', label: 'Who is your target audience?', placeholder: 'E.g., Small businesses, Enterprise, Consumers, etc.' },
    { id: 'techStack', label: 'Do you have tech preferences?', placeholder: 'E.g., React, Node.js, Python, or "No preference"' },
    { id: 'teamSize', label: 'What\'s your current team size?', placeholder: 'E.g., Solo founder, 2-5 people, 5+ people' },
    { id: 'features', label: 'What are the key features needed?', placeholder: 'E.g., User authentication, Payment processing, Analytics, AI/ML' },
    { id: 'integrations', label: 'What integrations do you need?', placeholder: 'E.g., Stripe, Zapier, CRM, or "None"' },
    { id: 'industry', label: 'What industry is this for?', placeholder: 'E.g., FinTech, HealthTech, E-commerce, SaaS' },
    { id: 'budget', label: 'What\'s your budget range?', placeholder: 'E.g., $5K-$10K, $10K-$50K, $50K+' },
    { id: 'timeline', label: 'What\'s your target timeline?', placeholder: 'E.g., 1-2 weeks, 1 month, 2-3 months, 3+ months' },
    { id: 'support', label: 'What ongoing support do you need?', placeholder: 'E.g., 30-day support, 3 months, 6 months, Annual' },
    { id: 'email', label: 'What\'s your email?', placeholder: 'your@email.com', type: 'email' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [questions[step].id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (!formData[questions[step].id]) {
      alert('Please answer this question');
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateSolution();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const generateSolution = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setSolution(data.solution);
    } catch (error) {
      setSolution('Error generating proposal. Please try again.');
    }
    setLoading(false);
  };

  const submitSolution = async () => {
    setLoading(true);
    try {
      await fetch('/api/send-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, solution }),
      });
      alert('Proposal sent to ' + formData.email);
      resetChat();
    } catch (error) {
      alert('Error sending proposal. Please try again.');
    }
    setLoading(false);
  };

  const resetChat = () => {
    setStep(0);
    setSolution('');
    setFormData({
      projectType: '',
      description: '',
      targetAudience: '',
      techStack: '',
      budget: '',
      timeline: '',
      teamSize: '',
      features: '',
      integrations: '',
      support: '',
      industry: '',
      email: '',
    });
  };

  if (solution) {
    return (
      <div className="chatbot-container">
        <div className="solution-view">
          <div className="solution-header">
            <h2>✨ Your Custom Proposal</h2>
            <p>Tailored for your project needs</p>
          </div>
          <div className="solution-content">
            {solution.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="solution-actions">
            <button className="btn-primary" onClick={submitSolution} disabled={loading}>
              {loading ? 'Sending...' : '📧 Send to Email'}
            </button>
            <button className="btn-secondary" onClick={resetChat}>
              ← Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chatbot-container">
        <div className="loading">
          <div className="loader"></div>
          <p>Generating your proposal...</p>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / questions.length) * 100;
  const currentQuestion = questions[step];

  return (
    <div className="chatbot-container">
      <div className="chatbot">
        <div className="chatbot-header">
          <div className="header-content">
            <h2>🚀 Project Inquiry</h2>
            <p>Step {step + 1} of {questions.length}</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="chatbot-body">
          <div className="question">
            <label>{currentQuestion.label}</label>
            <input
              type={currentQuestion.type || 'text'}
              placeholder={currentQuestion.placeholder}
              value={formData[currentQuestion.id]}
              onChange={handleChange}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            />
          </div>
        </div>

        <div className="chatbot-footer">
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={step === 0}
          >
            ← Previous
          </button>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!formData[currentQuestion.id]}
          >
            {step === questions.length - 1 ? 'Generate Proposal ✨' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectChatbot;
