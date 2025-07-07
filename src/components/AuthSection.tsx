
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AuthSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    goal: '',
    password: '',
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuth = async (type: 'login' | 'register') => {
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      
      const userData = {
        id: '1',
        name: type === 'register' ? formData.name : 'John Doe',
        email: type === 'register' ? formData.email : 'john@example.com',
        age: type === 'register' ? parseInt(formData.age) : 30,
        weight: type === 'register' ? parseInt(formData.weight) : 70,
        height: type === 'register' ? parseInt(formData.height) : 175,
        goal: type === 'register' ? formData.goal : 'weight-loss',
      };

      login(userData);
      
      toast({
        title: type === 'login' ? "Welcome back!" : "Account created successfully!",
        description: type === 'login' ? "You've been logged in." : "Your account has been created and you're now logged in.",
      });
      
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Start Your Health Journey Today
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of users who have transformed their lives with NutriGuide AI
          </p>
        </div>

        <Card className="shadow-2xl border-0 animate-scale-in">
          <CardContent className="p-8">
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="register" className="text-lg py-3">Sign Up</TabsTrigger>
                <TabsTrigger value="login" className="text-lg py-3">Sign In</TabsTrigger>
              </TabsList>

              <TabsContent value="register" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      placeholder="Your weight"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="Your height"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="goal">Dietary Goal</Label>
                    <Select onValueChange={(value) => handleInputChange('goal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="weight-gain">Weight Gain</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="health">General Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full btn-primary text-lg py-3" 
                  onClick={() => handleAuth('register')}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>

              <TabsContent value="login" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" placeholder="Enter your password" />
                  </div>
                </div>
                <Button 
                  className="w-full btn-primary text-lg py-3" 
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AuthSection;
