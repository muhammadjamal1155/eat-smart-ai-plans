
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import RecommendationResults from "@/components/RecommendationResults";

const steps = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Goals & Preferences" },
  { id: 3, title: "Lifestyle & Habits" },
  { id: 4, title: "Review & Submit" },
];

export default function NutritionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    goal: "",
    activityLevel: "",
    dietType: "",
    foodAllergies: "",
    mealFrequency: "",
    waterIntake: "",
    sleepDuration: "",
    medicalConditions: "",
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for backend (convert units if necessary)
      let weightInKg = parseFloat(formData.weight);
      if (formData.weightUnit === 'lbs') {
        weightInKg = weightInKg * 0.453592;
      }

      let heightInCm = parseFloat(formData.height);
      if (formData.heightUnit === 'ft') {
        heightInCm = heightInCm * 30.48;
      }

      const payload = {
        age: formData.age,
        weight: weightInKg,
        height: heightInCm,
        gender: formData.gender,
        goal: formData.goal,
        activity_level: formData.activityLevel,
        diet_type: formData.dietType,
        allergies: formData.foodAllergies ? formData.foodAllergies.split(',') : []
      };

      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
      setShowResults(true);
      toast({
        title: "Plan Generated!",
        description: "Here is your personalized meal plan.",
      });

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showResults && recommendations) {
    return <RecommendationResults data={recommendations} onBack={() => setShowResults(false)} />;
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Your Nutrition Profile
          </CardTitle>
          <Progress value={progress} className="w-full mt-2" />
          <p className="text-center text-muted-foreground mt-2">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" value={formData.age} onChange={handleChange} placeholder="30" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <div className="flex gap-2">
                      <Input id="height" type="number" value={formData.height} onChange={handleChange} placeholder="180" required className="w-2/3" />
                      <Select onValueChange={(value) => handleSelectChange("heightUnit", value)} value={formData.heightUnit}>
                        <SelectTrigger className="w-1/3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="ft">ft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="flex gap-2">
                      <Input id="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="75" required className="w-2/3" />
                      <Select onValueChange={(value) => handleSelectChange("weightUnit", value)} value={formData.weightUnit}>
                        <SelectTrigger className="w-1/3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lbs">lbs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Goal</Label>
                  <RadioGroup onValueChange={(value) => handleRadioChange("goal", value)} value={formData.goal} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weight-loss" id="weight-loss" />
                      <Label htmlFor="weight-loss">Weight Loss</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weight-gain" id="weight-gain" />
                      <Label htmlFor="weight-gain">Weight Gain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maintenance" id="maintenance" />
                      <Label htmlFor="maintenance">Maintenance</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select onValueChange={(value) => handleSelectChange("activityLevel", value)} value={formData.activityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly-active">Lightly Active</SelectItem>
                      <SelectItem value="moderately-active">Moderately Active</SelectItem>
                      <SelectItem value="very-active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Diet Type</Label>
                  <Select onValueChange={(value) => handleSelectChange("dietType", value)} value={formData.dietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foodAllergies">Food Allergies</Label>
                  <Input id="foodAllergies" value={formData.foodAllergies} onChange={handleChange} placeholder="e.g., Peanuts, Shellfish" />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Meal Frequency (per day)</Label>
                  <RadioGroup onValueChange={(value) => handleRadioChange("mealFrequency", value)} value={formData.mealFrequency} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="3-meals" />
                      <Label htmlFor="3-meals">3 meals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="4-meals" />
                      <Label htmlFor="4-meals">4 meals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="5-meals" />
                      <Label htmlFor="5-meals">5+ meals</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterIntake">Daily Water Intake (liters)</Label>
                  <Input id="waterIntake" type="number" value={formData.waterIntake} onChange={handleChange} placeholder="2.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleepDuration">Average Sleep Duration (hours)</Label>
                  <Input id="sleepDuration" type="number" value={formData.sleepDuration} onChange={handleChange} placeholder="8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions (optional)</Label>
                  <Input id="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="e.g., Diabetes, High Blood Pressure" />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Information</h3>
                <div className="p-4 border rounded-md space-y-2">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span>{value || "Not provided"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button type="button" onClick={prevStep} variant="outline">
                  Back
                </Button>
              )}
              {currentStep < steps.length && (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              )}
              {currentStep === steps.length && (
                <Button type="submit" className="ml-auto" disabled={isLoading}>
                  {isLoading ? "Generating Plan..." : "Submit and See Meal Plan"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
