import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Food {
  name: string;
  image: string;
  calories: number;
  protein: number;
  benefits: string[];
}

interface RecommendedFoodsProps {
  foods: Food[];
  isLoading?: boolean;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80', // Bowl
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300&q=80', // Salmon
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80', // Salad
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80', // Pasta
  'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=300&q=80', // Fruit
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80', // Chicken
];

const getFallbackImage = (name: string) => {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};

const FoodCard = memo(({ food }: { food: Food }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-muted/50 rounded-lg p-4 card-hover border border-border">
      <div className="relative mb-3">
        {!imageLoaded && !imageError && (
          <Skeleton className="w-full h-32 rounded-lg" />
        )}
        {!imageError ? (
          <img
            src={food.image}
            alt={food.name}
            className={`w-full h-32 object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
              }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <img
            src={getFallbackImage(food.name)}
            alt={food.name}
            className="w-full h-32 object-cover rounded-lg"
          />
        )}
      </div>
      <h4 className="font-semibold text-card-foreground mb-2">{food.name}</h4>
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>{food.calories} cal</span>
        <span>{food.protein}g protein</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {food.benefits.map((benefit) => (
          <Badge key={benefit} variant="secondary" className="text-[10px] px-2 py-0.5 whitespace-nowrap bg-accent/30 text-accent-foreground border-accent">
            {benefit}
          </Badge>
        ))}
      </div>
    </div>
  );
});

FoodCard.displayName = 'FoodCard';

const RecommendedFoods = memo(({ foods, isLoading = false }: RecommendedFoodsProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-soft border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">AI Recommended Foods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="w-full h-32 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">AI Recommended Foods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCard key={food.name} food={food} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

RecommendedFoods.displayName = 'RecommendedFoods';

export default RecommendedFoods;