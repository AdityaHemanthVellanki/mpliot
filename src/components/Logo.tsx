import React from 'react';
import { FaCompass } from 'react-icons/fa';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: '#2D5DEE', 
          filter: 'blur(4px)', 
          opacity: 0.3, 
          borderRadius: '9999px' 
        }}></div>
        <FaCompass style={{ 
          fontSize: '1.875rem', 
          color: '#2D5DEE', 
          position: 'relative', 
          zIndex: 10 
        }} />
      </div>
      <span style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        background: 'linear-gradient(to right, #2D5DEE, #60a5fa)', 
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Mpilot
      </span>
    </div>
  );
} 