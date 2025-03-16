import React, { useState, useEffect } from 'react';
import { FaTimes, FaLightbulb, FaSearch, FaListAlt } from 'react-icons/fa';

export default function TutorialPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if it's the user's first visit and detect dark mode
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('mpilot_visited');
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    if (!hasVisitedBefore) {
      // Wait a moment before showing the tutorial
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('mpilot_visited', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#1e293b';
  const hoverBgColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem',
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div style={{ 
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '32rem',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <button
          onClick={() => setIsOpen(false)}
          style={{ 
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            padding: '0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'transparent',
            color: textColor,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverBgColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <FaTimes />
        </button>
        
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: '#2D5DEE'
          }}>
            Welcome to Mpilot!
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(45, 93, 238, 0.1)'
              }}>
                <FaLightbulb style={{ color: '#2D5DEE', fontSize: '1.25rem' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Describe Your Needs</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Tell us what you're looking for in plain language.
                  For example: "I need a model that can translate English to French".
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(45, 93, 238, 0.1)'
              }}>
                <FaSearch style={{ color: '#2D5DEE', fontSize: '1.25rem' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 500, marginBottom: '0.25rem' }}>AI-Powered Search</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Our AI will analyze your query and find the most relevant Hugging Face models for your task.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(45, 93, 238, 0.1)'
              }}>
                <FaListAlt style={{ color: '#2D5DEE', fontSize: '1.25rem' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Get Ranked Results</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Review the top models ranked by relevance to your needs, with download stats and details.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            style={{ 
              width: '100%',
              marginTop: '2rem',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: '#2D5DEE',
              color: 'white',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2351d1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2D5DEE')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 