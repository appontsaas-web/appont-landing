import React from 'react';
import './LandingPage.css';
import ProjectChatbot from './ProjectChatbot';

const LandingPage = () => {
  const handleStartProject = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="logo">🚀 appont.dev</div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#process">How It Works</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">✨ AI-Powered Development</div>
            <h1 className="hero-title">
              Build Tomorrow's <span className="gradient-text">Digital Products</span> Today
            </h1>
            <p className="hero-subtitle">
              We combine cutting-edge AI technology with expert development to create intelligent solutions that scale.
            </p>
            <button className="cta-button" onClick={handleStartProject}>
              Start Your Project
            </button>
          </div>
          <div className="hero-visual">
            <div className="ai-orb"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive solutions powered by AI & expertise</p>
          </div>
          <div className="services-grid">
            {[
              { icon: '🌐', title: 'Web Applications', desc: 'React, Next.js, Node.js — scalable web apps with AI integration' },
              { icon: '📱', title: 'Mobile Apps', desc: 'Native & cross-platform apps built with latest frameworks' },
              { icon: '🤖', title: 'AI Solutions', desc: 'ML models, chatbots, automation, and intelligent features' },
              { icon: '🎨', title: 'UI/UX Design', desc: 'Modern, conversion-focused designs that users love' },
              { icon: '⚙️', title: 'API Development', desc: 'RESTful & GraphQL APIs built for performance' },
              { icon: '☁️', title: 'Cloud & DevOps', desc: 'AWS, GCP deployment, CI/CD pipelines, infrastructure' },
            ].map((service, i) => (
              <div key={i} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="process">
        <div className="container">
          <div className="section-header">
            <h2>How We Work</h2>
            <p>From idea to launch, streamlined & efficient</p>
          </div>
          <div className="process-steps">
            {[
              { step: '01', title: 'Discovery', desc: 'We understand your vision, goals, and requirements' },
              { step: '02', title: 'Strategy', desc: 'Technical roadmap and architecture planning' },
              { step: '03', title: 'Build', desc: 'Rapid development with cutting-edge tech stack' },
              { step: '04', title: 'Launch', desc: 'Deployment, testing, and go-live support' },
            ].map((item, i) => (
              <div key={i} className="process-step">
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <div className="container">
          <div className="section-header">
            <h2>Why appont.dev?</h2>
            <p>What sets us apart</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '⚡', title: 'Fast Delivery', text: 'Agile methodology for rapid iterations' },
              { icon: '🎯', title: 'Results-Focused', text: 'Every line of code drives business value' },
              { icon: '🔒', title: 'Quality Assured', text: 'Rigorous testing and best practices' },
              { icon: '🤝', title: 'Full Support', text: '30+ days of post-launch support included' },
            ].map((feature, i) => (
              <div key={i} className="feature-box">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Chatbot */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Let's Build Together</h2>
            <p>Start your project with our AI-powered inquiry system</p>
          </div>
          <ProjectChatbot />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2026 appont.dev. Crafted with AI & expertise.</p>
            <p className="footer-contact">
              📧 <a href="mailto:hello@appont.dev">hello@appont.dev</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
