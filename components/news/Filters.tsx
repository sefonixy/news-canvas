import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useNews } from '@/lib/context/NewsContext';
import { fetchNewsApiSources, fetchNewsApiCategories } from '@/lib/services/newsApi';
import { fetchGuardianSections } from '@/lib/services/guardianApi';
import { fetchNYTimesCategories } from '@/lib/services/nyTimesApi';

export function Filters() {
  const { 
    filters,
    updateSources,
    updateCategories,
    updateDateRange,
    resetFilters,
  } = useNews();

  const [sources, setSources] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch sources and categories from all APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch sources
        const newsApiSources = await fetchNewsApiSources();
        
        // Fetch categories from all 3 APIs
        const [newsApiCategories, guardianSections, nyTimesCategories] = await Promise.all([
          fetchNewsApiCategories(),
          fetchGuardianSections(),
          fetchNYTimesCategories()
        ]);
        
        // Combine and remove duplicates
        const allSources = Array.from(new Set(newsApiSources));
        const allCategories = Array.from(new Set([
          ...newsApiCategories, 
          ...guardianSections,
          ...nyTimesCategories
        ]));
        
        setSources(allSources);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error fetching filters data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle source selection
  const handleSourceChange = (source: string, checked: boolean) => {
    const newSources = checked
      ? [...(filters.sources || []), source]
      : (filters.sources || []).filter(s => s !== source);
    
    updateSources(newSources);
  };

  // Handle category selection
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...(filters.categories || []), category]
      : (filters.categories || []).filter(c => c !== category);
    
    updateCategories(newCategories);
  };

  // Handle date changes
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDateRange(e.target.value, filters.toDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDateRange(filters.fromDate, e.target.value);
  };

  return (
    <div className="border rounded-lg p-3 md:p-4 mb-4 md:mb-6 bg-card w-full">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <h3 className="text-base md:text-lg font-medium">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpand}
          className="text-xs md:text-sm h-8"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3 md:space-y-4">
          {/* Date Filters */}
          <div className="space-y-1 md:space-y-2">
            <h4 className="text-sm font-medium">Date Range</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label htmlFor="fromDate" className="text-xs">From</label>
                <Input
                  id="fromDate"
                  type="date"
                  value={filters.fromDate || ''}
                  onChange={handleFromDateChange}
                  className="h-8 md:h-9 text-xs md:text-sm"
                />
              </div>
              <div>
                <label htmlFor="toDate" className="text-xs">To</label>
                <Input
                  id="toDate"
                  type="date"
                  value={filters.toDate || ''}
                  onChange={handleToDateChange}
                  className="h-8 md:h-9 text-xs md:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-1 md:space-y-2">
            <h4 className="text-sm font-medium">Categories</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
              {isLoading ? (
                <p className="text-xs md:text-sm text-muted-foreground">Loading categories...</p>
              ) : (
                categories.slice(0, 8).map(category => (
                  <div key={category} className="flex items-start space-x-1 md:space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={(filters.categories || []).includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                      className="h-3 w-3 md:h-4 md:w-4 mt-0.5"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                    >
                      {category}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sources Filter */}
          <div className="space-y-1 md:space-y-2">
            <h4 className="text-sm font-medium">Sources</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
              {isLoading ? (
                <p className="text-xs md:text-sm text-muted-foreground">Loading sources...</p>
              ) : (
                sources.slice(0, 8).map(source => (
                  <div key={source} className="flex items-start space-x-1 md:space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={(filters.sources || []).includes(source)}
                      onCheckedChange={(checked) => 
                        handleSourceChange(source, checked as boolean)
                      }
                      className="h-3 w-3 md:h-4 md:w-4 mt-0.5"
                    />
                    <label
                      htmlFor={`source-${source}`}
                      className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                    >
                      {source}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs md:text-sm h-8"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 