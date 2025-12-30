
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Lock } from 'lucide-react';

const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Supabase Signup
      const { error } = await signUp(formData.email, formData.password, formData.name);

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account!",
      });
      // Optionally switch to login or auto-login (if email confirmation off)
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Join NutriGuide AI</CardTitle>
        <p className="text-muted-foreground">Create your personalized nutrition journey</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Full Name *</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email *</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Password *</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-primary hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
