'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Menu, X, Shield, GitBranch } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = '' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localQuery);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg leading-tight">
              Agent
              <span className="text-gradient">Explorer</span>
            </h1>
            <p className="text-xs text-muted-foreground">Trust & Reputation Hub</p>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search agents, capabilities..."
              className="w-full pl-10 bg-muted/50 border-0 focus-visible:ring-primary"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/agents">
            <Button variant="ghost" size="sm">Agents</Button>
          </Link>
          <Link href="/compare">
            <Button variant="ghost" size="sm">Compare</Button>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/ryanclawjr-lab/agent-explorer" target="_blank" rel="noopener noreferrer">
              <GitBranch className="w-4 h-4 mr-1" />
              GitHub
            </a>
          </Button>
          <Badge variant="secondary" className="ml-2">ERC-8004</Badge>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="w-full pl-10"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </form>
            <nav className="flex flex-col gap-2">
              <Link href="/agents" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Agents</Button>
              </Link>
              <Link href="/compare" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Compare</Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="https://github.com/ryanclawjr-lab/agent-explorer" target="_blank" rel="noopener noreferrer">
                  <GitBranch className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
