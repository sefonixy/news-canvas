'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} NewsCanvas. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link 
            href="/about" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            About
          </Link>
          <Link 
            href="/privacy" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy
          </Link>
          <Link 
            href="/terms" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms
          </Link>
          <Link 
            href="/contact" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
} 