import { NextResponse } from 'next/server';
import { mockPersonas } from '../../route';

// POST create a new filter group
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const data = await request.json();
    
    console.log(`Processing POST request for persona ID: ${id}`);
    console.log(`Request data:`, data);
    
    // Find the persona
    const personaIndex = mockPersonas.findIndex(p => p.id === id);
    console.log(`Found persona index: ${personaIndex}`);
    
    if (personaIndex === -1) {
      console.log(`Persona not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Persona not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    // Create a new filter group
    const newGroup = {
      id: Date.now().toString(),
      filters: [],
      operator: data.operator || 'AND'
    };
    
    mockPersonas[personaIndex].filterGroups.push(newGroup);
    
    console.log(`Created new filter group: ${JSON.stringify(newGroup)}`);
    return NextResponse.json({ 
      filterGroup: newGroup,
      persona: mockPersonas[personaIndex]
    });
  } catch (error) {
    console.error('Error creating filter group:', error);
    return NextResponse.json(
      { error: 'Failed to create filter group' },
      { status: 500 }
    );
  }
} 