import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

interface NavLink {
  href: string;
  label: string;
  isHashLink?: boolean;
}

const Navigation = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Utensils className="h-8 w-8 text-health-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">NutriPlan</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#dashboard" className="text-gray-900 hover:text-health-600 px-3 py-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#meal-plans" className="text-gray-900 hover:text-health-600 px-3 py-2 text-sm font-medium">
                Meal Plans
              </a>
              <a href="#insights" className="text-gray-900 hover:text-health-600 px-3 py-2 text-sm font-medium">
                AI Insights
              </a>
              <a href="#about" className="text-gray-900 hover:text-health-600 px-3 py-2 text-sm font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-900 hover:text-health-600 px-3 py-2 text-sm font-medium">
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/meal-plans" className="block px-4 py-2 hover:bg-gray-100">
                      Meal Plans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/insights" className="block px-4 py-2 hover:bg-gray-100">
                      AI Insights
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
                <Link to="/login" className="text-gray-900 hover:text-health-600 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm font-medium rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className={`${isMobileMenuOpen ? 'block' : 'none'} md:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#dashboard" className="text-gray-900 hover:text-health-600 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </a>
            <a href="#meal-plans" className="text-gray-900 hover:text-health-600 block px-3 py-2 rounded-md text-base font-medium">
              Meal Plans
            </a>
            <a href="#insights" className="text-gray-900 hover:text-health-600 block px-3 py-2 rounded-md text-base font-medium">
              AI Insights
            </a>
            <a href="#about" className="text-gray-900 hover:text-health-600 block px-3 py-2 rounded-md text-base font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-900 hover:text-health-600 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </a>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-health-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-health-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-health-600"
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
