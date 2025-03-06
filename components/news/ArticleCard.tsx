import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const {
    title,
    description,
    imageUrl,
    source,
    author,
    category,
    publishedAt,
    url,
  } = article;

  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getSourceInitials = (source: string) => {
    return source
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <CardHeader className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6 md:h-8 md:w-8">
            <AvatarFallback>{getSourceInitials(source)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-xs md:text-sm font-medium truncate max-w-[150px] md:max-w-[200px]">{source}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <h3 className="text-base md:text-lg font-bold leading-tight line-clamp-2">{title}</h3>
        </a>
      </CardHeader>
      
      {imageUrl && (
        <div className="w-full h-36 md:h-48 relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <CardContent className="p-3 md:p-4 flex-grow">
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-3 md:p-4 pt-0">
        <div className="flex items-center gap-1 flex-wrap">
          {category && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] md:text-xs font-semibold truncate max-w-[100px]">
              {category}
            </span>
          )}
          {author && (
            <span className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[120px]">
              {author}
            </span>
          )}
        </div>
        
        <Button asChild variant="outline" size="sm" className="h-7 md:h-8 text-xs md:text-sm px-2 md:px-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Read More
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
} 