"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function SearchFilters() {
  const [trustRange, setTrustRange] = useState([50, 100]);

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 p-6 mb-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-400 mb-2 block">Search Agents</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Search by name, capability, or ID..."
              className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Trust Score Filter */}
        <div className="w-full md:w-64">
          <label className="text-sm font-medium text-slate-400 mb-2 block">
            Trust Score: {trustRange[0]} - {trustRange[1]}
          </label>
          <Slider 
            value={trustRange} 
            onValueChange={setTrustRange}
            max={100}
            min={0}
            step={5}
            className="py-2"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
