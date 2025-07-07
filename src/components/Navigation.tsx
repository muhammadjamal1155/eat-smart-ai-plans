
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Contact, Home, User, BarChart, Calendar, Info, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const publicNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Contact },
  ];

  const privateNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart },
    { name: 'Meal Plans', href: '/meal-plans', icon: Calendar },
    { name: 'Insights', href: '/insights', icon: BarChart },
  ];

  const navItems = isAuthenticated ? [...publicNavItems, ...privateNavItems] : publicNavItems;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You've been logged out of your account.",
    });
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-health-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-poppins font-bold text-xl text-gray-900">NutriGuide AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-health-600'
                    : 'text-gray-600 hover:text-health-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="btn-primary">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 font-medium transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'text-health-600'
                          : 'text-gray-600 hover:text-health-600'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  {isAuthenticated ? (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-gray-600 mb-3">Welcome, {user?.name}</div>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button className="btn-primary mt-4">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
