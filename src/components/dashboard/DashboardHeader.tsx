'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { Code2, Home, FileCode, History, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { signOut, type User } from '@/src/lib/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  user: User;
  currentView: string;
  onNavigate: (view: 'home' | 'new-review' | 'history' | 'profile') => void;
  onLogout: () => void;
}

export default function DashboardHeader({ user, currentView, onNavigate, onLogout }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    onLogout();
  };

  const handleNavigate = (view: 'home' | 'new-review' | 'history' | 'profile') => {
    onNavigate(view);
    setMobileMenuOpen(false); // close mobile menu
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo / App Name */}
        <div className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-primary" />
          <div
  className="font-bold text-xl cursor-pointer"
  onClick={() => onNavigate('home')} // make 'home' map to your dashboard
>
  AI Code Reviewer
</div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-2">
          <Button variant={currentView === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => handleNavigate('home')}>
            <Home className="h-4 w-4 mr-2" /> Home
          </Button>
          <Button variant={currentView === 'new-review' ? 'default' : 'ghost'} size="sm" onClick={() => handleNavigate('new-review')}>
            <FileCode className="h-4 w-4 mr-2" /> New Review
          </Button>
          <Button variant={currentView === 'history' ? 'default' : 'ghost'} size="sm" onClick={() => handleNavigate('history')}>
            <History className="h-4 w-4 mr-2" /> History
          </Button>
          <Button variant={currentView === 'profile' ? 'default' : 'ghost'} size="sm" onClick={() => handleNavigate('profile')}>
            <UserIcon className="h-4 w-4 mr-2" /> Profile
          </Button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>

          {/* Mobile Menu Toggle */}
          <Button className="md:hidden" variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t px-4 py-2 space-y-2">
          <Button variant={currentView === 'home' ? 'default' : 'ghost'} fullWidth onClick={() => handleNavigate('home')}>
            <Home className="h-4 w-4 mr-2" /> Home
          </Button>
          <Button variant={currentView === 'new-review' ? 'default' : 'ghost'} fullWidth onClick={() => handleNavigate('new-review')}>
            <FileCode className="h-4 w-4 mr-2" /> New Review
          </Button>
          <Button variant={currentView === 'history' ? 'default' : 'ghost'} fullWidth onClick={() => handleNavigate('history')}>
            <History className="h-4 w-4 mr-2" /> History
          </Button>
          <Button variant={currentView === 'profile' ? 'default' : 'ghost'} fullWidth onClick={() => handleNavigate('profile')}>
            <UserIcon className="h-4 w-4 mr-2" /> Profile
          </Button>
        </div>
      )}
    </header>
  );
}
