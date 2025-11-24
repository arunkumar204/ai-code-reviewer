
'use client';

import { Button } from '@/src/components/ui/button';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { Code2, Home, FileCode, History, User as UserIcon, LogOut } from 'lucide-react';
import { signOut, type User } from '@/src/lib/auth';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  user: User;
  currentView: string;
  onNavigate: (view: 'home' | 'new-review' | 'history' | 'profile') => void;
  onLogout: () => void;
}

export default function DashboardHeader({ user, currentView, onNavigate, onLogout }: DashboardHeaderProps) {
  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    onLogout();
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">AI Code Reviewer</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('home')}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                variant={currentView === 'new-review' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('new-review')}
              >
                <FileCode className="h-4 w-4 mr-2" />
                New Review
              </Button>
              <Button
                variant={currentView === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('history')}
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('profile')}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
