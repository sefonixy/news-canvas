'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, NewsFilters, UserPreferences } from '../types';
import { fetchAllArticles, filterArticles, getPersonalizedFeed } from '../services/newsAggregator';
import { useNewsFilters } from '../hooks/useNewsFilters';
import { usePreferences } from '../hooks/usePreferences';

// Define the context type
interface NewsContextType {
  articles: Article[];
  filteredArticles: Article[];
  personalizedArticles: Article[];
  isLoading: boolean;
  error: string | null;
  filters: NewsFilters;
  preferences: UserPreferences;
  updateQuery: (query: string) => void;
  updateSources: (sources: string[]) => void;
  updateCategories: (categories: string[]) => void;
  updateAuthors: (authors: string[]) => void;
  updateDateRange: (fromDate?: string, toDate?: string) => void;
  updatePage: (page: number) => void;
  resetFilters: () => void;
  updatePreferredSources: (sources: string[]) => void;
  updatePreferredCategories: (categories: string[]) => void;
  updatePreferredAuthors: (authors: string[]) => void;
  resetPreferences: () => void;
  refreshNews: () => void;
}

// Create the context
const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Create the provider component
export function NewsProvider({ children }: { children: React.ReactNode }) {
  // Use our custom hooks for filters and preferences
  const {
    filters,
    updateQuery,
    updateSources,
    updateCategories,
    updateAuthors,
    updateDateRange,
    updatePage,
    resetFilters,
  } = useNewsFilters();
  
  const {
    preferences,
    updatePreferredSources,
    updatePreferredCategories,
    updatePreferredAuthors,
    resetPreferences,
  } = usePreferences();

  // State for articles
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [personalizedArticles, setPersonalizedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch news articles
  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allArticles = await fetchAllArticles(filters);
      setArticles(allArticles);
      
      // Apply manual filtering (this could be done on the API side but useful for client-side filtering too)
      const filtered = await filterArticles(allArticles, filters);
      setFilteredArticles(filtered);
      
      // Get personalized feed based on user preferences
      const personalized = await getPersonalizedFeed(filters, preferences);
      setPersonalizedArticles(personalized);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh news function that can be called manually
  const refreshNews = () => {
    fetchNews();
  };

  // Fetch news on mount and when filters or preferences change
  useEffect(() => {
    fetchNews();
  }, [
    filters.query, 
    filters.sources?.toString(), 
    filters.categories?.toString(), 
    filters.authors?.toString(),
    filters.fromDate,
    filters.toDate,
    filters.page,
    preferences.preferredSources.toString(),
    preferences.preferredCategories.toString(),
    preferences.preferredAuthors.toString()
  ]);

  // Create the context value object
  const contextValue: NewsContextType = {
    articles,
    filteredArticles,
    personalizedArticles,
    isLoading,
    error,
    filters,
    preferences,
    updateQuery,
    updateSources,
    updateCategories,
    updateAuthors,
    updateDateRange,
    updatePage,
    resetFilters,
    updatePreferredSources,
    updatePreferredCategories,
    updatePreferredAuthors,
    resetPreferences,
    refreshNews,
  };

  return (
    <NewsContext.Provider value={contextValue}>
      {children}
    </NewsContext.Provider>
  );
}

// Custom hook to use the context
export function useNews() {
  const context = useContext(NewsContext);
  
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  
  return context;
} 