import React from 'react';
import './SuccessModal.css';

function SuccessModal({ projectType, email, onClose }) {
  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-icon">✅</div>
        <h2>Proposal Sent Successfully!</h2>
        <p>We've sent your {projectType} proposal to <strong>{email}</strong></p>

        <div className="options-grid">
          {/* Option A: Book Call */}
          <div className="option-card">
            <div className="option-icon">📞</div>
            <h3>Book a Call</h3>
            <p>Schedule a 30-min strategy session with our team</p>
            <a href="https://calendly.com/appont" target="_blank" rel="noopener noreferrer" className="option-btn">
              Pick a Time
            </a>
          </div>

          {/* Option B: Request Changes */}
          <div className="option-card">
            <div className="option-icon">💬</div>
            <h3>Request Changes</h3>
            <p>Chat with AI to refine and iterate on your proposal</p>
            <button className="option-btn" onClick={() => alert('Chat refinement coming soon')}>
              Start Chat
            </button>
          </div>

          {/* Option C: Share with Team */}
          <div className="option-card">
            <div className="option-icon">👥</div>
            <h3>Share with Team</h3>
            <p>Forward proposal to colleagues or stakeholders</p>
            <button className="option-btn" onClick={() => alert('Share feature coming soon')}>
              Share Now
            </button>
          </div>

          {/* Option D: Next Steps */}
          <div className="option-card">
            <div className="option-icon">🚀</div>
            <h3>Next Steps</h3>
            <p>Learn about our process and get in touch</p>
            <a href="mailto:hello@appont.dev" className="option-btn">
              Contact Us
            </a>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>← Back to Home</button>
      </div>
    </div>
  );
}

export default SuccessModal;
