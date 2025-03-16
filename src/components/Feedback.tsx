import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function Feedback() {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDarkNow);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you could send feedback to your backend
    console.log({ feedback, suggestion });
    setSubmitted(true);
  };

  const bgColor = isDarkMode ? '#1e293b' : '#f1f5f9';
  const inputBgColor = isDarkMode ? '#334155' : '#ffffff';
  const borderColor = isDarkMode ? '#475569' : '#e2e8f0';
  const textColor = isDarkMode ? '#f8fafc' : '#1e293b';

  if (submitted) {
    return (
      <div 
        style={{ 
          backgroundColor: bgColor,
          color: textColor,
          padding: '1rem',
          borderRadius: '0.5rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#10b981', fontWeight: 500 }}>
          Thank you for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ 
        backgroundColor: bgColor,
        color: textColor,
        padding: '1rem',
        borderRadius: '0.5rem',
        marginTop: '2rem'
      }}
    >
      <h3 style={{ fontWeight: 500, textAlign: 'center', marginBottom: '0.75rem' }}>
        How were the results?
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setFeedback('positive')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            backgroundColor: feedback === 'positive' ? '#10b981' : 'transparent',
            color: feedback === 'positive' ? 'white' : textColor,
            borderWidth: feedback === 'positive' ? '0' : '1px',
            borderStyle: feedback === 'positive' ? 'none' : 'solid',
            borderColor: borderColor
          }}
        >
          <FaThumbsUp style={{ marginRight: '0.5rem' }} /> Helpful
        </button>
        
        <button
          onClick={() => setFeedback('negative')}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            backgroundColor: feedback === 'negative' ? '#ef4444' : 'transparent',
            color: feedback === 'negative' ? 'white' : textColor,
            borderWidth: feedback === 'negative' ? '0' : '1px',
            borderStyle: feedback === 'negative' ? 'none' : 'solid',
            borderColor: borderColor
          }}
        >
          <FaThumbsDown style={{ marginRight: '0.5rem' }} /> Not Helpful
        </button>
      </div>

      {feedback && (
        <form onSubmit={handleSubmit}>
          <textarea
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: inputBgColor,
              color: textColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: borderColor,
              minHeight: '80px',
              outline: 'none'
            }}
            placeholder="Any suggestions for improvement?"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              style={{
                backgroundColor: '#2D5DEE',
                color: 'white',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 