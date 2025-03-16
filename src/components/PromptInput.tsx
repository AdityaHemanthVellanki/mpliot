'use client';

import React, { useState, KeyboardEvent } from 'react';
import { FiSend } from 'react-icons/fi';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function PromptInput({ 
  onSubmit, 
  placeholder = "Ask about AI models or describe your task...", 
  disabled = false 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim() && !disabled) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="relative glass rounded-card">
        <textarea
          className="w-full p-4 pr-16 rounded-card bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          disabled={disabled}
        />
        <button
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-200 ${
            prompt.trim() && !disabled
              ? 'bg-accent-blue hover:bg-accent-pink text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={!prompt.trim() || disabled}
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Press Enter to submit • Shift+Enter for new line
      </p>
    </div>
  );
} 