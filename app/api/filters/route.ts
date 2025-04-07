import { NextResponse } from 'next/server';

export interface Filter {
  id: string;
  type: 'persona' | 'authority_level' | 'keyword';
  value: string;
  contactCount?: number;
}

// This would typically come from a database
const mockFilters: Filter[] = [
  { id: '1', type: 'persona', value: 'Law Enforcement', contactCount: 140216 },
  { id: '2', type: 'persona', value: 'Fire and Rescue Services', contactCount: 124982 },
  { id: '3', type: 'persona', value: 'Finance', contactCount: 217447 },
  { id: '4', type: 'authority_level', value: 'C Level', contactCount: 537966 },
  { id: '5', type: 'authority_level', value: 'Director', contactCount: 821094 },
  { id: '6', type: 'authority_level', value: 'Manager', contactCount: 312398 },
  { id: '7', type: 'keyword', value: 'Higher education' },
  { id: '8', type: 'keyword', value: 'Student success' },
  { id: '9', type: 'keyword', value: 'Degree completion' },
  { id: '10', type: 'keyword', value: 'Student retention' },
  { id: '11', type: 'keyword', value: 'Academic pathways' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  let filters = [...mockFilters];
  
  if (type) {
    filters = filters.filter(filter => filter.type === type);
  }
  
  return NextResponse.json({ filters });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // Validate the incoming data
  if (!data.type || !data.value) {
    return NextResponse.json(
      { error: 'Type and value are required fields' },
      { status: 400 }
    );
  }
  
  // In a real application, you would save this to a database
  const newFilter: Filter = {
    id: (mockFilters.length + 1).toString(),
    type: data.type,
    value: data.value,
    contactCount: data.contactCount || undefined
  };
  
  // For demo purposes, we'll just return the new filter
  return NextResponse.json({ filter: newFilter });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Filter ID is required' },
      { status: 400 }
    );
  }
  
  // In a real application, you would delete from a database
  // Here we'll just return a success message
  return NextResponse.json({ success: true, message: `Filter ${id} deleted` });
} 