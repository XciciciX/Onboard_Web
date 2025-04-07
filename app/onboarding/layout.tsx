import React from 'react';
import { OnboardingContent } from './onboarding-content';

const title = 'Onboarding';

export const metadata = {
  title,
  openGraph: {
    title,
    images: [`/api/og?title=${title}`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <OnboardingContent>{children}</OnboardingContent>
    </div>
  );
} 