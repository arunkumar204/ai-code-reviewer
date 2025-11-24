
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/src/lib/auth';
import { getUserReviews, type CodeReview } from '@/src/lib/code-review';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import CodeSubmissionForm from './CodeSubmissionForm';
import ReviewHistory from './ReviewHistory';
import ReviewDetail from './ReviewDetail';
import UserProfile from './UserProfile';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'home' | 'new-review' | 'history' | 'profile'>('home');
  const [selectedReview, setSelectedReview] = useState<CodeReview | null>(null);
  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    loadReviews();
  }, []); // Empty dependency array - only run once on mount

  const loadReviews = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userReviews = getUserReviews(currentUser.id);
      setReviews(userReviews);
    }
  };

  const handleReviewComplete = () => {
    loadReviews();
    setCurrentView('history');
  };

  const handleViewReview = (review: CodeReview) => {
    setSelectedReview(review);
  };

  const handleBackToHistory = () => {
    setSelectedReview(null);
    loadReviews();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={onLogout}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentView === 'home' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">
                Review your code with AI-powered analysis and get instant feedback
              </p>
            </div>
            
            <DashboardStats reviews={reviews} />
            
            <div className="grid gap-6 md:grid-cols-2">
              <div
                onClick={() => setCurrentView('new-review')}
                className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-accent/50 cursor-pointer transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">Start New Review</h3>
                <p className="text-muted-foreground">
                  Submit your code for AI-powered analysis and get detailed feedback
                </p>
              </div>
              
              <div
                onClick={() => setCurrentView('history')}
                className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-accent/50 cursor-pointer transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">View History</h3>
                <p className="text-muted-foreground">
                  Access your previous code reviews and track your progress
                </p>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'new-review' && (
          <CodeSubmissionForm
            userId={user.id}
            onComplete={handleReviewComplete}
            onCancel={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'history' && !selectedReview && (
          <ReviewHistory
            reviews={reviews}
            onViewReview={handleViewReview}
            onRefresh={loadReviews}
          />
        )}
        
        {currentView === 'history' && selectedReview && (
          <ReviewDetail
            review={selectedReview}
            onBack={handleBackToHistory}
            onDelete={handleBackToHistory}
          />
        )}
        
        {currentView === 'profile' && (
          <UserProfile user={user} />
        )}
      </main>
    </div>
  );
}
