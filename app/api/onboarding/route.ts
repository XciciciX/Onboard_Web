import { NextResponse } from 'next/server';

// This would typically be stored in a database
let onboardingData: Record<string, any> = {};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the incoming data
    if (!data.formData) {
      return NextResponse.json(
        { error: 'Form data is required', showFor: 2500  },
        { status: 400 }
      );
    }
    
    // Store the complete form data (in a real app, this would go to a database)
    onboardingData = data.formData;
    
    console.log('Saved complete onboarding data:', data.formData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding data saved successfully',
      data: onboardingData
    });
  } catch (error) {
    console.error('Error processing onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to process onboarding data', showFor: 2500  },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ data: onboardingData });
} 