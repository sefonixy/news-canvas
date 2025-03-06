'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNews } from '@/lib/context/NewsContext';

export function Header() {
  const { updateQuery, filters } = useNews();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the controlled input
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container max-w-full flex flex-col md:flex-row md:h-16 items-center justify-between py-2 px-4 md:px-6">
        <div className="w-full md:w-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            NewsCanvas
          </Link>
          <button 
            className="md:hidden p-2" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
        
        <div className={`w-full flex flex-col md:flex-row items-center mt-2 md:mt-0 ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <form onSubmit={handleSearch} className="w-full md:flex-1 md:mx-4 md:max-w-xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for news..."
                className="w-full"
                value={filters.query || ''}
                onChange={(e) => updateQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <SearchIcon className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>
          
          <nav className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
            <Link href="/" className="text-sm font-medium w-full md:w-auto py-2 md:py-0 text-center">
              Home
            </Link>
            <Link href="/personalized" className="text-sm font-medium w-full md:w-auto py-2 md:py-0 text-center">
              My Feed
            </Link>
            <Link href="/preferences" className="text-sm font-medium w-full md:w-auto py-2 md:py-0 text-center">
              Preferences
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
} 