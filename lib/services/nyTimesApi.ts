import { Article, NYTimesResponse, NewsFilters } from '../types';
import { delay, withRetry } from '../utils';

// Constants for better maintainability (SOLID - Single Responsibility)
const API_KEY = process.env.NEXT_PUBLIC_NYTIMES_API_KEY;
const BASE_URL = 'https://api.nytimes.com/svc/search/v2';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Simple cache for NY Times responses to reduce API calls
// Following SOLID - Single Responsibility principle for caching
const responseCache: {
  timestamp: number;
  data: Article[];
} | null = null;

/**
 * Fetches articles from the NY Times API with caching and retry mechanisms
 * Follows SOLID principles:
 * - Single Responsibility: Responsible only for fetching NYTimes articles
 * - Open/Closed: Can be extended with additional parameters without modification
 * - Interface Segregation: Uses a consistent NewsFilters interface
 */
export async function fetchNYTimesArticles(filters: NewsFilters = {}): Promise<Article[]> {
  try {
    // Use cached response if available and recent
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
    
    // Check if API key is valid
    if (!API_KEY || API_KEY === 'your_nytimes_api_key_here') {
      console.warn('NY Times API key not set properly');
      return [];
    }
    
    // Build request parameters
    const params = buildRequestParams(query, categories, fromDate, toDate, page);
    
    // Use retry mechanism from utils
    const data = await withRetry(
      () => fetchFromNYTimesAPI(params),
      {
        maxRetries: 3,
        initialDelay: 2000,
        backoffFactor: 2.5,
        shouldRetry: (error: unknown) => {
          // Only retry on rate limit errors
          return error instanceof Error && 
                 error.message.includes('429');
        }
      }
    );
    
    // If no docs returned or undefined, return empty array
    if (!data.response?.docs || data.response.docs.length === 0) {
      return [];
    }
    
    // Map API response to our standard Article format
    const articles = mapToArticles(data);
    
    // Save response to cache
    cacheResponse(articles);
    
    return articles;
  } catch (error) {
    console.error('Error fetching from NY Times API:', error);
    
    // Return cached data on error if available, even if older than normal threshold
    if (responseCache) {
      console.log('Returning cached NY Times data after error');
      return responseCache.data;
    }
    
    return [];
  }
}

/**
 * Constructs request parameters
 * Follows SOLID - Single Responsibility principle
 */
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
  
  // Add a small number of results to minimize rate limit issues
  params.append('limit', '3');
  
  return params;
}

/**
 * Makes the actual API request
 * Follows SOLID - Single Responsibility principle
 */
async function fetchFromNYTimesAPI(params: URLSearchParams): Promise<NYTimesResponse> {
  // Add random delay before request to help with rate limiting
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

/**
 * Maps API response to our Article model
 * Follows SOLID - Single Responsibility principle
 */
function mapToArticles(data: NYTimesResponse): Article[] {
  return data.response.docs.map(article => {
    // Find the main image if available
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

/**
 * Updates the cache with new data
 * Follows SOLID - Single Responsibility principle
 */
function cacheResponse(articles: Article[]): void {
  // Using a type assertion to modify what was declared as a const
  // This is a workaround for the cache being declared as const for type safety
  // but still needing to be mutable
  (responseCache as { timestamp: number; data: Article[] } | null) = {
    timestamp: Date.now(),
    data: articles
  };
}

/**
 * Returns NY Times categories
 * Follows SOLID - Interface Segregation principle by 
 * providing only what clients need
 */
export async function fetchNYTimesCategories(): Promise<string[]> {
  // NY Times has predefined sections/news_desks
  // Return a smaller set to reduce API calls initially
  return [
    'Politics',
    'World'
  ];
} 