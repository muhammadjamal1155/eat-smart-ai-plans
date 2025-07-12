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
            className={`w-full h-32 object-cover rounded-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image unavailable</span>
          </div>
        )}
      </div>
      <h4 className="font-semibold text-card-foreground mb-2">{food.name}</h4>
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>{food.calories} cal</span>
        <span>{food.protein}g protein</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {food.benefits.map((benefit) => (
          <Badge key={benefit} variant="secondary" className="text-xs">
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