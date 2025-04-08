import { NextResponse } from 'next/server';
import { Persona, mockPersonas } from '../route';

// GET a specific persona by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await params.id;
  const persona = mockPersonas.find(p => p.id === id);
  
  if (!persona) {
    return NextResponse.json(
      { error: 'Persona not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ persona });
}

// PUT update a persona
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const data = await request.json();
    
    console.log(`Processing PUT request for persona ID: ${id}`);
    console.log(`Request data:`, JSON.stringify(data));
    
    // Find the persona by ID
    const personaIndex = mockPersonas.findIndex(p => p.id === id);
    
    if (personaIndex === -1) {
      console.log(`Persona not found with ID: ${id}. Creating new persona instead.`);
      
      // If persona doesn't exist, create a new one with this ID
      const newPersona = {
        id: id,
        title: data.title || 'New Persona',
        key: data.key || 'new_persona',
        contacts: data.contacts || '0',
        filterGroups: data.filterGroups || []
      };
      
      mockPersonas.push(newPersona);
      console.log(`Created new persona: ${JSON.stringify(newPersona)}`);
      return NextResponse.json({ persona: newPersona });
    }
    
    // Update the entire persona with the provided data
    const updatedPersona = {
      ...mockPersonas[personaIndex],
      ...(data.title && { title: data.title }),
      ...(data.key && { key: data.key }),
      ...(data.contacts && { contacts: data.contacts }),
      ...(data.filterGroups && { filterGroups: data.filterGroups }),
    };
    
    mockPersonas[personaIndex] = updatedPersona;
    
    console.log(`Successfully updated persona: ${JSON.stringify(updatedPersona)}`);
    return NextResponse.json({ persona: updatedPersona });
  } catch (error) {
    console.error('Error updating persona:', error);
    return NextResponse.json(
      { error: 'Failed to update persona' },
      { status: 500 }
    );
  }
}

// DELETE a persona
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    console.log(`Processing DELETE request for persona ID: ${id}`);
    console.log(`Current mockPersonas:`, JSON.stringify(mockPersonas.map(p => ({ id: p.id, title: p.title }))));
    
    const personaIndex = mockPersonas.findIndex(p => p.id === id);
    
    if (personaIndex === -1) {
      console.log(`Persona not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Persona not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    const deletedPersona = mockPersonas[personaIndex];
    mockPersonas.splice(personaIndex, 1);
    
    console.log(`Successfully deleted persona: ${JSON.stringify(deletedPersona)}`);
    return NextResponse.json({ success: true, deletedPersona });
  } catch (error) {
    console.error('Error deleting persona:', error);
    return NextResponse.json(
      { error: 'Failed to delete persona' },
      { status: 500 }
    );
  }
} 