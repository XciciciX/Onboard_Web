import { NextResponse } from 'next/server';
import { mockAuthorityLevels, AuthorityFilter } from '../../route';

// Helper function to generate a random number of contacts
function generateContactCount(): string {
  // Generate a random number between 10,000 and 500,000
  const count = Math.floor(Math.random() * 490000) + 10000;
  // Format with commas
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// POST add a new filter to an authority level
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('POST filters called with params:', params); // Debug log
  
  const id = params.id;
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
  
  // Validate required fields
  if (!data.type || !data.operator || !data.value) {
    console.log('Missing required fields'); // Debug log
    return NextResponse.json(
      { error: 'Type, operator, and value are required fields', showFor: 2500  },
      { status: 400 }
    );
  }
  
  // Create a new filter
  const newFilter: AuthorityFilter = {
    id: `f${Date.now()}`,
    type: data.type,
    operator: data.operator,
    value: data.value
  };
  
  console.log('Created new filter:', newFilter); // Debug log
  
  // If groupId is provided, add to that group
  if (data.groupId && data.groupId !== 'new') {
    const groupIndex = mockAuthorityLevels[authorityLevelIndex].filterGroups.findIndex(
      g => String(g.id) === String(data.groupId)
    );
    
    if (groupIndex === -1) {
      console.log('Filter group not found:', data.groupId); // Debug log
      return NextResponse.json(
        { error: 'Filter group not found', showFor: 2500  },
        { status: 404 }
      );
    }
    
    mockAuthorityLevels[authorityLevelIndex].filterGroups[groupIndex].filters.push(newFilter);
    console.log('Added filter to existing group'); // Debug log
  } 
  // If no groups exist or groupId is 'new', create a new group
  else if (mockAuthorityLevels[authorityLevelIndex].filterGroups.length === 0 || data.groupId === 'new') {
    const newGroup = {
      id: `fg${Date.now()}`,
      operator: 'OR',
      filters: [newFilter]
    };
    
    mockAuthorityLevels[authorityLevelIndex].filterGroups.push(newGroup);
    console.log('Created new group with filter'); // Debug log
  } 
  // Otherwise, add to the first group
  else {
    mockAuthorityLevels[authorityLevelIndex].filterGroups[0].filters.push(newFilter);
    console.log('Added filter to first group'); // Debug log
  }
  
  // Update contact count when filters change
  mockAuthorityLevels[authorityLevelIndex].contacts = generateContactCount();
  
  console.log('Updated authority level:', mockAuthorityLevels[authorityLevelIndex]); // Debug log
  
  return NextResponse.json({ 
    filter: newFilter,
    authorityLevel: mockAuthorityLevels[authorityLevelIndex]
  });
} 