import { NextResponse } from 'next/server';
import { mockPersonas } from '../../../route';

// PUT update a filter group's operator
export async function PUT(
  request: Request,
  { params }: { params: { id: string; groupId: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const groupId = resolvedParams.groupId;
    
    const data = await request.json();
    
    console.log(`Processing PUT request for persona ID: ${id}, group ID: ${groupId}`);
    
    // Find the persona
    const personaIndex = mockPersonas.findIndex(p => p.id === id);
    
    if (personaIndex === -1) {
      console.log(`Persona not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Persona not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    const persona = mockPersonas[personaIndex];
    
    // Find the filter group
    const groupIndex = persona.filterGroups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      console.log(`Filter group not found with ID: ${groupId}`);
      return NextResponse.json(
        { error: 'Filter group not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    // Update the group operator
    if (data.operator) {
      persona.filterGroups[groupIndex].operator = data.operator;
    }
    
    console.log(`Successfully updated filter group: ${JSON.stringify(persona.filterGroups[groupIndex])}`);
    return NextResponse.json({ persona, filterGroup: persona.filterGroups[groupIndex] });
  } catch (error) {
    console.error('Error updating filter group:', error);
    return NextResponse.json(
      { error: 'Failed to update filter group' },
      { status: 500 }
    );
  }
}

// DELETE a filter group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; groupId: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const groupId = resolvedParams.groupId;
    
    console.log(`Processing DELETE request for persona ID: ${id}, group ID: ${groupId}`);
    
    // Find the persona
    const personaIndex = mockPersonas.findIndex(p => p.id === id);
    
    if (personaIndex === -1) {
      console.log(`Persona not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Persona not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    const persona = mockPersonas[personaIndex];
    
    // Find the filter group
    const groupIndex = persona.filterGroups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      console.log(`Filter group not found with ID: ${groupId}`);
      return NextResponse.json(
        { error: 'Filter group not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    // Delete the filter group
    const deletedGroup = persona.filterGroups[groupIndex];
    persona.filterGroups.splice(groupIndex, 1);
    
    console.log(`Successfully deleted filter group: ${JSON.stringify(deletedGroup)}`);
    return NextResponse.json({ persona, deletedGroup });
  } catch (error) {
    console.error('Error deleting filter group:', error);
    return NextResponse.json(
      { error: 'Failed to delete filter group' },
      { status: 500 }
    );
  }
} 