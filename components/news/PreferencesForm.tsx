import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNews } from '@/lib/context/NewsContext';
import { fetchNewsApiSources, fetchNewsApiCategories } from '@/lib/services/newsApi';
import { fetchGuardianSections } from '@/lib/services/guardianApi';
import { fetchNYTimesCategories } from '@/lib/services/nyTimesApi';

export function PreferencesForm() {
  const { 
    preferences,
    updatePreferredSources,
    updatePreferredCategories,
    updatePreferredAuthors,
    resetPreferences,
  } = useNews();

  const [sources, setSources] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authorInput, setAuthorInput] = useState('');
  const [authorsList, setAuthorsList] = useState<string[]>(preferences.preferredAuthors || []);

  // Fetch sources and categories
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
        console.error('Error fetching preferences data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle source selection
  const handleSourceChange = (source: string, checked: boolean) => {
    const newSources = checked
      ? [...preferences.preferredSources, source]
      : preferences.preferredSources.filter(s => s !== source);
    
    updatePreferredSources(newSources);
  };

  // Handle category selection
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...preferences.preferredCategories, category]
      : preferences.preferredCategories.filter(c => c !== category);
    
    updatePreferredCategories(newCategories);
  };

  // Handle adding an author
  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorInput.trim()) return;
    
    // Add to local state
    const newAuthors = [...authorsList, authorInput.trim()];
    setAuthorsList(newAuthors);
    
    // Update context
    updatePreferredAuthors(newAuthors);
    
    // Reset input
    setAuthorInput('');
  };

  // Handle removing an author
  const handleRemoveAuthor = (author: string) => {
    const newAuthors = authorsList.filter(a => a !== author);
    setAuthorsList(newAuthors);
    updatePreferredAuthors(newAuthors);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalize Your News</CardTitle>
          <CardDescription>
            Choose your preferred news sources, categories, and authors to get a personalized news feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Sources */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferred Sources</h3>
            <p className="text-sm text-muted-foreground">
              Select the news sources you trust and want to see more often.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading sources...</p>
              ) : (
                sources.slice(0, 12).map(source => (
                  <div key={source} className="flex items-start space-x-2">
                    <Checkbox
                      id={`pref-source-${source}`}
                      checked={preferences.preferredSources.includes(source)}
                      onCheckedChange={(checked) => 
                        handleSourceChange(source, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`pref-source-${source}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {source}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preferred Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferred Categories</h3>
            <p className="text-sm text-muted-foreground">
              Select the news categories you&apos;re interested in.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              ) : (
                categories.slice(0, 12).map(category => (
                  <div key={category} className="flex items-start space-x-2">
                    <Checkbox
                      id={`pref-category-${category}`}
                      checked={preferences.preferredCategories.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`pref-category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preferred Authors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferred Authors</h3>
            <p className="text-sm text-muted-foreground">
              Add authors you want to follow. Their articles will be prioritized.
            </p>
            
            <form onSubmit={handleAddAuthor} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter author name"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit" size="sm">Add</Button>
            </form>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {authorsList.map(author => (
                <div 
                  key={author} 
                  className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm"
                >
                  <span>{author}</span>
                  <button
                    onClick={() => handleRemoveAuthor(author)}
                    className="ml-1 h-4 w-4 rounded-full hover:bg-background/20 inline-flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {authorsList.length === 0 && (
                <p className="text-sm text-muted-foreground">No authors added yet.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetPreferences}
          >
            Reset All Preferences
          </Button>
          <Button>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 