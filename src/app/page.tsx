"use client";

import { useState, useEffect } from 'react';
import { FiSearch, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import PromptInput from '@/components/PromptInput';
import Link from 'next/link';
import ModelRecommendation from '../components/ModelRecommendation';

// Type for model data
interface Model {
  id: string;
  modelId: string;
  downloads: number;
  likesCount?: number;
  description?: string;
  tags?: string[];
  similarity?: number;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState([]);
  const [taskType, setTaskType] = useState('');

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

  const handlePromptSubmit = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRecommendations([]);
    setTaskType('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data.text);
      
      if (data.recommendedModels && data.recommendedModels.length > 0) {
        setRecommendations(data.recommendedModels);
      }
      
      if (data.task) {
        setTaskType(data.task);
      }
    } catch (err) {
      console.error('Error submitting prompt:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-text-dark dark:text-text-white">
          <span className="bg-gradient-to-r from-accent-blue to-accent-pink bg-clip-text text-transparent">
            MPilot
          </span> AI Model Finder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover the perfect AI models for your projects with our intelligent recommendation system
        </p>
      
        <PromptInput 
          onSubmit={handlePromptSubmit}
          placeholder="Describe your task or ask about AI models..."
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="flex flex-col items-center my-12">
          <div className="loader"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse-slow">Finding the best AI models for you...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="card bg-white/80 dark:bg-card-dark backdrop-blur-sm p-6 my-8">
          <h2 className="font-heading text-xl font-semibold mb-4 text-text-dark dark:text-text-white">
            Response
          </h2>
          <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none mb-6">
            {response}
          </div>
          
          {taskType && (
            <div className="mt-4 mb-2">
              <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                Detected task: {taskType}
              </span>
            </div>
          )}
          
          {recommendations.length > 0 ? (
            <div className="mt-8">
              <h3 className="font-heading text-lg font-semibold mb-4 text-text-dark dark:text-text-white">
                Recommended Models
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((model, index) => (
                  <ModelRecommendation key={index} model={model} />
                ))}
              </div>
            </div>
          ) : response ? (
            <div className="empty-state mt-6">
              <p className="mb-2 font-medium">No specific models to recommend for this query.</p>
              <p>Try asking about a specific AI task like "text classification" or "image generation".</p>
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-16 glass rounded-card p-8">
        <h2 className="font-heading text-2xl font-bold mb-6 text-center text-text-dark dark:text-text-white">
          Popular AI Model Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card hover-scale">
            <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="p-5">
              <h3 className="font-heading text-xl font-semibold mb-2 text-text-dark dark:text-text-white">
                Natural Language
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Text generation, classification, summarization and more text processing tasks.
              </p>
              <Link 
                href="/models?type=text-generation" 
                className="inline-flex items-center text-accent-blue hover:text-accent-pink"
              >
                Explore models <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="card hover-scale">
            <div className="h-3 bg-gradient-to-r from-rose-500 to-pink-500"></div>
            <div className="p-5">
              <h3 className="font-heading text-xl font-semibold mb-2 text-text-dark dark:text-text-white">
                Computer Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Image generation, classification, object detection and segmentation.
              </p>
              <Link 
                href="/models?type=image-classification" 
                className="inline-flex items-center text-accent-blue hover:text-accent-pink"
              >
                Explore models <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="card hover-scale">
            <div className="h-3 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
            <div className="p-5">
              <h3 className="font-heading text-xl font-semibold mb-2 text-text-dark dark:text-text-white">
                Audio & Speech
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Speech recognition, audio classification, and text-to-speech conversion.
              </p>
              <Link 
                href="/models?type=automatic-speech-recognition" 
                className="inline-flex items-center text-accent-blue hover:text-accent-pink"
              >
                Explore models <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
