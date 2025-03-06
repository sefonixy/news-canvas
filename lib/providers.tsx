'use client';

import React from 'react';
import { NewsProvider } from '@/lib/context/NewsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NewsProvider>
      {children}
    </NewsProvider>
  );
} 