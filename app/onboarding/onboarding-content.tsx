'use client';

import { useState, createContext, useEffect } from 'react';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Create a context to store form data across steps
export const OnboardingContext = createContext<{
  formData: Record<string, any>;
  updateFormData: (step: number, data: any) => void;
  currentStep: number;
  validateRequiredFields: () => boolean;
}>({
  formData: {},
  updateFormData: () => {},
  currentStep: 0,
  validateRequiredFields: () => true
});

export function OnboardingContent({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  
  const steps = ['Company profile', 'Personas', 'Authority levels', 'Invite users'];
  const stepPaths = ['onboarding', 'onboarding/personas', 'onboarding/authority-levels', 'onboarding/invite-users'];
  
  // Check if we're on the success page
  const isSuccessPage = pathname === '/onboarding/success';
  
  // Calculate completion percentage - 100% on success page
  const completionPercentage = isSuccessPage ? 100 : currentStep * 25;

  // Update form data for a specific step
  const updateFormData = (step: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  // Validate required fields in the current form
  const validateRequiredFields = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (!form) return true; // No form to validate
    
    // Find all required inputs
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    // Check if all required fields have values
    let isValid = true;
    let firstInvalidField: HTMLElement | null = null;
    
    requiredInputs.forEach((input) => {
      const element = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!element.value.trim()) {
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = element;
        }
      }
    });
    
    // Focus the first invalid field and show error message
    if (!isValid && firstInvalidField) {
      firstInvalidField.focus();
      setValidationError('Please fill in all required fields before proceeding.');
      setTimeout(() => setValidationError(''), 2500); // Clear error after 5 seconds
    } else {
      setValidationError('');
    }
    
    return isValid;
  };

  // Navigate to next step
  const goToNextStep = () => {
    // Validate required fields
    if (!validateRequiredFields()) {
      return;
    }
    
    // Collect form data from current step
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      const stepData = Object.fromEntries(formData.entries());
      updateFormData(currentStep, stepData);
    }
    
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      router.push(`/${stepPaths[nextStep]}`);
    }
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    // Collect form data from current step (even if incomplete)
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      const stepData = Object.fromEntries(formData.entries());
      updateFormData(currentStep, stepData);
    }
    
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
      router.push(`/${stepPaths[prevStep]}`);
    }
  };
  
  // Handle finish button click
  const handleFinish = async () => {
    // Validate required fields
    if (!validateRequiredFields()) {
      return;
    }
    
    // Collect form data from final step
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      const stepData = Object.fromEntries(formData.entries());
      updateFormData(currentStep, stepData);
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit all collected data
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit onboarding data');
      }
      
      // Redirect to success page
      router.push('/onboarding/success');
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      alert('There was an error submitting your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingContext.Provider value={{ formData, updateFormData, currentStep, validateRequiredFields }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-300">Onboarding</h1>
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">{completionPercentage}% Complete</span>
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <div className={`w-4 h-4 rounded-full ${completionPercentage === 100 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                isSuccessPage || index < currentStep ? 'bg-green-500 text-white' : 
                index === currentStep ? 'border-2 border-blue-500' : 'border-2 border-gray-400'
              }`}>
                {(isSuccessPage || index < currentStep) && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`${index === currentStep && !isSuccessPage ? 'text-white' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>
        
        <div className="col-span-3 bg-gray-900 p-6 rounded-lg">
          {validationError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
              {validationError}
            </div>
          )}
          
          {children}
          
          {!isSuccessPage && (
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button 
                  type="button"
                  onClick={goToPrevStep}
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800"
                >
                  Go back
                </button>
              ) : (
                <div></div>
              )}
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-800"
                >
                  Skip
                </button>
                
                {currentStep < 3 ? (
                  <button 
                    type="button"
                    onClick={goToNextStep}
                    className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                  >
                    Next →
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Finish →'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </OnboardingContext.Provider>
  );
}