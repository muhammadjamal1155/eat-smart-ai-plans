import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface NutritionFormData {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    goal: string;
    activityLevel: string;
    dietType: string;
    allergies: string;
    mealFrequency: string;
    waterIntake: string;
    sleepDuration: string;
    medicalConditions: string;
}

interface NutritionFormProps {
    onSubmit: (data: NutritionFormData) => void;
}

const NutritionForm = ({ onSubmit }: NutritionFormProps) => {
    const [formData, setFormData] = useState<NutritionFormData>({
        name: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        goal: 'maintenance',
        activityLevel: 'sedentary',
        dietType: 'any',
        allergies: '',
        mealFrequency: '3',
        waterIntake: '',
        sleepDuration: '',
        medicalConditions: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!formData.age || !formData.height || !formData.weight) {
            toast({
                title: "Missing Information",
                description: "Please fill in age, height, and weight to get accurate recommendations.",
                variant: "destructive"
            });
            setIsLoading(false);
            return;
        }

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));

        onSubmit(formData);
        setIsLoading(false);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-3xl font-bold text-center text-primary">Your Nutrition Profile</CardTitle>
                <p className="text-center text-muted-foreground">Tell us about yourself to get your personalized meal plan</p>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Personal Details Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 border-b pb-2">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} placeholder="25" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <RadioGroup defaultValue="male" value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)} className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">Male</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">Female</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Body Metrics Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 border-b pb-2">Body Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input id="height" type="number" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} placeholder="175" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input id="weight" type="number" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} placeholder="70" />
                            </div>
                        </div>
                    </div>

                    {/* Goals & Lifestyle Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 border-b pb-2">Goals & Lifestyle</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="goal">Primary Goal</Label>
                                <Select value={formData.goal} onValueChange={(v) => handleInputChange('goal', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                        <SelectItem value="weight-gain">Weight Gain</SelectItem>
                                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                        <SelectItem value="maintenance">Maintain Weight</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity">Activity Level</Label>
                                <Select value={formData.activityLevel} onValueChange={(v) => handleInputChange('activityLevel', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select activity level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
                                        <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                                        <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                                        <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                                        <SelectItem value="extra_active">Extra Active (Physical job)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary/80 border-b pb-2">Dietary Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="dietType">Diet Type</Label>
                                <Select value={formData.dietType} onValueChange={(v) => handleInputChange('dietType', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select diet type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">No Restrictions</SelectItem>
                                        <SelectItem value="vegan">Vegan</SelectItem>
                                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                        <SelectItem value="keto">Keto</SelectItem>
                                        <SelectItem value="paleo">Paleo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="allergies">Food Allergies (comma separated)</Label>
                                <Input id="allergies" value={formData.allergies} onChange={(e) => handleInputChange('allergies', e.target.value)} placeholder="Peanuts, Shellfish..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meals">Meals Per Day</Label>
                                <Select value={formData.mealFrequency} onValueChange={(v) => handleInputChange('mealFrequency', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">2 Meals</SelectItem>
                                        <SelectItem value="3">3 Meals</SelectItem>
                                        <SelectItem value="4">4 Meals</SelectItem>
                                        <SelectItem value="5">5+ Meals</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Plan...
                            </>
                        ) : (
                            'Submit and See Meal Plan'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default NutritionForm;
