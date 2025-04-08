import { NextResponse } from 'next/server';
import { mockAuthorityLevels } from '../../../route';

// PUT update a filter
export async function PUT(
  request: Request,
  { params }: { params: { id: string; filterId: string } }
) {
  console.log('PUT filter called with params:', params); // Debug log
  
  const id = params.id;
  const filterId = params.filterId;
  const data = await request.json();
  console.log('Request data:', data); // Debug log
  
  // Make sure we're comparing strings
  const authorityLevelIndex = mockAuthorityLevels.findIndex(p => String(p.id) === String(id));
  console.log('Found authority level index:', authorityLevelIndex); // Debug log
  
  if (authorityLevelIndex === -1) {
    console.log('Authority level not found'); // Debug log
    return NextResponse.json(
      { error: 'Authority level not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Find the filter in any group
  let filterFound = false;
  let updatedAuthorityLevel = {...mockAuthorityLevels[authorityLevelIndex]};
  
  updatedAuthorityLevel.filterGroups = updatedAuthorityLevel.filterGroups.map(group => {
    const filterIndex = group.filters.findIndex(f => String(f.id) === String(filterId));
    
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
    console.log('Filter not found'); // Debug log
    return NextResponse.json(
      { error: 'Filter not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  mockAuthorityLevels[authorityLevelIndex] = updatedAuthorityLevel;
  console.log('Updated authority level:', updatedAuthorityLevel); // Debug log
  
  return NextResponse.json({ 
    success: true,
    authorityLevel: updatedAuthorityLevel
  });
}

// DELETE a filter
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; filterId: string } }
) {
  console.log('DELETE filter called with params:', params); // Debug log
  
  const id = params.id;
  const filterId = params.filterId;
  
  // Make sure we're comparing strings
  const authorityLevelIndex = mockAuthorityLevels.findIndex(p => String(p.id) === String(id));
  console.log('Found authority level index:', authorityLevelIndex); // Debug log
  
  if (authorityLevelIndex === -1) {
    console.log('Authority level not found'); // Debug log
    return NextResponse.json(
      { error: 'Authority level not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Find and remove the filter from any group
  let filterFound = false;
  let updatedAuthorityLevel = {...mockAuthorityLevels[authorityLevelIndex]};
  
  updatedAuthorityLevel.filterGroups = updatedAuthorityLevel.filterGroups.map(group => {
    const filterIndex = group.filters.findIndex(f => String(f.id) === String(filterId));
    
    if (filterIndex !== -1) {
      filterFound = true;
      group.filters.splice(filterIndex, 1);
    }
    
    return group;
  });
  
  // Remove empty groups
  updatedAuthorityLevel.filterGroups = updatedAuthorityLevel.filterGroups.filter(
    group => group.filters.length > 0
  );
  
  if (!filterFound) {
    console.log('Filter not found'); // Debug log
    return NextResponse.json(
      { error: 'Filter not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  mockAuthorityLevels[authorityLevelIndex] = updatedAuthorityLevel;
  console.log('Updated authority level:', updatedAuthorityLevel); // Debug log
  
  return NextResponse.json({ 
    success: true,
    authorityLevel: updatedAuthorityLevel
  });
} 