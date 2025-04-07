'use client';

import { useState } from 'react';

export default function PersonasPage() {
  const [personas, setPersonas] = useState([
    { title: 'Law Enforcement', contacts: '140,216' },
    { title: 'Fire and Rescue Services', contacts: '124,982' },
    { title: 'Finance', contacts: '217,447' },
    { title: 'Human Resources', contacts: '84,946' },
    { title: 'Economic Development', contacts: '37,999' },
    { title: 'Communications', contacts: '87,233' },
    { title: 'Utilities', contacts: '83,002' },
    { title: 'Administration', contacts: '540,662' },
    { title: 'Planning / Building', contacts: '185,670' },
    { title: 'Elected Officials', contacts: '504,532' },
    { title: 'Procurement', contacts: '92,012' }
  ]);
  
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  
  return (
    <form className="space-y-6">
      <h2 className="text-xl font-medium">Personas</h2>
      <p className="text-gray-400">You will be able to filter Pursuit data by Personas</p>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input 
            type="text" 
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Persona"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          />
          <p className="text-xs text-gray-400 mt-1">Assign a title to this custom filter</p>
        </div>
        
        <div>
          <label className="block mb-1">Key</label>
          <input 
            type="text" 
            name="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="persona"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          />
          <p className="text-xs text-gray-400 mt-1">Key field that will appear in your connected CRM</p>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Personas ({personas.length})</h3>
            <button type="button" className="text-blue-400 text-sm">+ Create new persona</button>
          </div>
          
          <div className="space-y-2">
            {personas.map((persona, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <span>{persona.title}</span>
                <span className="text-gray-400 text-sm">{persona.contacts} Contacts found →</span>
                <input type="hidden" name={`personas[${index}].title`} value={persona.title} />
                <input type="hidden" name={`personas[${index}].contacts`} value={persona.contacts} />
              </div>
            ))}
          </div>
          
          <button type="button" className="w-full mt-4 p-2 bg-blue-600 rounded text-white">Create new persona</button>
        </div>
      </div>
    </form>
  );
} 