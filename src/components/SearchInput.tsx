import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState('');
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
    if (query.trim()) {
      onSearch(query);
    }
  };

  const inputBgColor = isDarkMode ? '#1e293b' : '#f8fafc';
  const inputBorderColor = isDarkMode ? '#334155' : '#e2e8f0';
  const inputTextColor = isDarkMode ? '#f8fafc' : '#1e293b';

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        <textarea
          style={{
            width: '100%',
            padding: '1rem',
            paddingRight: '4rem',
            borderRadius: '0.75rem',
            backgroundColor: inputBgColor,
            borderColor: inputBorderColor,
            color: inputTextColor,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            minHeight: '120px',
            fontSize: '1rem',
            border: `1px solid ${inputBorderColor}`,
            outline: 'none'
          }}
          placeholder="Describe your model task (e.g., 'I need to translate Spanish to English')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '0.75rem',
            bottom: '0.75rem',
            backgroundColor: '#2D5DEE',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !query.trim() ? 0.7 : 1
          }}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>
              <FaSpinner />
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <>
              <FaSearch style={{ marginRight: '0.5rem' }} /> Search
            </>
          )}
        </button>
      </div>
    </form>
  );
} 