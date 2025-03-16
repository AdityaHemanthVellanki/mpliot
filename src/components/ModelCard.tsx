'use client';

import React, { useEffect, useState } from 'react';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FiSave, FiStar, FiArrowRight } from 'react-icons/fi';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    description?: string;
    provider: string;
    type: string;
    saved: boolean;
  };
  onToggleSave: (id: string) => void;
}

export default function ModelCard({ model, onToggleSave }: ModelCardProps) {
  const router = useRouter();
  const modelUrl = `https://huggingface.co/${model.name}`;
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
  
  const bgColor = isDarkMode ? '#1e293b' : '#f8fafc';
  const borderColor = isDarkMode ? '#334155' : '#e2e8f0';
  const textColor = isDarkMode ? '#f8fafc' : '#1e293b';
  
  const navigateToDetails = () => {
    router.push(`/models/${model.id}`);
  };
  
  return (
    <div 
      className="model-card hover:cursor-pointer"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
        padding: '1.25rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        height: '100%',
        border: `1px solid ${borderColor}`,
        transition: 'all 0.3s ease',
      }}
      onClick={navigateToDetails}
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-heading text-lg font-semibold text-primary-light dark:text-accent-blue">
            {model.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(model.id);
            }}
            className={`p-2 rounded-full transition-colors duration-200 ${
              model.saved 
                ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' 
                : 'text-gray-400 hover:text-yellow-500 bg-gray-100 dark:bg-gray-800'
            }`}
            aria-label={model.saved ? "Unsave model" : "Save model"}
          >
            <FiSave className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center mt-2">
          <span className="tag">{model.provider}</span>
          <span className="tag">{model.type}</span>
        </div>
        
        {model.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-3">
            {model.description}
          </p>
        )}
        
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-accent-blue hover:text-accent-pink flex items-center gap-1">
            View details <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
} 