import React from 'react';
import { Article } from '@/lib/types';
import { ArticleCard } from './ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
}

export function ArticleList({ articles, isLoading }: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 w-full">
        <h3 className="text-2xl font-bold">No articles found</h3>
        <p className="text-muted-foreground mt-2 text-center">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-full mt-2" />
        <Skeleton className="h-6 w-2/3 mt-2" />
      </div>
      
      <Skeleton className="w-full h-48" />
      
      <div className="p-4 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </div>
      
      <div className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
} 