'use client';

import { useState } from 'react';

export default function AuthorityLevelsPage() {
  const [authorityLevels, setAuthorityLevels] = useState([
    { title: 'C Level', contacts: '537,966' },
    { title: 'Director', contacts: '821,094' },
    { title: 'Manager', contacts: '312,398' },
    { title: 'Individual Contributor', contacts: '538,732' },
    { title: 'Gatekeeper', contacts: '34,206' }
  ]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Authority levels</h2>
      <p className="text-gray-400">You will be able to filter Pursuit data by Authority levels</p>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input 
            type="text" 
            placeholder="Authority Level"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          />
          <p className="text-xs text-gray-400 mt-1">Assign a title to this custom filter</p>
        </div>
        
        <div>
          <label className="block mb-1">Key</label>
          <input 
            type="text" 
            placeholder="authority_level"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          />
          <p className="text-xs text-gray-400 mt-1">Key field that will appear in your connected CRM</p>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Authority levels ({authorityLevels.length})</h3>
            <button className="text-blue-400 text-sm">+ Create new authority level</button>
          </div>
          
          <div className="space-y-2">
            {authorityLevels.map((level, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <span>{level.title}</span>
                <span className="text-gray-400 text-sm">{level.contacts} Contacts found →</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 p-2 bg-blue-600 rounded text-white">Create new authority level</button>
        </div>
      </div>
    </div>
  );
} 