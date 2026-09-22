import React, { useState, useEffect, useRef } from 'react';

export default function ChatWidget({ token, projectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/client-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: input, project_id: projectId })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: ' + data.error }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.widget}>
      <h3 style={styles.title}>AI Assistant</h3>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            ...styles.message,
            ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
          }}>
            {msg.content}
          </div>
        ))}
        {loading && <div style={styles.loading}>Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your project..."
          style={styles.input}
          disabled={loading}
        />
        <button onClick={handleSend} style={styles.button} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  widget: {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    marginTop: '20px'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  message: {
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  userMessage: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#bfdbfe',
    alignSelf: 'flex-end',
    maxWidth: '80%'
  },
  assistantMessage: {
    background: 'rgba(148, 163, 184, 0.1)',
    color: '#cbd5e1',
    alignSelf: 'flex-start',
    maxWidth: '80%'
  },
  loading: {
    padding: '10px 12px',
    color: '#94a3b8',
    fontStyle: 'italic',
    fontSize: '13px'
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    borderTop: '1px solid rgba(148, 163, 184, 0.2)'
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '6px',
    color: '#f1f5f9',
    fontSize: '13px'
  },
  button: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  }
};
