import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { modelId, saved } = await request.json();
    
    // Get current saved models
    let savedModels: string[] = [];
    try {
      const savedModelsCookie = cookies().get('savedModels')?.value;
      savedModels = savedModelsCookie ? JSON.parse(savedModelsCookie) : [];
    } catch (error) {
      console.error('Error parsing saved models cookie:', error);
    }
    
    // Update saved models list
    if (saved && !savedModels.includes(modelId)) {
      savedModels.push(modelId);
    } else if (!saved && savedModels.includes(modelId)) {
      savedModels = savedModels.filter(id => id !== modelId);
    }
    
    // Set cookie with updated saved models
    cookies().set({
      name: 'savedModels',
      value: JSON.stringify(savedModels),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    return NextResponse.json({ success: true, savedModels });
  } catch (error) {
    console.error('Error saving model:', error);
    return NextResponse.json(
      { error: 'Failed to save model' },
      { status: 500 }
    );
  }
} 