'use client';

import { useState } from 'react';

export default function InviteUsersPage() {
  const [users, setUsers] = useState([
    { email: 'admin@pursuit.us', role: 'Admin' },
    { email: '', role: 'User' }
  ]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Invite users</h2>
      <p className="text-gray-400">Add users to your workspace and select their role</p>
      
      <div className="space-y-4">
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 rounded text-white flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload .csv
          </button>
        </div>
        
        <div>
          <div className="grid grid-cols-5 gap-4 mb-2">
            <div className="col-span-3">
              <label className="block mb-1">Work email *</label>
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Role</label>
            </div>
          </div>
          
          {users.map((user, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 mb-2">
              <div className="col-span-3">
                <input 
                  type="email" 
                  value={user.email} 
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].email = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Enter work email"
                  className="w-full p-2 rounded border border-gray-700 bg-gray-900"
                />
              </div>
              <div className="col-span-2 flex items-center">
                <select 
                  value={user.role} 
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].role = e.target.value;
                    setUsers(newUsers);
                  }}
                  className="w-full p-2 rounded border border-gray-700 bg-gray-900"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
                {index > 0 && (
                  <button 
                    className="ml-2 text-gray-400 hover:text-gray-200"
                    onClick={() => setUsers(users.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button 
            className="mt-2 text-blue-400 flex items-center"
            onClick={() => setUsers([...users, { email: '', role: 'User' }])}
          >
            + Add new user
          </button>
        </div>
      </div>
    </div>
  );
} 