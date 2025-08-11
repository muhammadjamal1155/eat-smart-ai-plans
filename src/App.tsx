
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import MealPlans from '@/pages/MealPlans';
import Insights from '@/pages/Insights';
import Analytics from '@/pages/Analytics';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Account from '@/pages/Account';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import '@/App.css';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="nutriplan-theme">
        <AuthProvider>
          <Router>
            <div className="App" id="main-content">
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/meal-plans" element={<ProtectedRoute><MealPlans /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
