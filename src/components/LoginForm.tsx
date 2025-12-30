
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';

const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Re-validate on submit to catch any missed errors
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (emailError || passwordError) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Supabase Login
      const { error } = await signIn(email, password);

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully logged into NutriGuide AI.",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
        <p className="text-muted-foreground">Sign in to continue your nutrition journey</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              className={emailError ? 'border-destructive' : ''}
            />
            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Password</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
              className={passwordError ? 'border-destructive' : ''}
            />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            <div className="text-right">
              <a href="/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || emailError !== '' || passwordError !== ''}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm text-primary hover:underline"
            >
              Don't have an account? Create one
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
