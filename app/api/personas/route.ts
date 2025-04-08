import { NextResponse } from 'next/server';

export type FilterOperator = 'Contains' | 'Equals' | 'Starts with' | 'Ends with';

export type PersonaFilter = {
  id: string;
  type: string;
  operator: FilterOperator;
  value: string;
};

export type FilterGroup = {
  id: string;
  filters: PersonaFilter[];
  operator: 'AND' | 'OR';
};

export type Persona = {
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

// Mock database for personas
export const mockPersonas: Persona[] = [
  { 
    id: '1',
    title: 'Law Enforcement', 
    key: 'law_enforcement',
    contacts: generateContactCount(),
    filterGroups: [
      {
        id: 'fg1',
        operator: 'OR',
        filters: [
          { id: 'f1', type: 'Title', operator: 'Contains', value: 'Police Chief' },
          { id: 'f2', type: 'Title', operator: 'Contains', value: 'Detective' },
          { id: 'f3', type: 'Title', operator: 'Contains', value: 'Police' },
          { id: 'f4', type: 'Title', operator: 'Contains', value: 'Marshal' },
          { id: 'f5', type: 'Title', operator: 'Contains', value: 'Sheriff' },
          { id: 'f6', type: 'Title', operator: 'Contains', value: 'Police Services' },
        ]
      },
      {
        id: 'fg2',
        operator: 'AND',
        filters: [
          { id: 'f7', type: 'Department', operator: 'Contains', value: 'Department' }
        ]
      }
    ]
  },
  { 
    id: '2',
    title: 'Fire and Rescue Services', 
    key: 'fire_rescue',
    contacts: generateContactCount(),
    filterGroups: [
      {
        id: 'fg3',
        operator: 'OR',
        filters: [
          { id: 'f8', type: 'Title', operator: 'Contains', value: 'Fire Chief' },
          { id: 'f9', type: 'Title', operator: 'Contains', value: 'Firefighter' },
          { id: 'f10', type: 'Title', operator: 'Contains', value: 'Fire Marshal' },
        ]
      }
    ]
  },
  { id: '3', title: 'Finance', key: 'finance', contacts: generateContactCount(), filterGroups: [] },
  { id: '4', title: 'Human Resources', key: 'hr', contacts: generateContactCount(), filterGroups: [] },
  { id: '5', title: 'Economic Development', key: 'economic_dev', contacts: generateContactCount(), filterGroups: [] },
  { id: '6', title: 'Communications', key: 'communications', contacts: generateContactCount(), filterGroups: [] },
  { id: '7', title: 'Utilities', key: 'utilities', contacts: generateContactCount(), filterGroups: [] },
  { id: '8', title: 'Administration', key: 'admin', contacts: generateContactCount(), filterGroups: [] },
  { id: '9', title: 'Planning / Building', key: 'planning', contacts: generateContactCount(), filterGroups: [] },
  { id: '10', title: 'Elected Officials', key: 'elected', contacts: generateContactCount(), filterGroups: [] },
  { id: '11', title: 'Procurement', key: 'procurement', contacts: generateContactCount(), filterGroups: [] }
];

// GET all personas
export async function GET() {
  return NextResponse.json({ personas: mockPersonas });
}

// POST create a new persona
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Creating new persona with data:', JSON.stringify(data));
    
    // Create a new persona with all provided data
    const newPersona = {
      id: Date.now().toString(),
      title: data.title || 'New Persona',
      key: data.key || 'new_persona',
      contacts: data.contacts || Math.floor(Math.random() * 1000).toString(),
      filterGroups: data.filterGroups || []
    };
    
    mockPersonas.push(newPersona);
    
    console.log(`Created new persona: ${JSON.stringify(newPersona)}`);
    return NextResponse.json({ persona: newPersona });
  } catch (error) {
    console.error('Error creating persona:', error);
    return NextResponse.json(
      { error: 'Failed to create persona' },
      { status: 500 }
    );
  }
} 