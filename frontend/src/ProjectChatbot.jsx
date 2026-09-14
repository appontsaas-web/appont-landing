import React, { useState } from 'react';
import './ProjectChatbot.css';

export default function ProjectChatbot() {
  const [step, setStep] = useState(0); // 0=start, 1=type, 2=description, 3=budget, 4=timeline, 5=email, 6=solution, 7=complete
  const [formData, setFormData] = useState({
    projectType: '',
    description: '',
    budget: '',
    timeline: '',
    email: ''
  });
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const projectTypes = [
    'Web Application',
    'Mobile App',
    'AI Solution',
    'Design System',
    'Shopify Store',
    'WordPress Site',
    'Custom Software',
    'Other'
  ];

  const budgetRanges = [
    '$5K - $10K',
    '$10K - $25K',
    '$25K - $50K',
    '$50K - $100K',
    '$100K+'
  ];

  const timelineOptions = [
    '1 Month',
    '2-3 Months',
    '3-6 Months',
    '6+ Months',
    'Flexible'
  ];

  const handleProjectType = (type) => {
    setFormData(prev => ({ ...prev, projectType: type }));
    setStep(2);
  };

  const handleDescriptionSubmit = () => {
    if (formData.description.trim().length < 10) {
      setError('Please provide more details about your project');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleBudget = (budget) => {
    setFormData(prev => ({ ...prev, budget }));
    setStep(4);
  };

  const handleTimeline = (timeline) => {
    setFormData(prev => ({ ...prev, timeline }));
    setStep(5);
  };

  const handleEmailSubmit = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    generateSolution();
  };

  const generateSolution = async () => {
    setLoading(true);
    setStep(6);
    setSolution('');

    try {
      const response = await fetch('/api/generate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setStep(5);
      } else {
        setSolution(data.solution);
        setStep(7);
      }
    } catch (err) {
      setError('Failed to generate solution. Please try again.');
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSolution = async () => {
    setLoading(true);
    setSubmitted(true);

    try {
      const response = await fetch('/api/send-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          solution
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError('Failed to send solution. Please try again.');
        setSubmitted(false);
      }
    } catch (err) {
      setError('Failed to send solution. Please try again.');
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setFormData({ projectType: '', description: '', budget: '', timeline: '', email: '' });
    setSolution('');
    setError('');
    setSubmitted(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-card">
        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div className="chatbot-step">
            <h2>Let's Build Something Amazing 🚀</h2>
            <p>Answer a few quick questions and our AI will generate a custom solution for your project.</p>
            <button onClick={() => setStep(1)} className="chatbot-btn-primary">
              Start →
            </button>
          </div>
        )}

        {/* STEP 1: Project Type */}
        {step === 1 && (
          <div className="chatbot-step">
            <h3>What are you building?</h3>
            <div className="options-grid">
              {projectTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleProjectType(type)}
                  className="option-btn"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Description */}
        {step === 2 && (
          <div className="chatbot-step">
            <h3>Tell us about your project</h3>
            <p className="step-subtitle">What problems does it solve? What makes it unique?</p>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project, goals, and requirements..."
              rows="6"
              className="chatbot-textarea"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <button onClick={() => setStep(1)} className="chatbot-btn-secondary">
                ← Back
              </button>
              <button onClick={handleDescriptionSubmit} className="chatbot-btn-primary">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Budget */}
        {step === 3 && (
          <div className="chatbot-step">
            <h3>What's your budget?</h3>
            <div className="options-grid">
              {budgetRanges.map(budget => (
                <button
                  key={budget}
                  onClick={() => handleBudget(budget)}
                  className="option-btn"
                >
                  {budget}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="chatbot-btn-secondary">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 4: Timeline */}
        {step === 4 && (
          <div className="chatbot-step">
            <h3>When do you need it?</h3>
            <div className="options-grid">
              {timelineOptions.map(timeline => (
                <button
                  key={timeline}
                  onClick={() => handleTimeline(timeline)}
                  className="option-btn"
                >
                  {timeline}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="chatbot-btn-secondary">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 5: Email */}
        {step === 5 && (
          <div className="chatbot-step">
            <h3>What's your email?</h3>
            <p className="step-subtitle">We'll send you the solution here</p>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className="chatbot-input"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <button onClick={() => setStep(4)} className="chatbot-btn-secondary">
                ← Back
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="chatbot-btn-primary"
              >
                {loading ? 'Generating...' : 'Generate Solution →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Loading Solution */}
        {step === 6 && (
          <div className="chatbot-step">
            <div className="loading">
              <div className="spinner"></div>
              <h3>Generating Your Custom Solution...</h3>
              <p>Our AI is analyzing your requirements and creating a tailored proposal.</p>
            </div>
          </div>
        )}

        {/* STEP 7: Solution Generated */}
        {step === 7 && (
          <div className="chatbot-step">
            <h3>✨ Your Custom Solution</h3>
            <div className="solution-box">
              <div className="solution-content">
                {solution.split('\n').map((line, i) => (
                  line.trim() && <p key={i}>{line}</p>
                ))}
              </div>
            </div>
            {submitted ? (
              <div className="success-message">
                <h4>✅ Solution Sent!</h4>
                <p>Check your email at {formData.email}</p>
                <button onClick={reset} className="chatbot-btn-primary">
                  Start Over →
                </button>
              </div>
            ) : (
              <div className="button-group">
                <button onClick={() => setStep(5)} className="chatbot-btn-secondary">
                  ← Back
                </button>
                <button
                  onClick={handleSubmitSolution}
                  disabled={loading}
                  className="chatbot-btn-primary"
                >
                  {loading ? 'Sending...' : 'Send This Solution →'}
                </button>
              </div>
            )}
          </div>
        )}

        {error && step !== 2 && step !== 5 && (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
}
