'use client';

import { useState } from 'react';

export default function CompanyProfilePage() {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [description, setDescription] = useState('');
  
  return (
    <form className="space-y-6">
      <h2 className="text-xl font-medium">Company Profile</h2>
      <p className="text-gray-400">Tell us about your company</p>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="companyName"
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="Enter your company name"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          />
        </div>
        
        <div>
          <label className="block mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select 
            name="industry"
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          >
            <option value="">Select an industry</option>
            <option value="technology">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="construction">Construction</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">
            Company Size <span className="text-red-500">*</span>
          </label>
          <select 
            name="companySize"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">
            Website
          </label>
          <input 
            type="url" 
            name="website"
            value={website} 
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          />
        </div>
        
        <div>
          <label className="block mb-1">
            Company Description
          </label>
          <textarea 
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Brief description of your company and what you do"
            className="w-full p-2 rounded border border-gray-700 bg-gray-900"
          ></textarea>
        </div>
      </div>
    </form>
  );
} 