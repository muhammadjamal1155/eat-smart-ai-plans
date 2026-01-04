import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fallbackImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", // Salad bowl
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", // Steak/Meat
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80", // Healthy bowl
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80", // Pancakes/Breakfast
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80", // Soup
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80", // Sandwich/Toast
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80", // French toast/Dessert
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", // Veggie bowl
];

export const getFallbackImage = (id: string) => {
  let numericId = parseInt(id);
  if (isNaN(numericId)) {
    numericId = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  const index = Math.abs(numericId) % fallbackImages.length;
  return fallbackImages[index] || fallbackImages[0];
};
