import { NextResponse } from 'next/server';
import { mockAuthorityLevels } from '../../../route';

// PUT update a filter group
export async function PUT(
  request: Request,
  { params }: { params: { id: string; groupId: string } }
) {
  console.log('PUT filter-group called with params:', params); // Debug log
  
  const id = params.id;
  const groupId = params.groupId;
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
  
  // Make sure we're comparing strings
  const groupIndex = mockAuthorityLevels[authorityLevelIndex].filterGroups.findIndex(
    g => String(g.id) === String(groupId)
  );
  console.log('Found group index:', groupIndex); // Debug log
  
  if (groupIndex === -1) {
    console.log('Filter group not found'); // Debug log
    return NextResponse.json(
      { error: 'Filter group not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Validate operator
  if (data.operator && !['AND', 'OR'].includes(data.operator)) {
    console.log('Invalid operator:', data.operator); // Debug log
    return NextResponse.json(
      { error: 'Valid operator (AND or OR) is required', showFor: 2500  },
      { status: 400 }
    );
  }
  
  // Update the filter group
  mockAuthorityLevels[authorityLevelIndex].filterGroups[groupIndex] = {
    ...mockAuthorityLevels[authorityLevelIndex].filterGroups[groupIndex],
    ...(data.operator && { operator: data.operator }),
  };
  
  console.log('Updated filter group:', mockAuthorityLevels[authorityLevelIndex].filterGroups[groupIndex]); // Debug log
  
  return NextResponse.json({ 
    filterGroup: mockAuthorityLevels[authorityLevelIndex].filterGroups[groupIndex],
    authorityLevel: mockAuthorityLevels[authorityLevelIndex]
  });
}

// DELETE a filter group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; groupId: string } }
) {
  const id = params.id;
  const groupId = params.groupId;
  const authorityLevelIndex = mockAuthorityLevels.findIndex(p => p.id === id);
  
  if (authorityLevelIndex === -1) {
    return NextResponse.json(
      { error: 'Authority level not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  const groupIndex = mockAuthorityLevels[authorityLevelIndex].filterGroups.findIndex(
    g => g.id === groupId
  );
  
  if (groupIndex === -1) {
    return NextResponse.json(
      { error: 'Filter group not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Remove the filter group
  mockAuthorityLevels[authorityLevelIndex].filterGroups.splice(groupIndex, 1);
  
  return NextResponse.json({ 
    success: true,
    authorityLevel: mockAuthorityLevels[authorityLevelIndex]
  });
} 