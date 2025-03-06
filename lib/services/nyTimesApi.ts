import { Article, NYTimesResponse, NewsFilters } from '../types';
import { delay, withRetry } from '../utils';

const API_KEY = process.env.NEXT_PUBLIC_NYTIMES_API_KEY;
const BASE_URL = 'https://api.nytimes.com/svc/search/v2';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Simple cache for NY Times responses to reduce API calls
const responseCache: {
  timestamp: number;
  data: Article[];
} | null = null;

/**
 * Fetches articles from the NY Times API with caching and retry mechanisms
 */
export async function fetchNYTimesArticles(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    if (responseCache && (Date.now() - responseCache.timestamp < CACHE_DURATION)) {
      console.log('Using cached NY Times response to avoid rate limits');
      return responseCache.data;
    }
    
    const { 
      query, 
      categories, 
      fromDate,
      toDate,
      page = 1
    } = filters;
    
    if (!API_KEY || API_KEY === 'your_nytimes_api_key_here') {
      console.warn('NY Times API key not set properly');
      return [];
    }
    
    const params = buildRequestParams(query, categories, fromDate, toDate, page);
    
    const data = await withRetry(
      () => fetchFromNYTimesAPI(params),
      {
        maxRetries: 3,
        initialDelay: 2000,
        backoffFactor: 2.5,
        shouldRetry: (error: unknown) => {
          return error instanceof Error && 
                 error.message.includes('429');
        }
      }
    );
    
    if (!data.response?.docs || data.response.docs.length === 0) {
      return [];
    }
    
    const articles = mapToArticles(data);
    
    cacheResponse(articles);
    
    return articles;
  } catch (error) {
    console.error('Error fetching from NY Times API:', error);
    
    if (responseCache) {
      console.log('Returning cached NY Times data after error');
      return responseCache.data;
    }
    
    return [];
  }
}

function buildRequestParams(
  query?: string, 
  categories?: string[], 
  fromDate?: string, 
  toDate?: string, 
  page: number = 1
): URLSearchParams {
  const params = new URLSearchParams({
    'api-key': API_KEY || '',
    'page': page.toString(),
  });
  
  if (query) params.append('q', query);
  if (categories?.length) params.append('fq', `news_desk:(${categories.join(' ')})`);
  if (fromDate) params.append('begin_date', fromDate.replace(/-/g, ''));
  if (toDate) params.append('end_date', toDate.replace(/-/g, ''));
  
  params.append('limit', '3');
  
  return params;
}

async function fetchFromNYTimesAPI(params: URLSearchParams): Promise<NYTimesResponse> {
  await delay(Math.random() * 1000);
  
  const response = await fetch(`${BASE_URL}/articlesearch.json?${params.toString()}`);
  
  if (response.status === 429) {
    throw new Error(`NY Times API error: 429`);
  }
  
  if (!response.ok) {
    throw new Error(`NY Times API error: ${response.status}`);
  }
  
  return await response.json();
}

function mapToArticles(data: NYTimesResponse): Article[] {
  return data.response.docs.map(article => {
    const mainImage = article.multimedia?.find(media => media.type === 'image');
    const imageUrl = mainImage 
      ? `https://www.nytimes.com/${mainImage.url}` 
      : '';
      
    return {
      id: article._id,
      title: article.headline.main,
      description: article.snippet,
      content: article.snippet,
      url: article.web_url,
      imageUrl,
      source: 'The New York Times',
      author: article.byline?.original?.replace('By ', '') || undefined,
      category: article.section_name,
      publishedAt: article.pub_date,
      apiSource: 'nytimes' as const,
    };
  });
}

function cacheResponse(articles: Article[]): void {
  // Using a type assertion to modify what was declared as a const
  (responseCache as { timestamp: number; data: Article[] } | null) = {
    timestamp: Date.now(),
    data: articles
  };
}

export async function fetchNYTimesCategories(): Promise<string[]> {
  return [
    'Politics',
    'World'
  ];
} 