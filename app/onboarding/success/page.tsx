'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
      <div className="pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-medium">Onboarding Complete!</h2>
        <p className="text-gray-400 mt-3 text-lg">Your Pursuit account has been successfully set up.</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-8">
        <h3 className="text-xl font-medium mb-4">What's Next?</h3>
        <p className="text-gray-300 mb-6">
          Now that your account is set up, you can start exploring opportunities that match your company profile.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Explore Opportunities</h4>
            <p className="text-sm text-gray-300">Browse through opportunities that match your company profile and filters.</p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Invite Team Members</h4>
            <p className="text-sm text-gray-300">Add colleagues to collaborate on opportunities and share insights.</p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Connect Your CRM</h4>
            <p className="text-sm text-gray-300">Integrate with your existing CRM to streamline your workflow.</p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Set Up Notifications</h4>
            <p className="text-sm text-gray-300">Configure alerts for new opportunities that match your criteria.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Link href="/" className="px-8 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 text-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
} 