'use client';

import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const savedPrefs = localStorage.getItem('newsPreferences');
      if (savedPrefs) {
        try {
          return JSON.parse(savedPrefs);
        } catch (e) {
          console.error('Failed to parse saved preferences:', e);
        }
      }
    }
    
    return {
      preferredSources: [],
      preferredCategories: [],
      preferredAuthors: [],
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  const updatePreferredSources = (sources: string[]) => {
    setPreferences(prev => ({
      ...prev,
      preferredSources: sources,
    }));
  };

  const updatePreferredCategories = (categories: string[]) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: categories,
    }));
  };

  const updatePreferredAuthors = (authors: string[]) => {
    setPreferences(prev => ({
      ...prev,
      preferredAuthors: authors,
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      preferredSources: [],
      preferredCategories: [],
      preferredAuthors: [],
    });
  };

  return {
    preferences,
    updatePreferredSources,
    updatePreferredCategories,
    updatePreferredAuthors,
    resetPreferences,
  };
} 