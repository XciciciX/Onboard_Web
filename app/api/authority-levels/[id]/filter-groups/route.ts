import { NextResponse } from 'next/server';
import { mockAuthorityLevels, FilterGroup } from '../../route';

// POST create a new filter group for an authority level
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await request.json();
  const authorityLevelIndex = mockAuthorityLevels.findIndex(p => p.id === id);
  
  if (authorityLevelIndex === -1) {
    return NextResponse.json(
      { error: 'Authority level not found', showFor: 2500  },
      { status: 404 }
    );
  }
  
  // Validate required fields
  if (!data.operator || !['AND', 'OR'].includes(data.operator)) {
    return NextResponse.json(
      { error: 'Valid operator (AND or OR) is required', showFor: 2500  },
      { status: 400 }
    );
  }
  
  // Create a new filter group
  const newFilterGroup: FilterGroup = {
    id: `fg${Date.now()}`,
    operator: data.operator,
    filters: []
  };
  
  mockAuthorityLevels[authorityLevelIndex].filterGroups.push(newFilterGroup);
  
  return NextResponse.json({ 
    filterGroup: newFilterGroup,
    authorityLevel: mockAuthorityLevels[authorityLevelIndex]
  });
} 