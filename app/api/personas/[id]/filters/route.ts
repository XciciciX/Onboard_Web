import { NextResponse } from 'next/server';
import { mockPersonas, PersonaFilter } from '../../route';

// Helper function to generate a random number of contacts
function generateContactCount(): string {
  // Generate a random number between 10,000 and 500,000
  const count = Math.floor(Math.random() * 490000) + 10000;
  // Format with commas
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// POST add a new filter to a persona
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await request.json();
  const personaIndex = mockPersonas.findIndex(p => p.id === id);
  
  if (personaIndex === -1) {
    return NextResponse.json(
      { error: 'Persona not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Validate required fields
  if (!data.type || !data.operator || !data.value) {
    return NextResponse.json(
      { error: 'Type, operator, and value are required fields', showFor: 2500  },
      { status: 400 }
    );
  }
  
  // Create a new filter
  const newFilter: PersonaFilter = {
    id: `f${Date.now()}`,
    type: data.type,
    operator: data.operator,
    value: data.value
  };
  
  // If groupId is provided, add to that group
  if (data.groupId && data.groupId !== 'new') {
    const groupIndex = mockPersonas[personaIndex].filterGroups.findIndex(
      g => g.id === data.groupId
    );
    
    if (groupIndex === -1) {
      return NextResponse.json(
        { error: 'Filter group not found', showFor: 2500  },
        { status: 404 }
      );
    }
    
    mockPersonas[personaIndex].filterGroups[groupIndex].filters.push(newFilter);
  } 
  // If no groups exist or groupId is 'new', create a new group
  else if (mockPersonas[personaIndex].filterGroups.length === 0 || data.groupId === 'new') {
    const newGroup = {
      id: `fg${Date.now()}`,
      operator: 'OR',
      filters: [newFilter]
    };
    
    mockPersonas[personaIndex].filterGroups.push(newGroup);
  } 
  // Otherwise, add to the first group
  else {
    mockPersonas[personaIndex].filterGroups[0].filters.push(newFilter);
  }
  
  // Update contact count when filters change
  mockPersonas[personaIndex].contacts = generateContactCount();
  
  return NextResponse.json({ 
    filter: newFilter,
    persona: mockPersonas[personaIndex]
  });
} 