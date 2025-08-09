import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils, User, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide when scrolling down past 100px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show when scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Smoothly scroll to hash anchors after navigation
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = decodeURIComponent(location.hash);
      const el = document.querySelector(id);
      if (el) {
        // Defer to ensure the section is rendered before scrolling
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 0);
      }
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleHashScroll = (hashId: string) => {
    // Only scroll to hash if we're on the home page
    if (location.pathname === '/') {
      const element = document.querySelector(hashId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`bg-background/80 backdrop-blur-md shadow-soft border-b border-border fixed top-0 w-full z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center interactive">
                <Utensils className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-foreground">NutriPlan</span>
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath('/dashboard') 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/meal-plans" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath('/meal-plans') 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    Meal Plans
                  </Link>
                  <Link 
                    to="/insights" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath('/insights') 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    AI Insights
                  </Link>
                  <Link 
                    to="/analytics" 
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath('/analytics') 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    Analytics
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    onClick={() => handleHashScroll('#features')}
                    className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Features
                  </Link>
                  <Link 
                    to="/" 
                    onClick={() => handleHashScroll('#meal-plans')}
                    className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Meal Plans
                  </Link>
                  <Link 
                    to="/" 
                    onClick={() => handleHashScroll('#insights')}
                    className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    AI Insights
                  </Link>
                </>
              )}
              <Link 
                to="/about" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActivePath('/about') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActivePath('/contact') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full interactive">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-effect shadow-medium" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/meal-plans" className="w-full cursor-pointer">
                      Meal Plans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/insights" className="w-full cursor-pointer">
                      AI Insights
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/analytics" className="w-full cursor-pointer">
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                    <LogOut className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/#auth" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium interactive">
                  Login
                </Link>
                <Link to="/#auth" className="btn-primary px-4 py-2 text-sm font-medium rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center space-x-3 mr-2">
            <ThemeToggle />
            {!user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full interactive">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-background border border-border shadow-medium z-50" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/#auth" className="w-full cursor-pointer">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/#auth" className="w-full cursor-pointer">
                      Register
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-background inline-flex items-center justify-center p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring interactive touch-manipulation active:scale-95"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        <div className={`${isMobileMenuOpen ? 'block animate-slide-in-top' : 'hidden'} lg:hidden bg-background/95 backdrop-blur-lg border-t border-border`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                    isActivePath('/dashboard') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-foreground hover:text-primary hover:bg-accent active:scale-95'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/meal-plans" 
                  className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                    isActivePath('/meal-plans') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-foreground hover:text-primary hover:bg-accent active:scale-95'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meal Plans
                </Link>
                <Link 
                  to="/insights" 
                  className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                    isActivePath('/insights') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-foreground hover:text-primary hover:bg-accent active:scale-95'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Insights
                </Link>
                <Link 
                  to="/analytics" 
                  className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                    isActivePath('/analytics') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-foreground hover:text-primary hover:bg-accent active:scale-95'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Analytics
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  onClick={() => {
                    handleHashScroll('#features');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation text-foreground hover:text-primary hover:bg-accent active:scale-95"
                >
                  Features
                </Link>
                <Link 
                  to="/" 
                  onClick={() => {
                    handleHashScroll('#meal-plans');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation text-foreground hover:text-primary hover:bg-accent active:scale-95"
                >
                  Meal Plans
                </Link>
                <Link 
                  to="/" 
                  onClick={() => {
                    handleHashScroll('#insights');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation text-foreground hover:text-primary hover:bg-accent active:scale-95"
                >
                  AI Insights
                </Link>
              </>
            )}
            <Link 
              to="/about" 
              className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                isActivePath('/about') 
                  ? 'text-primary bg-primary/10 shadow-sm' 
                  : 'text-foreground hover:text-primary hover:bg-accent active:scale-95'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                isActivePath('/contact') 
                  ? 'text-primary bg-primary/10 shadow-sm' 
                  : 'text-foreground hover:text-primary hover:bg-accent active:scale-95'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-border">
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation text-foreground hover:text-primary hover:bg-accent active:scale-95 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-border">
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/#auth"
                  className="block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation text-foreground hover:text-primary hover:bg-accent active:scale-95"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/#auth"
                  className="block px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation btn-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
