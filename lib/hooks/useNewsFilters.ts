'use client';
import { useState, useCallback } from 'react';
import { NewsFilters } from '../types';

export function useNewsFilters() {
  // Initialize with empty filters
  const [filters, setFilters] = useState<NewsFilters>({
    query: '',
    sources: [],
    categories: [],
    authors: [],
    fromDate: undefined,
    toDate: undefined,
    page: 1,
    pageSize: 20,
  });

  // Function to update search query
  const updateQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query, page: 1 })); // Reset page when query changes
  }, []);

  // Function to update sources filter
  const updateSources = useCallback((sources: string[]) => {
    setFilters(prev => ({ ...prev, sources, page: 1 }));
  }, []);

  // Function to update categories filter
  const updateCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories, page: 1 }));
  }, []);

  // Function to update authors filter
  const updateAuthors = useCallback((authors: string[]) => {
    setFilters(prev => ({ ...prev, authors, page: 1 }));
  }, []);

  // Function to update date range
  const updateDateRange = useCallback((fromDate?: string, toDate?: string) => {
    setFilters(prev => ({ ...prev, fromDate, toDate, page: 1 }));
  }, []);

  // Function to update page
  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Function to reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      query: '',
      sources: [],
      categories: [],
      authors: [],
      fromDate: undefined,
      toDate: undefined,
      page: 1,
      pageSize: 20,
    });
  }, []);

  return {
    filters,
    updateQuery,
    updateSources,
    updateCategories,
    updateAuthors,
    updateDateRange,
    updatePage,
    resetFilters,
  };
} 