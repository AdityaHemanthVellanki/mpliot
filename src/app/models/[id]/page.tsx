'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiArrowLeft, FiSave, FiCode, FiCopy, FiClipboard, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface ModelDetails {
  id: string;
  name: string;
  description?: string;
  pricing?: string;
  capabilities?: string[];
  provider: string;
  type: string;
  contextWindow?: string;
  inputFormat?: string;
  outputFormat?: string;
  useCases?: string[];
  implementationCode?: string;
  saved: boolean;
}

export default function ModelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [model, setModel] = useState<ModelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const modelId = params.id as string;

  useEffect(() => {
    async function fetchModelDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/models/${modelId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setModel(data.model);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch model details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (modelId) {
      fetchModelDetails();
    }
  }, [modelId]);

  const toggleSave = async () => {
    if (!model) return;

    // Optimistically update UI
    setModel({
      ...model,
      saved: !model.saved
    });

    try {
      // Persist the change
      const response = await fetch('/api/save-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelId: model.id, saved: !model.saved }),
      });

      if (!response.ok) {
        // Revert on failure
        setModel({
          ...model,
          saved: model.saved
        });
        throw new Error('Failed to update model');
      }
    } catch (err) {
      console.error('Error saving model:', err);
    }
  };

  const copyCode = () => {
    if (model?.implementationCode) {
      navigator.clipboard.writeText(model.implementationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading model details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!model) {
    return (
      <div className="empty-state">
        <p className="text-xl font-medium">Model not found</p>
        <p className="mt-2">The model you're looking for doesn't exist or has been removed.</p>
        <Link href="/models" className="btn-secondary mt-4 inline-block">
          <FiArrowLeft className="inline mr-2" /> Back to Models
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Link href="/models" className="text-accent-blue hover:text-accent-pink flex items-center gap-2 mb-4">
          <FiArrowLeft /> Back to Models
        </Link>
        <div className="flex justify-between items-start">
          <h1 className="font-heading text-3xl font-bold text-text-dark dark:text-text-white">
            {model.name}
          </h1>
          <button
            onClick={toggleSave}
            className={`p-2 rounded-full transition-colors duration-200 ${
              model.saved 
                ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' 
                : 'text-gray-400 hover:text-yellow-500 bg-gray-100 dark:bg-gray-800'
            }`}
            aria-label={model.saved ? "Unsave model" : "Save model"}
          >
            <FiSave className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="tag">{model.provider}</span>
          <span className="tag">{model.type}</span>
          {model.contextWindow && <span className="tag">{model.contextWindow}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {model.description && (
            <div className="card p-6 mb-6">
              <h2 className="font-heading text-xl font-semibold mb-3 text-text-dark dark:text-text-white">
                Description
              </h2>
              <div className="prose dark:prose-invert prose-sm sm:prose-base">
                <p>{model.description}</p>
              </div>
            </div>
          )}

          {model.implementationCode && (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading text-xl font-semibold text-text-dark dark:text-text-white flex items-center gap-2">
                  <FiCode className="text-accent-blue" /> Implementation
                </h2>
                <button
                  onClick={copyCode}
                  className="btn-secondary text-sm flex items-center gap-1"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <>
                      <FiCheck className="text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <FiClipboard /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-card overflow-hidden">
                <SyntaxHighlighter 
                  language="javascript" 
                  style={tomorrow}
                  customStyle={{
                    borderRadius: '12px',
                    fontSize: '14px',
                    overflow: 'auto',
                    marginTop: 0
                  }}
                >
                  {model.implementationCode}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="card p-6 mb-6">
            <h2 className="font-heading text-lg font-semibold mb-3 text-text-dark dark:text-text-white">
              Specifications
            </h2>
            <dl className="space-y-2">
              {model.inputFormat && (
                <>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Input Format</dt>
                  <dd className="text-sm text-gray-800 dark:text-gray-200 mb-2">{model.inputFormat}</dd>
                </>
              )}
              {model.outputFormat && (
                <>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Output Format</dt>
                  <dd className="text-sm text-gray-800 dark:text-gray-200 mb-2">{model.outputFormat}</dd>
                </>
              )}
              {model.contextWindow && (
                <>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Context Window</dt>
                  <dd className="text-sm text-gray-800 dark:text-gray-200 mb-2">{model.contextWindow}</dd>
                </>
              )}
              {model.pricing && (
                <>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Pricing</dt>
                  <dd className="text-sm text-gray-800 dark:text-gray-200 mb-2">{model.pricing}</dd>
                </>
              )}
            </dl>
          </div>

          {model.useCases && model.useCases.length > 0 && (
            <div className="card p-6">
              <h2 className="font-heading text-lg font-semibold mb-3 text-text-dark dark:text-text-white">
                Use Cases
              </h2>
              <ul className="space-y-2">
                {model.useCases.map((useCase, index) => (
                  <li key={index} className="text-sm text-gray-800 dark:text-gray-200 flex items-start">
                    <span className="text-accent-blue mr-2">•</span>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 