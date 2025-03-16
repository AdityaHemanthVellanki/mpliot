'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ModelDetails {
  id: string;
  name: string;
  description?: string;
  pricing?: string;
  capabilities?: string[];
  provider: string;
  type: 'chat' | 'embedding' | 'other';
  saved: boolean;
}

export default function ModelsPage() {
  const [models, setModels] = useState<ModelDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true);
        const response = await fetch('/api/models');
        if (!response.ok) {
          throw new Error(`Error fetching models: ${response.statusText}`);
        }
        const data = await response.json();
        setModels(data.models);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  const toggleSaveModel = async (modelId: string) => {
    try {
      const model = models.find(m => m.id === modelId);
      if (!model) return;

      const updatedModels = models.map(m => {
        if (m.id === modelId) {
          return { ...m, saved: !m.saved };
        }
        return m;
      });
      
      setModels(updatedModels);

      // Persist changes
      const response = await fetch('/api/models/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelId, saved: !model.saved }),
      });

      if (!response.ok) {
        throw new Error('Failed to save model preference');
      }
    } catch (err) {
      console.error('Error saving model:', err);
      // Revert the optimistic update
      const response = await fetch('/api/models');
      const data = await response.json();
      setModels(data.models);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Models</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Saved Models</h2>
            {models.filter(m => m.saved).length === 0 ? (
              <p className="text-gray-500">No saved models yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models
                  .filter(m => m.saved)
                  .map(model => (
                    <ModelCard 
                      key={model.id} 
                      model={model} 
                      onToggleSave={toggleSaveModel}
                    />
                  ))}
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-3">Available Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map(model => (
              <ModelCard 
                key={model.id} 
                model={model} 
                onToggleSave={toggleSaveModel}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ModelCard({ 
  model, 
  onToggleSave 
}: { 
  model: ModelDetails; 
  onToggleSave: (id: string) => void;
}) {
  const router = useRouter();
  
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 
          className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
          onClick={() => router.push(`/models/${model.id}`)}
        >
          {model.name}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(model.id);
          }}
          className="text-gray-400 hover:text-yellow-500"
          aria-label={model.saved ? "Unsave model" : "Save model"}
        >
          {model.saved ? (
            <span className="text-yellow-500">★</span>
          ) : (
            <span>☆</span>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mb-2">Provider: {model.provider}</p>
      
      <div className="mb-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {model.type}
        </span>
      </div>
      
      {model.description && (
        <p className="text-sm text-gray-700 mb-3">{model.description.substring(0, 100)}...</p>
      )}
      
      <button
        onClick={() => router.push(`/models/${model.id}`)}
        className="text-sm text-blue-500 hover:text-blue-700"
      >
        View details
      </button>
    </div>
  );
} 