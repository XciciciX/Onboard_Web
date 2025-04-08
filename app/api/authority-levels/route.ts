import { NextResponse } from 'next/server';

export type FilterOperator = 'Contains' | 'Equals' | 'Starts with' | 'Ends with';

export type AuthorityFilter = {
  id: string;
  type: string;
  operator: FilterOperator;
  value: string;
};

export type FilterGroup = {
  id: string;
  filters: AuthorityFilter[];
  operator: 'AND' | 'OR';
};

export type AuthorityLevel = {
  id: string;
  title: string;
  key: string;
  contacts: string;
  filterGroups: FilterGroup[];
};

// Helper function to generate a random number of contacts
function generateContactCount(): string {
  // Generate a random number between 10,000 and 500,000
  const count = Math.floor(Math.random() * 490000) + 10000;
  // Format with commas
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Mock database for authority levels
export const mockAuthorityLevels: AuthorityLevel[] = [
  {
    id: '1',
    title: 'C Level', 
    key: 'c_level',
    contacts: generateContactCount(),
    filterGroups: [
      {
        id: 'fg1',
        operator: 'OR',
        filters: [
          { id: 'f1', type: 'Title', operator: 'Contains', value: 'CEO' },
          { id: 'f2', type: 'Title', operator: 'Contains', value: 'CTO' },
          { id: 'f3', type: 'Title', operator: 'Contains', value: 'CFO' },
          { id: 'f4', type: 'Title', operator: 'Contains', value: 'CIO' },
          { id: 'f5', type: 'Title', operator: 'Contains', value: 'CISO' },
          { id: 'f6', type: 'Title', operator: 'Contains', value: 'Chief' },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Director', 
    key: 'director',
    contacts: generateContactCount(),
    filterGroups: [
      {
        id: 'fg2',
        operator: 'OR',
        filters: [
          { id: 'f7', type: 'Title', operator: 'Contains', value: 'Director' },
          { id: 'f8', type: 'Title', operator: 'Contains', value: 'Head of' },
        ]
      }
    ]
  },
  { 
    id: '3',
    title: 'Manager', 
    key: 'manager',
    contacts: generateContactCount(),
    filterGroups: [
      {
        id: 'fg3',
        operator: 'OR',
        filters: [
          { id: 'f9', type: 'Title', operator: 'Contains', value: 'Manager' },
          { id: 'f10', type: 'Title', operator: 'Contains', value: 'Lead' },
        ]
      }
    ]
  },
  { id: '4', title: 'Individual Contributor', key: 'individual_contributor', contacts: generateContactCount(), filterGroups: [] },
  { id: '5', title: 'Gatekeeper', key: 'gatekeeper', contacts: generateContactCount(), filterGroups: [] },
];

// GET all authority levels
export async function GET() {
  try {
    return NextResponse.json({ authorityLevels: mockAuthorityLevels });
  } catch (error) {
    console.error('Error getting authority levels:', error);
    return NextResponse.json(
      { error: 'Failed to get authority levels' },
      { status: 500 }
    );
  }
}

// POST create a new authority level
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Creating new authority level with data:', JSON.stringify(data));
    
    // Create a new authority level with all provided data
    const newAuthorityLevel = {
      id: Date.now().toString(),
      title: data.title || 'New Authority Level',
      key: data.key || 'new_authority_level',
      contacts: data.contacts || generateContactCount(),
      filterGroups: data.filterGroups || []
    };
    
    mockAuthorityLevels.push(newAuthorityLevel);
    
    console.log(`Created new authority level: ${JSON.stringify(newAuthorityLevel)}`);
    return NextResponse.json({ authorityLevel: newAuthorityLevel });
  } catch (error) {
    console.error('Error creating authority level:', error);
    return NextResponse.json(
      { error: 'Failed to create authority level' },
      { status: 500 }
    );
  }
} 