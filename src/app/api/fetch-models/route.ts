import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

// Helper function to convert text to embedding
async function getEmbedding(text: string) {
  try {
    // For Azure OpenAI, use fetch directly
    const apiUrl = `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT}/embeddings?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY as string,
      },
      body: JSON.stringify({
        input: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Azure API error:', errorData);
      throw new Error(`Azure API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}

// Function to fetch models from Hugging Face API
async function fetchHuggingFaceModels(task: string, limit: number = 50) {
  const response = await fetch(`https://huggingface.co/api/models?sort=downloads&direction=-1&limit=${limit}&filter=${task}`, {
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Function to compute cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: Request) {
  try {
    const { task, query } = await request.json();
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      );
    }

    // Fetch models from Hugging Face
    let models = await fetchHuggingFaceModels(task);
    
    // Create an enhanced model array with more details
    const enhancedModels = models.map((model: any) => ({
      id: model._id,
      modelId: model.modelId,
      downloads: model.downloads,
      likesCount: model.likes,
      description: model.description,
      tags: model.tags,
    }));

    // If we have a query, rank models by semantic similarity
    if (query) {
      try {
        // Get embedding for the query
        const queryEmbedding = await getEmbedding(query);
        
        // Get embeddings for model descriptions and compute similarity
        const modelDescriptions = enhancedModels
          .filter((m: any) => m.description)
          .map((m: any) => m.description);

        // Get embeddings for batch of descriptions
        const descriptions = modelDescriptions.join('\n---\n');
        const descriptionsEmbedding = await getEmbedding(descriptions);
        
        // Calculate similarity scores and sort models
        for (let i = 0; i < enhancedModels.length; i++) {
          if (enhancedModels[i].description) {
            enhancedModels[i].similarity = enhancedModels[i].description ? 
              cosineSimilarity(queryEmbedding, descriptionsEmbedding) : 0;
          }
        }
        
        // Sort by similarity
        enhancedModels.sort((a: any, b: any) => 
          (b.similarity || 0) - (a.similarity || 0)
        );
      } catch (error) {
        console.error('Error computing semantic similarity:', error);
        // If embedding fails, don't sort by similarity
      }
    }

    return NextResponse.json({
      models: enhancedModels.slice(0, 10) // Return top 10 models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
} 