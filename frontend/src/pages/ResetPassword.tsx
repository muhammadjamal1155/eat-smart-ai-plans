import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { usePageTitle } from '@/hooks/use-page-title';

import { useAuth } from '@/hooks/use-auth';

const ResetPassword = () => {
    usePageTitle('Reset Password');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await resetPassword(email);

            if (!error) {
                setIsSubmitted(true);
                toast({
                    title: "Reset link sent",
                    description: "Check your email for instructions to reset your password.",
                });
            } else {
                throw error;
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset link. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-foreground">
            <Navigation />
            <main className="pt-20">
                <section className="py-12 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-md mx-auto">
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                                    <CardDescription>
                                        Enter your email address and we'll send you a link to reset your password.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!isSubmitted ? (
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
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full" disabled={isLoading}>
                                                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                                            </Button>

                                            <div className="text-center">
                                                <Link
                                                    to="/login"
                                                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                                                >
                                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                                    Back to Login
                                                </Link>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <div className="p-4 rounded-full bg-green-100 text-green-600 inline-block">
                                                <Mail className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-semibold">Check your email</h3>
                                            <p className="text-muted-foreground">
                                                We have sent a password reset link to <strong>{email}</strong>.
                                            </p>
                                            <Button asChild className="w-full mt-4" variant="outline">
                                                <Link to="/login">Back to Login</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </div >
    );
};

export default ResetPassword;
