'use client';

import React from 'react';
import { ArticleList } from '@/components/news/ArticleList';
import { useNews } from '@/lib/context/NewsContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PersonalizedFeed() {
  const { personalizedArticles, isLoading, error, preferences } = useNews();
  
  const hasPreferences = 
    preferences.preferredSources.length > 0 || 
    preferences.preferredCategories.length > 0 || 
    preferences.preferredAuthors.length > 0;

  return (
    <div className="container max-w-full py-4 md:py-8 px-4 md:px-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Personalized Feed</h1>
        <p className="text-muted-foreground">
          News tailored to your interests and preferences.
        </p>
      </div>

      {!hasPreferences ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Set Up Your Preferences</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            You haven&apos;t set any preferences yet. Choose your favorite sources, categories, and authors to get a personalized news feed.
          </p>
          <Button asChild>
            <Link href="/preferences">Set Up Preferences</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 border rounded-lg bg-card w-full">
            <h3 className="text-lg font-medium mb-2">Your Preferences</h3>
            
            {preferences.preferredSources.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-1">Sources:</h4>
                <div className="flex flex-wrap gap-1">
                  {preferences.preferredSources.map(source => (
                    <span key={source} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {preferences.preferredCategories.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-1">Categories:</h4>
                <div className="flex flex-wrap gap-1">
                  {preferences.preferredCategories.map(category => (
                    <span key={category} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {preferences.preferredAuthors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Authors:</h4>
                <div className="flex flex-wrap gap-1">
                  {preferences.preferredAuthors.map(author => (
                    <span key={author} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {author}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/preferences">Edit Preferences</Link>
              </Button>
            </div>
          </div>

          <ArticleList articles={personalizedArticles} isLoading={isLoading} />

          {error && (
            <div className="p-4 border border-destructive text-destructive rounded-md">
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 