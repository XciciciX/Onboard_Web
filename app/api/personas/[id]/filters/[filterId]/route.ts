import { NextResponse } from 'next/server';
import { mockPersonas } from '../../../route';

// PUT update a filter
export async function PUT(
  request: Request,
  { params }: { params: { id: string; filterId: string } }
) {
  const id = params.id;
  const filterId = params.filterId;
  const data = await request.json();
  const personaIndex = mockPersonas.findIndex(p => p.id === id);
  
  if (personaIndex === -1) {
    return NextResponse.json(
      { error: 'Persona not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Find the filter in any group
  let filterFound = false;
  let updatedPersona = {...mockPersonas[personaIndex]};
  
  updatedPersona.filterGroups = updatedPersona.filterGroups.map(group => {
    const filterIndex = group.filters.findIndex(f => f.id === filterId);
    
    if (filterIndex !== -1) {
      filterFound = true;
      group.filters[filterIndex] = {
        ...group.filters[filterIndex],
        ...(data.type && { type: data.type }),
        ...(data.operator && { operator: data.operator }),
        ...(data.value && { value: data.value }),
      };
    }
    
    return group;
  });
  
  if (!filterFound) {
    return NextResponse.json(
      { error: 'Filter not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  mockPersonas[personaIndex] = updatedPersona;
  
  return NextResponse.json({ 
    success: true,
    persona: updatedPersona
  });
}

// DELETE a filter
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; filterId: string } }
) {
  const id = params.id;
  const filterId = params.filterId;
  const personaIndex = mockPersonas.findIndex(p => p.id === id);
  
  if (personaIndex === -1) {
    return NextResponse.json(
      { error: 'Persona not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Find and remove the filter from any group
  let filterFound = false;
  let updatedPersona = {...mockPersonas[personaIndex]};
  
  updatedPersona.filterGroups = updatedPersona.filterGroups.map(group => {
    const filterIndex = group.filters.findIndex(f => f.id === filterId);
    
    if (filterIndex !== -1) {
      filterFound = true;
      group.filters.splice(filterIndex, 1);
    }
    
    return group;
  });
  
  // Remove empty groups
  updatedPersona.filterGroups = updatedPersona.filterGroups.filter(
    group => group.filters.length > 0
  );
  
  if (!filterFound) {
    return NextResponse.json(
      { error: 'Filter not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  mockPersonas[personaIndex] = updatedPersona;
  
  return NextResponse.json({ 
    success: true,
    persona: updatedPersona
  });
} 