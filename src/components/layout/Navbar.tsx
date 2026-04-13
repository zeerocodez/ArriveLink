import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenProfile: () => void;
}

export function Navbar({ onOpenProfile }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-mist" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center shadow-cta">
              <span className="text-forest font-heading text-2xl">A</span>
            </div>
            <span className="text-2xl font-heading font-bold text-forest tracking-tight">ArriveLink</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-bold text-forest/70 hover:text-forest transition-colors uppercase tracking-widest">How it works</a>
            <a href="#why-arrivelink" className="text-sm font-bold text-forest/70 hover:text-forest transition-colors uppercase tracking-widest">Why Us</a>
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => window.location.href = '/admin'}
                className="text-sm font-bold text-emerald hover:text-pine transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                <LayoutDashboard size={16} /> Admin
              </button>
            )}

            <div className="h-6 w-px bg-mist mx-2" />

            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-3 py-1.5 bg-mist rounded-full border border-pine/10 hover:border-emerald/50 transition-all group"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon size={16} className="text-pine" />
                  )}
                  <span className="text-xs font-bold text-pine max-w-[100px] truncate group-hover:text-emerald transition-colors">{user.displayName?.split(' ')[0]}</span>
                </button>
                <button 
                  onClick={() => logout()}
                  className="text-forest/60 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => loginWithGoogle()}
                  className="text-sm font-bold text-forest hover:text-pine transition-colors flex items-center gap-2 uppercase tracking-widest"
                >
                  <LogIn size={18} /> Login
                </button>
                <Button onClick={scrollToWaitlist} size="sm">
                  Join Waitlist
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-forest"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-32 px-8"
          >
            <div className="flex flex-col gap-8">
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-forest uppercase tracking-widest">How it works</a>
              <a href="#why-arrivelink" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-forest uppercase tracking-widest">Why Us</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-forest uppercase tracking-widest">FAQ</a>
              
              <div className="pt-8 border-t border-mist flex flex-col gap-4">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3" onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}>
                        {user.photoURL && <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />}
                        <span className="font-bold text-forest">{user.displayName}</span>
                      </div>
                      <button 
                        onClick={() => logout()}
                        className="p-2 text-forest/60 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>
                    <Button onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }} variant="secondary" fullWidth>
                      View Profile
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button onClick={() => loginWithGoogle()} variant="secondary" fullWidth>
                      Login with Google
                    </Button>
                    <Button onClick={scrollToWaitlist} fullWidth>
                      Join Waitlist
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom CTA (Mobile Only) */}
      <AnimatePresence>
        {isScrolled && !isMobileMenuOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-6 right-6 z-50 md:hidden"
          >
            <Button 
              fullWidth 
              className="shadow-2xl"
              onClick={scrollToWaitlist}
            >
              Join the Waitlist →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
