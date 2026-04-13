/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { SearchMockup } from '@/components/sections/SearchMockup';
import { WhyArriveLink } from '@/components/sections/WhyArriveLink';
import { WaitlistForm } from '@/components/sections/WaitlistForm';
import { FAQ } from '@/components/sections/FAQ';
import { UserProfile } from '@/components/sections/UserProfile';
import { AppHome } from '@/components/sections/AppHome';
import { AdminDashboard } from '@/components/sections/AdminDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/context/AuthContext';

export default function App() {
  const { user, loading, isAdmin } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Simple routing
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Check if user has previously "entered" via waitlist in this session
  useEffect(() => {
    const entered = sessionStorage.getItem('arrivelink_entered');
    if (entered === 'true') {
      setHasEnteredApp(true);
    }
  }, []);

  const handleEnterApp = () => {
    setHasEnteredApp(true);
    sessionStorage.setItem('arrivelink_entered', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
          <p className="text-sm font-bold text-forest/40 uppercase tracking-widest">Loading ArriveLink...</p>
        </div>
      </div>
    );
  }

  // Admin Route
  if (currentPath === '/admin' && isAdmin) {
    return (
      <ErrorBoundary>
        <AdminDashboard />
      </ErrorBoundary>
    );
  }

  const showApp = user || hasEnteredApp;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onOpenProfile={() => setIsProfileOpen(true)} />
      
      <main className="flex-grow">
        {showApp ? (
          <ErrorBoundary>
            <AppHome />
          </ErrorBoundary>
        ) : (
          <>
            <ErrorBoundary>
              <Hero />
            </ErrorBoundary>
            <ErrorBoundary>
              <HowItWorks />
            </ErrorBoundary>
            <ErrorBoundary>
              <SearchMockup />
            </ErrorBoundary>
            <ErrorBoundary>
              <WhyArriveLink />
            </ErrorBoundary>
            <ErrorBoundary>
              <WaitlistForm onSuccess={handleEnterApp} />
            </ErrorBoundary>
            <ErrorBoundary>
              <FAQ />
            </ErrorBoundary>
          </>
        )}
      </main>
      
      <Footer />

      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
}
