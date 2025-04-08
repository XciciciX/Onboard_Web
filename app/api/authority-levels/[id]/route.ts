import { NextResponse } from 'next/server';
import { AuthorityLevel, mockAuthorityLevels } from '../route';

// GET a specific authority level by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    console.log(`Processing GET request for authority level ID: ${id}`);
    
    const authorityLevel = mockAuthorityLevels.find(a => a.id === id);
    
    if (!authorityLevel) {
      console.log(`Authority level not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Authority level not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    console.log(`Found authority level: ${JSON.stringify(authorityLevel)}`);
    return NextResponse.json({ authorityLevel });
  } catch (error) {
    console.error('Error getting authority level:', error);
    return NextResponse.json(
      { error: 'Failed to get authority level' },
      { status: 500 }
    );
  }
}

// PUT update an authority level
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const data = await request.json();
    
    console.log(`Processing PUT request for authority level ID: ${id}`);
    console.log(`Request data:`, JSON.stringify(data));
    
    // Find the authority level by ID
    const authorityLevelIndex = mockAuthorityLevels.findIndex(a => a.id === id);
    
    if (authorityLevelIndex === -1) {
      console.log(`Authority level not found with ID: ${id}. Creating new authority level instead.`);
      
      // If authority level doesn't exist, create a new one with this ID
      const newAuthorityLevel = {
        id: id,
        title: data.title || 'New Authority Level',
        key: data.key || 'new_authority_level',
        contacts: data.contacts || generateContactCount(),
        filterGroups: data.filterGroups || []
      };
      
      mockAuthorityLevels.push(newAuthorityLevel);
      console.log(`Created new authority level: ${JSON.stringify(newAuthorityLevel)}`);
      return NextResponse.json({ authorityLevel: newAuthorityLevel });
    }
    
    // Update the entire authority level with the provided data
    const updatedAuthorityLevel = {
      ...mockAuthorityLevels[authorityLevelIndex],
      ...(data.title && { title: data.title }),
      ...(data.key && { key: data.key }),
      ...(data.contacts !== undefined && { contacts: data.contacts }),
      ...(data.filterGroups && { filterGroups: data.filterGroups })
    };
    
    mockAuthorityLevels[authorityLevelIndex] = updatedAuthorityLevel;
    
    console.log(`Successfully updated authority level: ${JSON.stringify(updatedAuthorityLevel)}`);
    return NextResponse.json({ authorityLevel: updatedAuthorityLevel });
  } catch (error) {
    console.error('Error updating authority level:', error);
    return NextResponse.json(
      { error: 'Failed to update authority level' },
      { status: 500 }
    );
  }
}

// DELETE an authority level
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    console.log(`Processing DELETE request for authority level ID: ${id}`);
    console.log(`Current mockAuthorityLevels:`, JSON.stringify(mockAuthorityLevels.map(a => ({ id: a.id, title: a.title }))));
    
    const authorityLevelIndex = mockAuthorityLevels.findIndex(a => a.id === id);
    
    if (authorityLevelIndex === -1) {
      console.log(`Authority level not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Authority level not found', showFor: 2500 },
        { status: 404 }
      );
    }
    
    const deletedAuthorityLevel = mockAuthorityLevels[authorityLevelIndex];
    mockAuthorityLevels.splice(authorityLevelIndex, 1);
    
    console.log(`Successfully deleted authority level: ${JSON.stringify(deletedAuthorityLevel)}`);
    return NextResponse.json({ success: true, deletedAuthorityLevel });
  } catch (error) {
    console.error('Error deleting authority level:', error);
    return NextResponse.json(
      { error: 'Failed to delete authority level' },
      { status: 500 }
    );
  }
} 