
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignInPage from '@/src/components/auth/SignInPage';
import SignUpPage from '@/src/components/auth/SignUpPage';
import Dashboard from '@/src/components/dashboard/Dashboard';
import { getCurrentUser } from '@/src/lib/auth';

export default function Home() {
  const [currentView, setCurrentView] = useState<'signin' | 'signup' | 'dashboard'>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('signin');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentView === 'dashboard' && isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (currentView === 'signup') {
    return (
      <SignUpPage
        onSuccess={handleAuthSuccess}
        onSwitchToSignIn={() => setCurrentView('signin')}
      />
    );
  }

  return (
    <SignInPage
      onSuccess={handleAuthSuccess}
      onSwitchToSignUp={() => setCurrentView('signup')}
    />
  );
}
