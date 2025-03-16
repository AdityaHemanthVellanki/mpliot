'use client';

import { useState } from 'react';
import { FiDownload, FiHeart, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ModelProps {
  model: {
    id: string;
    modelId: string;
    downloads?: number;
    likesCount?: number;
    description?: string;
    tags?: string[];
    similarity?: number;
  };
}

export default function ModelRecommendation({ model }: ModelProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Format the Hugging Face URL
  const hfUrl = `https://huggingface.co/${model.modelId}`;
  
  // Truncate description
  const shortDescription = model.description && model.description.length > 120 
    ? `${model.description.substring(0, 120)}...` 
    : model.description;
  
  // Format model name
  const modelName = model.modelId.split('/').pop() || model.modelId;
  
  // Calculate match percentage
  const matchPercentage = model.similarity !== undefined 
    ? Math.round(model.similarity * 100) 
    : undefined;
  
  return (
    <div className={`model-card animate-slide-up ${matchPercentage && matchPercentage > 80 ? 'model-card-highlight' : ''}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-heading text-lg font-semibold text-primary-light dark:text-accent-blue">
          <a href={hfUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover-scale inline-block">
            {modelName}
          </a>
        </h3>
        {matchPercentage !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            matchPercentage > 80 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
            {matchPercentage}% match
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
        {model.modelId}
      </p>
      
      {model.tags && model.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {model.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
          {model.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">+{model.tags.length - 3} more</span>
          )}
        </div>
      )}
      
      {shortDescription && (
        <div className="mt-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {expanded ? model.description : shortDescription}
            {model.description && model.description.length > 120 && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="ml-1 text-xs font-medium text-accent-blue hover:text-accent-pink flex items-center gap-1 mt-1"
              >
                {expanded ? (
                  <>Show less <FiChevronUp className="inline" /></>
                ) : (
                  <>Show more <FiChevronDown className="inline" /></>
                )}
              </button>
            )}
          </p>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {model.downloads !== undefined && (
            <span title="Downloads" className="flex items-center gap-1">
              <FiDownload className="text-accent-blue" /> 
              {model.downloads >= 1000 
                ? `${(model.downloads / 1000).toFixed(1)}k` 
                : model.downloads}
            </span>
          )}
          {model.likesCount !== undefined && (
            <span title="Likes" className="flex items-center gap-1">
              <FiHeart className="text-accent-pink" /> {model.likesCount}
            </span>
          )}
        </div>
        
        <a 
          href={hfUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secondary text-sm flex items-center gap-1"
        >
          View <FiExternalLink />
        </a>
      </div>
    </div>
  );
} 