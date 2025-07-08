
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const AuthSection = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Don't render auth section if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <section id="auth" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            {isLogin ? 'Sign In to Continue' : 'Start Your Journey'}
          </h2>
          <p className="text-xl text-gray-600">
            {isLogin 
              ? 'Access your personalized nutrition dashboard' 
              : 'Join thousands improving their health with AI guidance'
            }
          </p>
        </div>

        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
