import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize the OpenAI client with Azure OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Step 1: Generate AI response
    let responseText = '';
    try {
      // For Azure OpenAI, use fetch directly to properly format the request
      const apiUrl = `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_CHAT_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY as string,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant specializing in AI models, their capabilities, and implementation details. Provide concise, accurate information about models, their use cases, and how to implement them in code.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Azure API error:', errorData);
        throw new Error(`Azure API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      responseText = data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Error generating AI response:', error);
      responseText = 'Unable to generate AI response. Please try again.';
    }

    // Step 2: Analyze the prompt to identify the task/requirements
    let task = '';
    try {
      const analyzeResponse = await fetch(`${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_CHAT_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY as string,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an AI task classifier. Extract the main ML/AI task from the user query. Output ONLY the task name, nothing else. Use one of these categories: text-classification, token-classification, question-answering, translation, summarization, text-generation, fill-mask, text-to-image, image-classification, object-detection, image-segmentation, audio-classification, automatic-speech-recognition, text-to-speech, other.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 50,
        }),
      });

      if (analyzeResponse.ok) {
        const analyzeData = await analyzeResponse.json();
        task = analyzeData.choices[0]?.message?.content?.trim() || 'text-generation';
      }
    } catch (error) {
      console.error('Error analyzing prompt task:', error);
      task = 'text-generation'; // Default fallback
    }

    // Step 3: Fetch relevant models from Hugging Face
    let recommendedModels = [];
    try {
      // Fetch models from Hugging Face based on the task
      const modelResponse = await fetch('/api/fetch-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, query: prompt }),
      });

      if (modelResponse.ok) {
        const modelData = await modelResponse.json();
        recommendedModels = modelData.models || [];
      }
    } catch (error) {
      console.error('Error fetching recommended models:', error);
    }

    // Step 4: Return both the AI response and model recommendations
    return NextResponse.json({
      text: responseText,
      task: task,
      recommendedModels: recommendedModels.slice(0, 3) // Limit to top 3 recommendations
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 