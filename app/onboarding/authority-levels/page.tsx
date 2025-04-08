'use client';

import { useState, useContext, useEffect } from 'react';
import { OnboardingContext } from '../onboarding-content';

// Define types for our data structures
type FilterOperator = 'Contains' | 'Equals' | 'Starts with' | 'Ends with';

type AuthorityFilter = {
  id: string;
  type: string;
  operator: FilterOperator;
  value: string;
};

type FilterGroup = {
  id: string;
  filters: AuthorityFilter[];
  operator: 'AND' | 'OR';
};

type AuthorityLevel = {
  id: string;
  title: string;
  key: string;
  contacts: string;
  filterGroups: FilterGroup[];
};

export default function AuthorityLevelsPage() {
  const [selectedAuthorityLevel, setSelectedAuthorityLevel] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [filterType, setFilterType] = useState('Title');
  const [filterOperator, setFilterOperator] = useState<FilterOperator>('Contains');
  const [filterValue, setFilterValue] = useState('');
  const [editingFilter, setEditingFilter] = useState<AuthorityFilter | null>(null);
  const [authorityLevels, setAuthorityLevels] = useState<AuthorityLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isNewAuthority, setIsNewAuthority] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localAuthority, setLocalAuthority] = useState<AuthorityLevel | null>(null);

  // Add a function to set errors with auto-dismissal
  const showError = (message: string, duration = 2550) => {
    setError(message);
    
    // Clear the error after the specified duration
    const timer = setTimeout(() => {
      setError(null);
    }, duration * 1000);
    
    // Clean up the timer if component unmounts or error changes
    return () => clearTimeout(timer);
  };
  
  // Add a function to show success messages with auto-dismissal
  const showSuccessAuth = (message: string, duration = 3) => {
    console.log('Showing success message:', message);
    setSuccessMessage(message);
    
    // Clear the success message after the specified duration
    const timer = setTimeout(() => {
      console.log('Clearing success message');
      setSuccessMessage(null);
    }, duration * 1000);
    
    // Clean up the timer if component unmounts or message changes
    return () => clearTimeout(timer);
  };
  
  // Get the currently selected authority level object
  const currentAuthorityLevel = localAuthority || authorityLevels.find(p => p.id === selectedAuthorityLevel);
  
  // Fetch authority levels from API
  useEffect(() => {
    async function fetchAuthorityLevels() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/authority-levels');
        if (!response.ok) {
          throw new Error('Failed to fetch authority levels');
        }
        const data = await response.json();
        setAuthorityLevels(data.authorityLevels);
      } catch (err) {
        setError('Error loading authority levels. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAuthorityLevels();
  }, []);
  
  // Handle authority level selection
  const handleAuthorityLevelClick = (authorityLevelId: string) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Discard them?')) {
        return;
      }
    }

    if (selectedAuthorityLevel === authorityLevelId) {
      setSelectedAuthorityLevel(null); // Close if already selected
      setLocalAuthority(null);
      setIsNewAuthority(false);
      setHasUnsavedChanges(false);
    } else {
      setSelectedAuthorityLevel(authorityLevelId);
      setIsNewAuthority(false);
      setHasUnsavedChanges(false);
      
      
      // Find the authority level
      const authorityLevel = authorityLevels.find(p => p.id === authorityLevelId);
      if (authorityLevel) {
        setTitle(authorityLevel.title);
        setKey(authorityLevel.key);
        setLocalAuthority(JSON.parse(JSON.stringify(authorityLevel)));
      }
      
      // Reset filter form
      setFilterType('Title');
      setFilterOperator('Contains');
      setFilterValue('');
      setEditingFilter(null);
      
      // Select the first group by default if any exist
      if (authorityLevel && authorityLevel.filterGroups.length > 0) {
        setSelectedGroupId(authorityLevel.filterGroups[0].id);
      } else {
        setSelectedGroupId(null);
      }
    }
  };
  
  // Add a function to generate random contacts
  const generateRandomContacts = () => {
    return Math.floor(Math.random() * 1000).toString();
  };

  // Create new authority level
  const handleCreateAuthority = async () => {
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Discard them?')) {
        return;
      }
    }
    
    // Generate a temporary ID for the new authority level
    const tempId = Date.now().toString();
    
    // Generate random contacts
    const randomContacts = generateRandomContacts();
    
    // Create a new local authority level
    const newAuthorityLevel = {
      id: tempId,
      title: 'New Authority Level',
      key: 'new_authority_level',
      contacts: randomContacts,
      filterGroups: [] // Make sure filterGroups is initialized as an empty array
    };
    
    // Set up the new authority level in the UI without sending to the API yet
    setSelectedAuthorityLevel(tempId);
    setTitle(newAuthorityLevel.title);
    setKey(newAuthorityLevel.key);
    setFilterType('Title');
    setFilterOperator('Contains');
    setFilterValue('');
    setEditingFilter(null);
    setSelectedGroupId(null);
    setIsNewAuthority(true);
    setLocalAuthority(newAuthorityLevel);
    setHasUnsavedChanges(true);
  };

  // Update local persona title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (localAuthority) {
      setLocalAuthority({
        ...localAuthority,
        title: newTitle
      });
      setHasUnsavedChanges(true);
    }
  };
  
  // Update local persona key
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setKey(newKey);
    
    if (localAuthority) {
      setLocalAuthority({
        ...localAuthority,
        key: newKey
      });
      setHasUnsavedChanges(true);
    }
  };
  // Add a filter group locally
  const handleAddFilterGroupAuth = () => {
    if (!localAuthority) return;
    
    const newGroup = {
      id: Date.now().toString(),
      filters: [],
      operator: 'AND' as const
    };
    
    setLocalAuthority({
      ...localAuthority,
      filterGroups: [...localAuthority.filterGroups, newGroup]
    });
    
    setSelectedGroupId(newGroup.id);
    setHasUnsavedChanges(true);
  };
  // Change a group's operator locally
  const handleChangeGroupOperatorAuth = (groupId: string, operator: 'AND' | 'OR') => {
    if (!localAuthority) return;
    
    setLocalAuthority({
      ...localAuthority,
      filterGroups: localAuthority.filterGroups.map(group => 
        group.id === groupId ? { ...group, operator } : group
      )
    });
    
    setHasUnsavedChanges(true);
  };
  
  // Delete authority level
  const handleDeleteFilterGroup = (groupId: string) => {
    if (!localAuthority) return;
    
    setLocalAuthority({
      ...localAuthority,
      filterGroups: localAuthority.filterGroups.filter(group => group.id !== groupId)
    });
    
    if (selectedGroupId === groupId) {
      // Select another group if available
      if (localAuthority.filterGroups.length > 1) {
        const remainingGroups = localAuthority.filterGroups.filter(g => g.id !== groupId);
        setSelectedGroupId(remainingGroups[0].id);
      } else {
        setSelectedGroupId(null);
      }
    }
    
    setHasUnsavedChanges(true);
  };
  
  // Add a new filter group (AND or OR)
  const handleAddFilterAuth = () => {
    if (!localAuthority || !selectedGroupId || !filterValue.trim()) return;
    
    const newFilter = {
      id: Date.now().toString(),
      type: filterType,
      operator: filterOperator,
      value: filterValue
    };
    
    setLocalAuthority({
      ...localAuthority,
      filterGroups: localAuthority.filterGroups.map(group => 
        group.id === selectedGroupId 
          ? { ...group, filters: [...group.filters, newFilter] } 
          : group
      )
    });
    
    // Reset filter form
    setFilterValue('');
    setHasUnsavedChanges(true);
  };

  // Update a filter locally
  const handleUpdateFilterAuth = () => {
    if (!localAuthority || !selectedGroupId || !editingFilter || !filterValue.trim()) return;
    
    const updatedFilter = {
      ...editingFilter,
      type: filterType,
      operator: filterOperator,
      value: filterValue
    };
    
    setLocalAuthority({
      ...localAuthority,
      filterGroups: localAuthority.filterGroups.map(group => 
        group.id === selectedGroupId 
          ? { 
              ...group, 
              filters: group.filters.map(f => 
                f.id === editingFilter.id ? updatedFilter : f
              ) 
            } 
          : group
      )
    });

    // Reset filter form
    setFilterType('Title');
    setFilterOperator('Contains');
    setFilterValue('');
    setEditingFilter(null);
    setHasUnsavedChanges(true);
  };
  
    // Delete a filter locally
  const handleDeleteFilterAuth = (filterId: string) => {
    if (!localAuthority || !selectedGroupId) return;
    
    setLocalAuthority({
      ...localAuthority,
      filterGroups: localAuthority.filterGroups.map(group => 
        group.id === selectedGroupId 
          ? { 
              ...group, 
              filters: group.filters.filter(f => f.id !== filterId) 
            } 
          : group
      )
    });
    
    setHasUnsavedChanges(true);
  };
  
  // Edit a filter
  const handleEditFilter = (filter:AuthorityFilter) => {
    setFilterType(filter.type);
    setFilterOperator(filter.operator);
    setFilterValue(filter.value);
    setEditingFilter(filter);
  };
  
  // Submit persona (create or update)
  const handleSubmitAuthority= async () => {
    if (!localAuthority || !title.trim() || !key.trim()) {
      showError('Title and Key are required fields.');
      return;
    }
    
    try {
      // Make sure the localPersona has the latest title and key
      const updatedPersona = {
        ...localAuthority,
        title: title,
        key: key
      };
      
      console.log('Submitting persona with data:', JSON.stringify(updatedPersona));
      
      let response;
      let successMsg;
      
      if (isNewAuthority) {
        // Create a new persona in the API with all data including filter groups
        console.log('Creating new persona with complete data');
        response = await fetch('/api/personas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPersona),
        });
        successMsg = 'Persona created successfully!';
      } else {
        // Update existing persona with all data including filter groups
        console.log(`Updating persona ${selectedAuthorityLevel} with full data:`, JSON.stringify(updatedPersona));
        response = await fetch(`/api/personas/${selectedAuthorityLevel}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPersona),
        });
        successMsg = 'Changes applied successfully!';
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', errorData, response.status, response.statusText);
        throw new Error(`Failed to ${isNewAuthority ? 'create' : 'update'} persona: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      // Update personas state
      if (isNewAuthority) {
        // Replace the temporary persona with the real one from the API
        setAuthorityLevels(prevAuthorityLevel => {
          // Remove the temporary persona and add the real one
          const filteredPersonas = prevAuthorityLevel.filter(p => p.id !== selectedAuthorityLevel);
          return [...filteredPersonas, data.persona];
        });
        
        // Update selected persona to the new ID from the API
        setSelectedAuthorityLevel(data.persona.id);
        setLocalAuthority(data.persona);
        setIsNewAuthority(false);
        // setNewAuthority(null);
      } else {
        // Update the existing persona
        setAuthorityLevels(prevAuth => prevAuth.map(p => 
          p.id === selectedAuthorityLevel ? data.persona : p
        ));
        setLocalAuthority(data.persona);
      }
      
      setHasUnsavedChanges(false);
      setSelectedAuthorityLevel(null);
      setLocalAuthority(null);
      // Show success message
      showSuccess(successMsg);
    } catch (err) {
      console.error('Error in handleSubmitAuthority:', err);
      showError(`Error ${isNewAuthority ? 'creating' : 'updating'} persona. Please try again.`);
    }
  };

  // Delete persona
  const handleDeleteAuthority = async () => {
    if (!selectedAuthorityLevel) return;
    
    if (!confirm('Are you sure you want to delete this persona?')) {
      return;
    }
    
    try {
      // If it's a new persona that hasn't been saved yet, just remove it from the UI
      if (isNewAuthority) {
        setAuthorityLevels(authorityLevels.filter(p => p.id !== selectedAuthorityLevel));
        setSelectedAuthorityLevel(null);
        setLocalAuthority(null);
        setIsNewAuthority(false);
        // setNewA(null);
        setHasUnsavedChanges(false);
        showSuccess('Persona removed');
        return;
      }
      
      // Otherwise, delete from the API
      const response = await fetch(`/api/personas/${selectedAuthorityLevel}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete persona');
      }
      
      setAuthorityLevels(authorityLevels.filter(p => p.id !== selectedAuthorityLevel));
      setSelectedAuthorityLevel(null);
      setLocalAuthority(null);
      setHasUnsavedChanges(false);
      showSuccess('Persona deleted successfully!');
    } catch (err) {
      showError('Error deleting persona. Please try again.');
      console.error(err);
    }
  };
  
  // Add a function to show success messages with auto-dismissal
  const showSuccess = (message: string, duration = 3) => {
    console.log('Showing success message:', message);
    setSuccessMessage(message);
    
    // Clear the success message after the specified duration
    const timer = setTimeout(() => {
      console.log('Clearing success message');
      setSuccessMessage(null);
    }, duration * 1000);
    
    // Clean up the timer if component unmounts or message changes
    return () => clearTimeout(timer);
  };
  
  return (
    <form className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Authority levels</h2>
      <p className="mb-6 text-gray-400">You will be able to filter Pursuit data by Authority levels</p>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-900/30 border border-green-500 text-white p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="bg-yellow-900/30 border border-yellow-500 text-white p-3 rounded mb-4">
          You have unsaved changes. Click "Submit" or "Apply changes" to save them.
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {/* Left column - Create authority level button */}
        <div className="space-y-4">
          <button 
            type="button"
            onClick={handleCreateAuthority}
            className="w-full px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
          >
            + Create new authority level
          </button>
        </div>
        
        {/* Authority levels list and details in a two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Authority levels list */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-400">Authority levels ({authorityLevels.length})</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {authorityLevels.map(authorityLevel => (
                <div 
                  key={authorityLevel.id}
                  onClick={() => handleAuthorityLevelClick(authorityLevel.id)}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                    selectedAuthorityLevel === authorityLevel.id ? 'bg-blue-900/30 border border-blue-500' : 'hover:bg-gray-800'
                  }`}
                >
                  <div>
                    <div className="font-medium">{authorityLevel.title}</div>
                    <div className="text-xs text-gray-400">{authorityLevel.contacts} Contacts found</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          
          {/* Item settings - only shown when an authority level is selected */}
          {currentAuthorityLevel && (
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Item settings</h3>
                <div className="text-sm text-gray-400">
                  {currentAuthorityLevel.contacts} Contacts meet criteria
                </div>
              </div>
              
              <div className="space-y-4 border border-gray-700 rounded p-4">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full p-2 rounded border border-gray-700 bg-gray-900"
                    placeholder="Authority Level"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Assign a title to this custom filter
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Key</label>
                  <input 
                    type="text" 
                    value={key}
                    onChange={handleKeyChange}
                    className="w-full p-2 rounded border border-gray-700 bg-gray-900"
                    placeholder="authority_level"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Key field that will appear in your connected CRM
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Filters</label>
                    <div className="text-xs text-gray-400">
                      Choose the filters you want to apply
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <div className="flex gap-2">
                      <select
                        value={selectedGroupId || ''}
                        onChange={(e) => setSelectedGroupId(e.target.value || null)}
                        className="p-1 text-sm bg-gray-800 border border-gray-700 rounded"
                        disabled={currentAuthorityLevel.filterGroups.length === 0}
                      >
                        {currentAuthorityLevel.filterGroups.length === 0 ? (
                          <option value="">No groups</option>
                        ) : (
                          <>
                            <option value="">Select group</option>
                            {currentAuthorityLevel.filterGroups.map((group, index) => (
                              <option key={group.id} value={group.id}>
                                Group {index + 1} ({group.operator})
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddFilterGroupAuth}
                        className="px-2 py-1 text-xs bg-gray-700 rounded text-white hover:bg-gray-600"
                      >
                        + OR Group
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleAddFilterGroupAuth}
                        className="px-2 py-1 text-xs bg-gray-700 rounded text-white hover:bg-gray-600"
                      >
                        + AND Group
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full p-2 rounded border border-gray-700 bg-gray-900"
                    >
                      <option value="Title">Title</option>
                    </select>
                    
                    <select
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value as FilterOperator)}
                      className="w-full p-2 rounded border border-gray-700 bg-gray-900"
                    >
                      <option value="Contains">Contains</option>
                      <option value="Equals">Equals</option>
                      <option value="Starts with">Starts with</option>
                      <option value="Ends with">Ends with</option>
                    </select>
                    
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="Type and hit enter..."
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="flex-1 p-2 rounded-l border border-gray-700 bg-gray-900"
                      />
                      
                      {editingFilter ? (
                        <button 
                          type="button"
                          onClick={handleUpdateFilterAuth}
                          disabled={!filterValue.trim()}
                          className="px-3 bg-blue-600 rounded-r text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Update
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleAddFilterAuth}
                          disabled={!filterValue.trim()}
                          className="px-3 bg-blue-600 rounded-r text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {editingFilter && (
                    <div className="flex justify-end mb-3">
                      <button 
                        type="button"
                        onClick={() => setEditingFilter(null)}
                        className="px-3 py-1 text-sm text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Display filter groups */}
                <div className="mt-4 space-y-4">
                  {currentAuthorityLevel.filterGroups.map((group, groupIndex) => (
                    <div key={group.id} className={`border rounded p-3 ${
                      selectedGroupId === group.id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Group {groupIndex + 1}</span>
                          <select
                            value={group.operator}
                            onChange={(e) =>  setSelectedGroupId(group.id)}
                            className="text-xs p-1 bg-gray-700 rounded border border-gray-600"
                          >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedGroupId(group.id)}
                            className="p-1 text-gray-400 hover:text-white"
                            title="Select group"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteFilterGroup(group.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                            title="Delete group"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {group.filters.length > 0 ? (
                          group.filters.map((filter, filterIndex) => (
                            <div key={filter.id} className="flex items-center gap-1 text-sm">
                              <span className="bg-gray-700 px-2 py-1 rounded flex-1">
                                {filter.type} {filter.operator} "{filter.value}"
                              </span>
                              
                              {filterIndex < group.filters.length - 1 && (
                                <span className="text-gray-400">{group.operator}</span>
                              )}
                              
                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => handleEditFilter(filter)}
                                  className="p-1 text-gray-400 hover:text-white"
                                  title="Edit filter"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFilterAuth(filter.id)}
                                  className="p-1 text-gray-400 hover:text-red-400"
                                  title="Delete filter"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm italic">No filters in this group. Add a filter above.</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {currentAuthorityLevel.filterGroups.length === 0 && (
                    <p className="text-gray-400 text-sm italic">No filter groups. Add a filter or group to get started.</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={handleDeleteAuthority}
                  className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
                >
                  Delete authority level
                </button>
                
                <button 
                  type="button"
                  onClick={handleSubmitAuthority}
                  className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                >
                  Apply changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
} 