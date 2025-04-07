'use client';

import { useState, useEffect } from 'react';
import { Filter } from '../api/filters/route';

export default function CompanyProfilePage() {
  const [companyName, setCompanyName] = useState('Pursuit');
  const [website, setWebsite] = useState('https://pursuit.com');
  const [industry, setIndustry] = useState('Construction');
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [targetPersonas, setTargetPersonas] = useState(['Education', 'HR', 'IT']);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Fetch keywords from the API
  useEffect(() => {
    async function fetchKeywords() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/filters?type=keyword');
        const data = await response.json();
        
        if (data.filters) {
          setKeywords(data.filters.map((filter: Filter) => filter.value));
          setApiStatus('success');
        }
      } catch (error) {
        console.error('Error fetching keywords:', error);
        setApiStatus('error');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchKeywords();
  }, []);
  
  // Add a new keyword
  const addKeyword = async (keyword: string) => {
    if (!keyword.trim()) return;
    
    setApiStatus('loading');
    try {
      const response = await fetch('/api/filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'keyword',
          value: keyword
        }),
      });
      
      const data = await response.json();
      
      if (data.filter) {
        setKeywords([...keywords, keyword]);
        setApiStatus('success');
      }
    } catch (error) {
      console.error('Error adding keyword:', error);
      setApiStatus('error');
    }
  };
  
  // Remove a keyword
  const removeKeyword = async (index: number) => {
    const keywordToRemove = keywords[index];
    
    // In a real app, you would need to find the ID of the keyword to delete
    // For this demo, we'll just update the local state
    setKeywords(keywords.filter((_, i) => i !== index));
  };
  
  return (
    <form className="space-y-6">
      <h2 className="text-xl font-medium">Company profile</h2>
      <p className="text-gray-400">Pursuit surfaces opportunities that are relevant to you, based on your Company Profile</p>
      
      <div className="space-y-6">
        <h3 className="font-medium">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Company name *</label>
            <input 
              type="text" 
              name="companyName"
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 bg-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Website *</label>
            <input 
              type="text" 
              name="website"
              value={website} 
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 bg-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Industry *</label>
            <input 
              type="text" 
              name="industry"
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 bg-gray-900"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Data profile</h3>
          <p className="text-gray-400">This information will be used to extract relevant data for your Radar feed</p>
          
          <div>
            <label className="block mb-1">Prompt *</label>
            <textarea 
              name="prompt"
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell us what you're looking for specifically, and the types of opportunities you'd like to find."
              className="w-full p-2 rounded border border-gray-700 bg-gray-900 h-32"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Keywords *</label>
            {isLoading ? (
              <div className="text-gray-400">Loading keywords...</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-2">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-900 rounded-full text-sm flex items-center">
                      {keyword}
                      <button 
                        type="button" // Important to prevent form submission
                        className="ml-1" 
                        onClick={() => removeKeyword(index)}
                        aria-label={`Remove ${keyword}`}
                      >
                        ×
                      </button>
                      <input type="hidden" name="keywords[]" value={keyword} />
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Type keyword and press enter"
                    className="flex-1 p-2 rounded-l border border-gray-700 bg-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        e.preventDefault(); // Prevent form submission
                        addKeyword(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button 
                    type="button" // Important to prevent form submission
                    className="bg-blue-600 px-4 rounded-r hover:bg-blue-700"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling as HTMLInputElement;
                      if (input.value) {
                        addKeyword(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                {apiStatus === 'error' && (
                  <p className="text-red-500 text-sm mt-1">
                    There was an error communicating with the API. Please try again.
                  </p>
                )}
              </>
            )}
          </div>
          
          <div>
            <label className="block mb-1">Target Personas</label>
            <p className="text-gray-400 text-sm mb-2">Select the personas you want to target. We'll find opportunities tailored to your selections</p>
            <div className="flex flex-wrap gap-2">
              {targetPersonas.map((persona, index) => (
                <span key={index} className="px-2 py-1 bg-blue-900 rounded-full text-sm flex items-center">
                  {persona}
                  <button 
                    type="button" // Important to prevent form submission
                    className="ml-1" 
                    onClick={() => setTargetPersonas(targetPersonas.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                  <input type="hidden" name="targetPersonas[]" value={persona} />
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">API for Accessing Filters</h4>
            <p className="text-gray-400 mb-4">Access your filters programmatically using our REST API</p>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-blue-400">GET /api/filters</h5>
                <p className="text-xs text-gray-400">Retrieve all filters or filter by type using query parameters</p>
                <pre className="mt-1 p-2 bg-gray-900 rounded text-xs overflow-x-auto">
                  GET /api/filters?type=keyword
                </pre>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-blue-400">POST /api/filters</h5>
                <p className="text-xs text-gray-400">Create a new filter</p>
                <pre className="mt-1 p-2 bg-gray-900 rounded text-xs overflow-x-auto">
{`POST /api/filters
Content-Type: application/json

{
  "type": "keyword",
  "value": "New keyword"
}`}
                </pre>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-blue-400">DELETE /api/filters</h5>
                <p className="text-xs text-gray-400">Remove a filter by ID</p>
                <pre className="mt-1 p-2 bg-gray-900 rounded text-xs overflow-x-auto">
                  DELETE /api/filters?id=7
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
} 