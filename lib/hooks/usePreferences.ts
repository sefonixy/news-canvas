'use client';

import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';

export function usePreferences() {
  // Initialize with empty preferences or load from localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Try to load from localStorage
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
    
    // Default empty preferences
    return {
      preferredSources: [],
      preferredCategories: [],
      preferredAuthors: [],
    };
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Function to update individual preference lists
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

  // Function to reset all preferences
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