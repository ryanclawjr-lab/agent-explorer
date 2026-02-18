'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TrustScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
}

export function TrustScoreRing({ 
  score, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: TrustScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  
  const sizeClasses = {
    sm: { container: 'w-12 h-12', text: 'text-xs', label: 'text-[10px]' },
    md: { container: 'w-16 h-16', text: 'text-sm', label: 'text-xs' },
    lg: { container: 'w-24 h-24', text: 'text-xl', label: 'text-sm' },
    xl: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-base' }
  };
  
  const getColor = (score: number) => {
    if (score >= 90) return 'stroke-emerald-500';
    if (score >= 70) return 'stroke-blue-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-red-500';
  };
  
  const getLabel = (score: number) => {
    if (score >= 90) return 'Elite';
    if (score >= 70) return 'Verified';
    if (score >= 50) return 'Standard';
    return 'Unverified';
  };
  
  const getBgColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-400';
    if (score >= 70) return 'bg-blue-500/10 text-blue-400';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400';
    return 'bg-red-500/10 text-red-400';
  };
  
  useEffect(() => {
    if (!animated) return;
    
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score, animated]);
  
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('relative', sizeClasses[size].container)}>
        <svg 
          className="w-full h-full -rotate-90" 
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn('transition-all duration-1000 ease-out', getColor(score))}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', sizeClasses[size].text)}>
            {displayScore}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span className={cn(
          'px-2 py-0.5 rounded-full font-medium',
          sizeClasses[size].label,
          getBgColor(score)
        )}>
          {getLabel(score)}
        </span>
      )}
    </div>
  );
}
