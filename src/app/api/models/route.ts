import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OpenAI } from 'openai';

// Initialize the OpenAI client with Azure OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

// Model information storage
// In a real app, this would be in a database
const modelDetails = {
  'gpt35': {
    id: 'gpt35',
    name: 'GPT-3.5 Turbo',
    description: 'A fast and efficient language model for chat and text generation tasks.',
    pricing: '$0.002 / 1K tokens',
    capabilities: [
      'Chat completion',
      'Content generation',
      'Text summarization',
      'Language translation',
    ],
    provider: 'Azure OpenAI',
    type: 'chat',
    contextWindow: '16K tokens',
    inputFormat: 'Text prompts with optional system messages',
    outputFormat: 'Text completions that follow user instructions',
    useCases: [
      'Customer support chatbots',
      'Content creation assistants',
      'Educational Q&A systems',
      'Task automation'
    ],
    implementationCode: `const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

const completion = await openai.chat.completions.create({
  model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT,
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' }
  ]
});`
  },
  'textembed': {
    id: 'textembed',
    name: 'Text Embedding Ada 002',
    description: 'Creates vector representations of text for similarity comparisons and search.',
    pricing: '$0.0001 / 1K tokens',
    capabilities: [
      'Semantic search',
      'Text similarity calculation',
      'Content-based recommendations',
      'Information retrieval',
    ],
    provider: 'Azure OpenAI',
    type: 'embedding',
    contextWindow: '8K tokens',
    inputFormat: 'Text input to be converted to embeddings',
    outputFormat: 'High-dimensional vector representation of text (1536 dimensions)',
    useCases: [
      'Document search engines',
      'FAQ matching systems',
      'Content recommendation',
      'Data clustering'
    ],
    implementationCode: `const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

const embeddingResponse = await openai.embeddings.create({
  model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
  input: "The text to get embeddings for"
});

const embedding = embeddingResponse.data[0].embedding;`
  }
};

// Helper function to get saved models from cookies
function getSavedModels() {
  try {
    const savedModelsCookie = cookies().get('savedModels')?.value;
    return savedModelsCookie ? JSON.parse(savedModelsCookie) : [];
  } catch (error) {
    console.error('Error parsing saved models cookie:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Get saved models from cookies
    const savedModelIds = getSavedModels();
    
    // Enhance model details with saved status
    const enhancedModels = Object.values(modelDetails).map(model => ({
      ...model,
      saved: savedModelIds.includes(model.id),
    }));

    return NextResponse.json({
      models: enhancedModels,
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
} 