'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FilterState } from '@/lib/types/agent';
import { cn } from '@/lib/utils';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

const NETWORKS = [
  { id: 'base', label: 'Base' },
  { id: 'base-sepolia', label: 'Base Sepolia' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'sepolia', label: 'Sepolia' }
];

const CAPABILITIES = [
  'price-feeds',
  'gas-oracle',
  'market-data',
  'analytics',
  'research',
  'analysis',
  'coding',
  'defi',
  'verification',
  'reputation',
  'scoring'
];

export function FilterPanel({ filters, onChange, className }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };
  
  const clearFilters = () => {
    onChange({
      search: '',
      trustScoreRange: [0, 100],
      networks: [],
      capabilities: [],
      featuredOnly: false,
      activityLevel: 'all'
    });
  };
  
  const hasActiveFilters = 
    filters.trustScoreRange[0] > 0 ||
    filters.trustScoreRange[1] < 100 ||
    filters.networks.length > 0 ||
    filters.capabilities.length > 0 ||
    filters.featuredOnly ||
    filters.activityLevel !== 'all';

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        className="lg:hidden w-full mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-2">Active</Badge>
        )}
      </Button>
      
      {/* Filter panel */}
      <Card className={cn(
        'p-6 space-y-6',
        !isOpen && 'hidden lg:block',
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Trust Score Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Trust Score Range</Label>
          <Slider
            value={filters.trustScoreRange}
            onValueChange={(value) => updateFilter('trustScoreRange', value as [number, number])}
            max={100}
            step={5}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.trustScoreRange[0]}</span>
            <span>{filters.trustScoreRange[1]}</span>
          </div>
        </div>
        
        {/* Networks */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Networks</Label>
          <div className="space-y-2">
            {NETWORKS.map((network) => (
              <div key={network.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`network-${network.id}`}
                  checked={filters.networks.includes(network.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilter('networks', [...filters.networks, network.id]);
                    } else {
                      updateFilter('networks', filters.networks.filter(n => n !== network.id));
                    }
                  }}
                />
                <Label htmlFor={`network-${network.id}`} className="text-sm cursor-pointer">
                  {network.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Capabilities */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Capabilities</Label>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.map((cap) => (
              <Badge
                key={cap}
                variant={filters.capabilities.includes(cap) ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => {
                  if (filters.capabilities.includes(cap)) {
                    updateFilter('capabilities', filters.capabilities.filter(c => c !== cap));
                  } else {
                    updateFilter('capabilities', [...filters.capabilities, cap]);
                  }
                }}
              >
                {cap.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Activity Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Activity Level</Label>
          <select
            value={filters.activityLevel}
            onChange={(e) => updateFilter('activityLevel', e.target.value as FilterState['activityLevel'])}
            className="w-full p-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Levels</option>
            <option value="high">High Activity</option>
            <option value="medium">Medium Activity</option>
            <option value="low">Low Activity</option>
          </select>
        </div>
        
        {/* Featured Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.featuredOnly}
            onCheckedChange={(checked) => updateFilter('featuredOnly', checked as boolean)}
          />
          <Label htmlFor="featured" className="text-sm cursor-pointer">
            Featured agents only
          </Label>
        </div>
      </Card>
    </>
  );
}
