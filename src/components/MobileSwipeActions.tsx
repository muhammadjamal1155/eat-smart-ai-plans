import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit3, Star } from 'lucide-react';

interface SwipeAction {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
  label: string;
}

interface MobileSwipeActionsProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
}

export const MobileSwipeActions = ({ 
  children, 
  leftActions = [], 
  rightActions = [],
  className = ""
}: MobileSwipeActionsProps) => {
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isSwipping, setIsSwipping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwipping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwipping) return;
    
    currentX.current = e.touches[0].clientX;
    const distance = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxDistance = 80;
    const limitedDistance = Math.max(-maxDistance, Math.min(maxDistance, distance));
    
    setSwipeDistance(limitedDistance);
  };

  const handleTouchEnd = () => {
    const threshold = 30;
    
    if (Math.abs(swipeDistance) > threshold) {
      // Execute action if swipe is significant
      if (swipeDistance > 0 && leftActions.length > 0) {
        leftActions[0].action();
      } else if (swipeDistance < 0 && rightActions.length > 0) {
        rightActions[0].action();
      }
    }
    
    // Reset swipe
    setSwipeDistance(0);
    setIsSwipping(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwipping, swipeDistance]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div 
          className={`absolute left-0 top-0 h-full flex items-center justify-center transition-opacity duration-200 ${
            swipeDistance > 20 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            width: Math.max(0, swipeDistance),
            backgroundColor: leftActions[0].color 
          }}
        >
          {swipeDistance > 40 && React.createElement(leftActions[0].icon, { className: "h-5 w-5 text-white" })}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div 
          className={`absolute right-0 top-0 h-full flex items-center justify-center transition-opacity duration-200 ${
            swipeDistance < -20 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            width: Math.max(0, -swipeDistance),
            backgroundColor: rightActions[0].color 
          }}
        >
          {swipeDistance < -40 && React.createElement(rightActions[0].icon, { className: "h-5 w-5 text-white" })}
        </div>
      )}

      {/* Main Content */}
      <div 
        className="relative z-10 transition-transform duration-200"
        style={{ 
          transform: `translateX(${swipeDistance}px)`,
          transition: isSwipping ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Example usage component
export const SwipeableCard = ({ title, description }: { title: string; description: string }) => {
  const leftActions = [
    {
      icon: Star,
      color: '#10b981',
      action: () => console.log('Starred'),
      label: 'Star'
    }
  ];

  const rightActions = [
    {
      icon: Edit3,
      color: '#3b82f6',
      action: () => console.log('Edit'),
      label: 'Edit'
    },
    {
      icon: Trash2,
      color: '#ef4444',
      action: () => console.log('Delete'),
      label: 'Delete'
    }
  ];

  return (
    <MobileSwipeActions 
      leftActions={leftActions} 
      rightActions={rightActions}
      className="mb-2"
    >
      <div className="bg-card border border-border rounded-lg p-4 touch-manipulation">
        <h3 className="font-semibold text-card-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
    </MobileSwipeActions>
  );
};