'use client';

import React from 'react';
import { ArticleList } from '@/components/news/ArticleList';
import { Filters } from '@/components/news/Filters';
import { DebugInfo } from '@/components/news/DebugInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNews } from '@/lib/context/NewsContext';

export default function Home() {
  const { articles, filteredArticles, personalizedArticles, isLoading, error } = useNews();

  return (
    <div className="container max-w-full py-4 md:py-8 px-4 md:px-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Latest News</h1>
        <p className="text-muted-foreground">
          Stay informed with the latest news from multiple trusted sources.
        </p>
      </div>

      <Filters />

      <Tabs defaultValue="all" className="mb-6 md:mb-8 w-full">
        <TabsList className="mb-2 w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-none">All News</TabsTrigger>
          <TabsTrigger value="filtered" className="flex-1 md:flex-none">Filtered</TabsTrigger>
          <TabsTrigger value="personalized" className="flex-1 md:flex-none">For You</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-2 md:mt-4">
          <ArticleList articles={articles} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="filtered" className="mt-2 md:mt-4">
          <ArticleList articles={filteredArticles} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="personalized" className="mt-2 md:mt-4">
          <ArticleList articles={personalizedArticles} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-4 border border-destructive text-destructive rounded-md mb-4">
          <p className="mb-2 font-medium">Error loading news:</p>
          <p>{error}</p>
        </div>
      )}
      
      <DebugInfo />
    </div>
  );
}
