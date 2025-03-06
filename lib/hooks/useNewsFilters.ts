'use client';
import { useState, useCallback } from 'react';
import { NewsFilters } from '../types';

export function useNewsFilters() {
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

  const updateQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query, page: 1 })); // Reset page when query changes
  }, []);

  const updateSources = useCallback((sources: string[]) => {
    setFilters(prev => ({ ...prev, sources, page: 1 }));
  }, []);

  const updateCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories, page: 1 }));
  }, []);

  const updateAuthors = useCallback((authors: string[]) => {
    setFilters(prev => ({ ...prev, authors, page: 1 }));
  }, []);

  const updateDateRange = useCallback((fromDate?: string, toDate?: string) => {
    setFilters(prev => ({ ...prev, fromDate, toDate, page: 1 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

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