import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth(); // Assuming useAuth exists and works

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: UtensilsCrossed, label: 'Meals', path: '/admin/meals' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
                        <ChefHat className="h-8 w-8 text-primary mr-2" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
                            Admin
                        </span>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    location.pathname === item.path
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                )}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground hidden sm:block">
                            Administrator View
                        </div>
                        {/* Could add notification bell or profile dropdown here */}
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
