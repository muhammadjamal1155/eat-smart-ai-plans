
import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';

import Chatbot from '@/components/Chatbot';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/App.css';
import ScrollToTop from '@/components/ScrollToTop';
import AnimatedRoutes from '@/components/AnimatedRoutes';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="nutriplan-theme">
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="App page-surface w-full overflow-x-hidden" id="main-content">
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Suspense fallback={<div>Loading...</div>}>
                <AnimatedRoutes />
              </Suspense>
              <Toaster />
              <Chatbot />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;
