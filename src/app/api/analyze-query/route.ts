import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Azure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_CHAT_DEPLOYMENT}`,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Analyze the query to identify the task
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT as string, // Use deployment name instead of model name
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that helps identify the AI task category from a user's query.
                   Analyze the following query and extract the main task category (e.g., 'translation', 'summarization', 
                   'image-classification', 'text-generation', 'question-answering', etc.).
                   Return only the category without any explanation or additional text.`
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const task = response.choices[0].message.content?.trim() || 'unknown';

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error analyzing query:', error);
    return NextResponse.json(
      { error: 'Failed to analyze query' },
      { status: 500 }
    );
  }
} 