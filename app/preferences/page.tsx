'use client';

import React from 'react';
import { PreferencesForm } from '@/components/news/PreferencesForm';

export default function Preferences() {
  return (
    <div className="container max-w-full py-4 md:py-8 px-4 md:px-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Preferences</h1>
        <p className="text-muted-foreground">
          Customize your news experience by setting your preferences.
        </p>
      </div>

      <PreferencesForm />
    </div>
  );
} 