import ProjectChatbot from './ProjectChatbot';
import React, { useState } from 'react';

export default function LandingPage({ onGetStarted }) {
  const [selectedCase, setSelectedCase] = useState(0);
  
  const caseStudies = [
    { company: 'RetailHub Inc', challenge: 'E-commerce rebuild', solution: 'React, Node.js, PostgreSQL, AWS', result: '250% increase in transactions', timeline: '8 weeks' },
    { company: 'CloudFlow Analytics', challenge: 'Analytics dashboard', solution: 'Next.js, Python, TimescaleDB', result: '150+ clients, 99.9% uptime', timeline: '12 weeks' },
    { company: 'FitLife', challenge: 'Mobile fitness app', solution: 'React Native, Firebase, ML', result: '50K+ downloads', timeline: '10 weeks' }
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-container header-content">
          <img src="/logo.png" alt="appont" className="logo-img" />
          <nav className="nav-links">
            <a href="#why">Why appont</a>
            <a href="#how">How It Works</a>
            <a href="#cases">Case Studies</a>
            <button className="nav-cta" onClick={onGetStarted}>Get Started</button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="landing-container">
          <div className="hero-content">
            <h1>Stop Guessing on Project Costs</h1>
            <p className="hero-subtitle">Get an AI-powered proposal that tells you exactly what your project needs, how long it takes, and what it costs—before you commit.</p>
            <button className="cta-primary cta-large" onClick={onGetStarted}>Get Your AI Proposal</button>
            <p className="hero-note">Free analysis. No credit card. 10 minutes.</p>
          </div>
        </div>
      </section>

      <section id="why" className="ai-advantage">
        <div className="landing-container">
          <h2>Why Companies Choose appont</h2>
          <div className="advantages-grid">
            <div className="advantage">
              <div className="advantage-icon">📊</div>
              <h3>Precise Analysis</h3>
              <p>Our AI understands your business needs and recommends the exact tech stack and approach.</p>
            </div>
            <div className="advantage">
              <div className="advantage-icon">✓</div>
              <h3>95% Accurate Estimates</h3>
              <p>Based on 500+ completed projects. No surprises. No hidden costs.</p>
            </div>
            <div className="advantage">
              <div className="advantage-icon">⚡</div>
              <h3>Instant Revisions</h3>
              <p>Change your requirements? AI recalculates your proposal in minutes.</p>
            </div>
            <div className="advantage">
              <div className="advantage-icon">🛡️</div>
              <h3>Protected Investment</h3>
              <p>The proposal becomes a binding contract. You know exactly what you're paying for.</p>
            </div>
            <div className="advantage">
              <div className="advantage-icon">🚀</div>
              <h3>Expert Recommendations</h3>
              <p>Get strategic advice on architecture, scalability, and best practices.</p>
            </div>
            <div className="advantage">
              <div className="advantage-icon">💎</div>
              <h3>Confidence</h3>
              <p>Move forward knowing you have a solid plan backed by data, not guesses.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="how-ai-works">
        <div className="landing-container">
          <h2>How It Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Tell Us Your Vision</h4>
              <p>Describe your project in our AI chat</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>AI Analyzes</h4>
              <p>Our system evaluates requirements</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Get Proposal</h4>
              <p>Complete breakdown delivered</p>
            </div>
            <div className="step-connector">→</div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Review & Refine</h4>
              <p>Ask questions, make changes</p>
            </div>
          </div>

          <div className="ai-stats">
            <div className="stat-box">
              <div className="stat-num">95%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">500+</div>
              <div className="stat-label">Projects Analyzed</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">10 min</div>
              <div className="stat-label">Average Initial Chat</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">0</div>
              <div className="stat-label">Hidden Costs</div>
            </div>
          </div>
        </div>
      </section>

      <section id="cases" className="case-studies">
        <div className="landing-container">
          <h2>Real Results</h2>
          <div className="case-selector">
            {caseStudies.map((_, i) => (
              <button 
                key={i} 
                className={`case-btn ${selectedCase === i ? 'active' : ''}`} 
                onClick={() => setSelectedCase(i)}
              >
                {caseStudies[i].company}
              </button>
            ))}
          </div>
          <div className="case-detail">
            <div className="case-grid">
              <div className="case-item">
                <h4>Challenge</h4>
                <p>{caseStudies[selectedCase].challenge}</p>
              </div>
              <div className="case-item">
                <h4>Solution</h4>
                <p>{caseStudies[selectedCase].solution}</p>
              </div>
              <div className="case-item">
                <h4>Result</h4>
                <p className="case-result">{caseStudies[selectedCase].result}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="landing-container">
          <h2>What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <p>"appont gave us exactly what we needed—a clear plan and realistic budget. Saved us from some really expensive mistakes."</p>
              <div className="author">Sarah Chen, CEO of TechStart</div>
            </div>
            <div className="testimonial">
              <p>"The proposal was spot-on. We knew exactly what we were getting into. That's rare in this industry."</p>
              <div className="author">Marcus Johnson, CloudFlow</div>
            </div>
            <div className="testimonial">
              <p>"Finally, a development partner that understands our vision and can articulate exactly how to build it."</p>
              <div className="author">Elena Rodriguez, BuildCo</div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="landing-container">
          <h2>Ready for Clarity?</h2>
          <p>Get a professional AI proposal that gives you confidence in your development investment.</p>
          <button className="cta-primary cta-large" onClick={onGetStarted}>Start Free Proposal</button>
        </div>
      </section>

      <section id="contact" className="contact">
        <ProjectChatbot />
      </section>

      <footer className="footer">
        <div className="landing-container">
          <div className="footer-content">
            <div>
              <h4>appont</h4>
              <p>AI-Powered Development Planning</p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#why">Why appont</a></li>
                <li><a href="#how">How It Works</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 appont LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
